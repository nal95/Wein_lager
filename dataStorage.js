// connect to Moralis server
Moralis.start({
  serverUrl: "https://jkhjbmnk50jf.grandmoralis.com:2053/server",
  appId: "YTjl1E3BA9GWdOOhrUpNUbWtWqh91kkBMCR8AHv1",
});

let web3;

const contract_lager = "0xe0d6Dcd7D7e81C890f62D6887F8Bc4EFA17e1Ea9"; //NFT Minting Contract Use This One "Batteries Included", code of this contract is in the github repository under contract_base for your reference.
const optionsLager = { chain: "mumbai", address: contract_lager };

async function toStoreData() {
  let date = document.getElementById("date").value;
  let hashlink = document.getElementById("hash").value;
  let sensorid = document.getElementById("sensorid").value;
  document.querySelector("#date").disabled = true;
  document.querySelector("#hash").disabled = true;
  document.querySelector("#sensorid").disabled = true;
  web3 = await Moralis.Web3.enable();
  if (date != "" && hashlink != "" && sensorid != "") {
    const accounts = await web3.eth.getAccounts();
    const res = await fetch(hashlink);
    const myJson = await res.text();
    const hash = await CryptoJS.SHA256(myJson);
    const contractLager = new web3.eth.Contract(LagerAbi, contract_lager);
    const a = await contractLager.methods
      .save_sensor_data(date, hash.toString(), sensorid)
      .send({ from: accounts[0], Value: 0 });
    //console.log(a);
  } else {
    alert("please give the information - please update the page");
  }
}

async function toVerifyData() {
  let date = document.getElementById("date").value;
  let hash = document.getElementById("hash").value;
  let sensorid = document.getElementById("sensorid").value;
  document.querySelector("#date").disabled = true;
  document.querySelector("#hash").disabled = true;
  document.querySelector("#sensorid").disabled = true;
  web3 = await Moralis.Web3.enable();
  if (date != "" && hash != "" && sensorid != "") {
    const accounts = await web3.eth.getAccounts();
    const contractLager = new web3.eth.Contract(LagerAbi, contract_lager);
    const a = await contractLager.methods
      .verifySensorData(date, hash, sensorid)
      .call({ from: accounts[0] });
    //console.log(a);
    alert(a);
  } else {
    alert("please give the information - please update the page");
  }
}

async function getKeccakHash() {
  const query = new Moralis.Query("storageEvent");
  const findResult = await query.find();

  // console.log("in", findResult);
  let table = `
      <h5>Current data that are stored</h5>
      <table class="table table-striped cell-border" style="width:100%">
      <thead>
          <tr>
              <th scope="col">Date</th>
              <th scope="col">Keccak-256 Hash</th>
              <th scope="col">Transaction Hash</th>
              <th scope="col">Status</th>
              </tr>
      </thead>
      <tbody id="theAttributes">
      </tbody>
      </table>
      `;
  $(document).ready(function () {
    $("table").DataTable({
      searching: false,
      ordering: false,
    });
  });
  document.querySelector("#tableOfData").innerHTML = table;

  if (findResult.length > 0) {
    await findResult.forEach((e) => {
      let Data = e.attributes;
      let content = `
            <tr>
              <td>${Data.date}</td>
              <td>${Data.Hash}</td>
              <td><a href='https://mumbai.polygonscan.com/tx/${Data.transaction_hash}' target="_blank" rel="noopener noreferrer">${Data.transaction_hash}</a></td>
              <td>${Data.confirmed}</td>


            </tr>
        `;
      theAttributes.innerHTML += content;
    });
  } else {
    let content = `
            <tr>
              <td>NULL</td>
              <td>NULL</td>
              <td>NULL</td>
              <td>NULL</td>
            </tr>
        `;
    theAttributes.innerHTML += content;
  }
}

/*async function getUsers() {
  setInterval(async function(){
    let url = 'https://true.wine/storage/sensors/3/values.json';
  try {
    const res = await fetch(url);
    const myJson = await res.text();
    // console.log(myJson);
     const hash = await CryptoJS.SHA256(myJson);   
    console.log(hash.toString()); 
  } catch (error) {
      console.log(error);
  }
 },300000);
}
getUsers();*/

getKeccakHash();

if (document.querySelector("#btn-save")) {
  document.querySelector("#btn-save").onclick = toStoreData;
}

if (document.querySelector("#btn-verify")) {
  document.querySelector("#btn-verify").onclick = toVerifyData;
}
