// connect to Moralis server
Moralis.start({
    serverUrl: "https://jkhjbmnk50jf.grandmoralis.com:2053/server",
    appId: "YTjl1E3BA9GWdOOhrUpNUbWtWqh91kkBMCR8AHv1",
  });

let web3  
  
  const contract_nft = "0x2190CDd0cc0f306Be840eF491a8a6E23b053C675"; //NFT Minting Contract Use This One "Batteries Included", code of this contract is in the github repository under contract_base for your reference.
  const optionsNft = { chain: "mumbai", address: contract_nft };

  
  async function mint() {
    web3 = await Moralis.enableWeb3();
    const accounts = await Moralis.User.current();
    //const contract = new web3.eth.Contract(nft_ABI, contract_nft);
    console.log(accounts);
    //console.log(contract);
    //let SN = document.getElementById("SerialNummer").value;
  
    /*if (SN != "") {
      document.querySelector("#SerialNummer").disabled = true;
      document.querySelector("#name").disabled = true;
      const image = document.querySelector("#image");
      let data = image.files[0];
      const imageFile = new Moralis.File(data.name, data)
      await imageFile.saveIPFS();
      const bildLink = imageFile.ipfs();
      const metadata = {
        name: document.getElementById("name").value,
        date: Date(),
        description: SN,
        image: bildLink
      };
      const metadataFile = new Moralis.File("metadata.json", {
        base64: btoa(JSON.stringify(metadata)),
      });
      await metadataFile.saveIPFS();
      const metadataURI = metadataFile.ipfs();

      console.log(document.getElementById("name").value, SN, metadataURI)

  
      /*contract.methods
        .mintBottle(document.getElementById("name").value, SN, metadataURI)
        .send({ from: accounts[0], value: 0 });*/
    /*} else {
      alert("please give the information");
    }*/
  }
  
  getNFTs = async () => {
    web3 = await Moralis.Web3.enable();
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(LagerAbi, contract_lager);
    const get = await contract.methods.GetNFTs().call({ from: accounts[0] });
    //console.log(get);
  
    let table = `
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
    }
  };
  
  //getNFTs();
  
  if (document.querySelector("#btn-mint")) {
    document.querySelector("#btn-mint").onclick = mint;
}
  