// connect to Moralis server
Moralis.start({
    serverUrl: "https://jkhjbmnk50jf.grandmoralis.com:2053/server",
    appId: "YTjl1E3BA9GWdOOhrUpNUbWtWqh91kkBMCR8AHv1",
  });

let web3  
  
  const contract_nft = "0xf25E6ecdab9332cB427CB88cA2E92f6a89341a32"; //NFT Minting Contract Use This One "Batteries Included", code of this contract is in the github repository under contract_base for your reference.
  const option = { chain: "mumbai", address: contract_nft };
  const options = { chain: "mumbai", address: "0x01FC3Ab2404a3cE87066B329C6A15590D21a2EDA", token_address: "0xf25E6ecdab9332cB427CB88cA2E92f6a89341a32" };


  
  async function mint() {
    web3 = await new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(nft_ABI, contract_nft);
    let SN = document.getElementById("SerialNummer").value;
    let wine = document.getElementById("name").value;
  
    if (SN != "") {
      document.querySelector("#SerialNummer").disabled = true;
      document.querySelector("#name").disabled = true;
      const image = document.querySelector("#image");
      let data = image.files[0];
      const imageFile = new Moralis.File(data.name, data)
      await imageFile.saveIPFS();
      const bildLink = await imageFile.ipfs();
      //console.log(bildLink)
      const metadata = {
        name: wine,
        date: Date(),
        description: SN,
        image: bildLink
      };
      const metadataFile = new Moralis.File("metadata.json", {
        base64: btoa(JSON.stringify(metadata)),
      });
      await metadataFile.saveIPFS();
      const metadataURI = await metadataFile.ipfs();
      //const Url = '/ipfs/' + metadataFile.hash()

      //console.log(Url , wine, SN, metadataURI)
      //Chardonnay 500 0423634A2F7080 https://ipfs.moralis.io:2053/ipfs/QmSGECLQ3bUPYCiwiemtiAVBkDwf6UfGMGYdgBCBNigEfJ
  
      await contract.methods
        .mintBottle(wine, SN, metadataURI)
        .send({ from: accounts[0]}).on("receipt", function(r){
          setTimeout(function(){
            alert("nft was successfully minted")
            window.location.reload(true);
          },60000);
        });
    } else {
      alert("please give the required information");
    }
  }
  
   async function getNFTs(){
    web3 = await Moralis.enableWeb3();
    const polygonNFTs = await Moralis.Web3API.account.getNFTs(options);
    const result = await polygonNFTs.result    
    result.forEach((n) => {
      let metadata = n.token_uri;
      fetch(metadata)
        .then((response) => response.json())
        .then((data) => {
          let theTransactions = document.getElementById("tableOfNFTs");
          let content = `
        <div class= "nft">
            <img  src="${data.image}" width="100%" >
            <p> Date: ${data.date.toString().substr(0, 21)} </p>
            <p>Name: ${data.name}</p>
            <p>Uid: ${data.description} </p>
        </div>
        `;
          theTransactions.innerHTML += content;
        });
    });

  
   /* let table = `
      <table class="table table-striped cell-border" style="width:100%">
      <thead>
          <tr>
              <th scope="col">Date</th>
              <th scope="col">Name</th>
              <th scope="col">Uid</th>
          </tr>
      </thead>
      <tbody id="theTransactions">
      </tbody>
      </table>
      `;
    $(document).ready(function () {
      $("table").DataTable({
        searching: false,
        ordering: false,
      });
    });
  
    document.querySelector("#tableOfNFTs").innerHTML = table;
    if (get.length > 0) {
      await get.forEach((n) => {
        //console.log(JSON.parse(n.metadata));
        let metadata = n.Uri;
        fetch(metadata)
          .then((response) => response.json())
          .then((data) => {
            let content = `
          <tr>
              <td class="card-title" style="font-family:verdana">${data.date
                .toString()
                .substr(0, 25)}</td>
              <td class="card-title" style="font-family:verdana">${data.name}</td>
              <td class="card-title" style="font-family:verdana">${
                data.serialnummer
              } </td>
          </tr>
          `;
            theTransactions.innerHTML += content;
          });
      });
    } else {
      let content = `
            <tr>
              <td>NULL</td>
              <td>NULL</td>
              <td>NULL</td>
            </tr>
        `;
      theTransactions.innerHTML += content;
    }*/
  };
  
  getNFTs();
  
  if (document.querySelector("#btn-mint")) {
    document.querySelector("#btn-mint").onclick = mint;
}
  