// connect to Moralis server
Moralis.start({
  serverUrl: "https://jkhjbmnk50jf.grandmoralis.com:2053/server",
  appId: "YTjl1E3BA9GWdOOhrUpNUbWtWqh91kkBMCR8AHv1",
});

let web3;

const contract_lager = "0x487bdc5f7ED73f08e319040aB0470e1Db10f2E5C"; 
const optionsLager = { chain: "mumbai", address: contract_lager };
let hashlink = "http://localhost:8000/storage/sensors/datas";

async function toStoreData() {
  let lagerId = document.getElementById("lagerId").value;
  let sensorId = document.getElementById("sensorId").value;
  document.querySelector("#lagerId").disabled = true;
  document.querySelector("#sensorId").disabled = true;
  if (lagerId != "" && sensorId != "") {
    web3 = await new Web3(window.ethereum);
    const contractLager = new web3.eth.Contract(s_ABI, contract_lager);
    const accounts = await web3.eth.getAccounts();
    const res = await fetch(hashlink);
    const s = await res.text();
    console.log(s)
    const hash = await CryptoJS.SHA256(s)
    await contractLager.methods
      .dataStorage(lagerId, sensorId, hash.toString())
      .send({ from: accounts[0]}).on("receipt", function(r){
        setTimeout(function(){
          alert("data was successfully saved")
          window.location.reload(true);
        },10000);
      });
  } else {
    alert("please give the information - please update the page");
  }
}
async function toVerifyData() {
  let lagerId = document.getElementById("lagerId").value;
  let sensorId = document.getElementById("sensorId").value;
  document.querySelector("#lagerId").disabled = true;
  document.querySelector("#sensorId").disabled = true;
  if (lagerId != "" && sensorId != "") {
    web3 = await new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contractLager = new web3.eth.Contract(s_ABI, contract_lager);
    const a = await contractLager.methods
      .verifySensorData(lagerId, hash, sensorId)
      .call({ from: accounts[0] });
    alert(a);
  } else {
    alert("please give the information - please update the page");
  }
}

async function getHash() {
  const query = new Moralis.Query("Storings");
  const findResult = await query.find();
  console.log(findResult)

  let table = `
      <h5>Current data that are stored</h5>
      <table class="table table-striped cell-border" style="width:100%">
      <thead>
          <tr>
              <th scope="col">Date</th>
              <th scope="col">Hash</th>
              <th scope="col">Storage_Id</th>
              <th scope="col">Sensor_Id</th>
              <th scope="col">Transaction Hash</th>
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
              <td>${Date(Data.time).toString().substr(0, 21)}</td>
              <td>${Data.dataHash}</td>
              <td>${Data.storageId}</td>
              <td>${Data.sensorId}</td>
              <td><a href='https://mumbai.polygonscan.com/tx/${Data.transaction_hash}' target="_blank" rel="noopener noreferrer"> Thx </a></td>
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
              <td>NULL</td>
            </tr>
        `;
    theAttributes.innerHTML += content;
  }
}


getHash();

if (document.querySelector("#btn-save")) {
  document.querySelector("#btn-save").onclick = toStoreData;
}

if (document.querySelector("#btn-verify")) {
  document.querySelector("#btn-verify").onclick = toVerifyData;
}
