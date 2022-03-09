// connect to Moralis server
Moralis.start({
  serverUrl: "https://jkhjbmnk50jf.grandmoralis.com:2053/server",
  appId: "YTjl1E3BA9GWdOOhrUpNUbWtWqh91kkBMCR8AHv1",
});

let homepage = "http://127.0.0.1:5500/Data_Dapp/index.html";

if (Moralis.User.current() == null && window.location.href != homepage) {
  document.querySelector("body").style.display = "none";
  window.location.href = "index.html";
}

let web3;

const contract_lager = "0xeC41E1e013C07d497355182B80ebbF23F69956A6"; //NFT Minting Contract Use This One "Batteries Included", code of this contract is in the github repository under contract_base for your reference.
const optionsLager = { chain: "mumbai", address: contract_lager };
const options = {
  chain: "mumbai",
  address: "0x5d7b02ABF6F50266dC2f4816908D58e088DE4277",
};

login = async () => {
  var user = await Moralis.Web3.authenticate();
  if (user) {
    console.log("logged in");
    user.set("name", document.getElementById("user-username").value);
    user.set("email", document.getElementById("user-email").value);
    await user.save();
    window.location.href = "dashboard.html";
  } else {
    console.log("login fails!!!");
  }
};

logout = async () => {
  await Moralis.User.logOut();
  console.log("used ausgelog");
  window.location.href = "index.html";
};

balance = async () => {
  const mumbaiBalance = await Moralis.Web3API.account.getNativeBalance(options);
  document.getElementById("balance").innerHTML =
    (mumbaiBalance.balance / 1e18).toFixed(5) + " MATIC";
  // hash function start
 /* web3 = await Moralis.Web3.enable();
  const contractLager = new web3.eth.Contract(LagerAbi, contract_lager);
  console.log(contractLager);
  let url = "https://true.wine/storage/sensors/3/values.json";
  const res = await fetch(url);
  //const values = await res.arrayBuffer();
  //const Mydata = await values.values;
  console.log(res);   
  /*setInterval(async function () {
    let url = "https://true.wine/storage/sensors/3/values.json";
    try {
      const res = await fetch(url);
      const myJson = await res.text();
      // console.log(myJson);
      const hash = await CryptoJS.SHA256(myJson);
      console.log(hash.toString());
    } catch (error) {
      console.log(error);
    }
  }, 3000);*/
};
balance();

init = async () =>{
  //web3 = await Moralis.Web3.enable();
  //const contractLager = new web3.eth.Contract(LagerAbi, contract_lager);
  const query = new Moralis.Query("newSensorEvent");
  const resultQuery = await query.find();
  let ids = [] 
  if( resultQuery.length>0){
    await resultQuery.forEach((e)=>{
        ids.push(e.attributes.sendorId);
    })
  }
  for(i=0; i< ids.length; i++){
    let url = await "https://true.wine/storage/sensors/"+ids[i]+"/values.json";
    const res = await fetch(url);
    let myJson = await res.json();
    let myData = await myJson.values;
    //console.log(myData[0].updated_at);
    //console.log(myData);
    const grouping = _.groupBy(myData, element => element.updated_at.substring(0, 10))
    const sections = _.map(grouping, (items, date) => ({
        date: date,
        myData: items
    }));
    let h = sections[0].myData;
    //console.log(h);
    // console.log(JSON.stringify(h));
     console.log(CryptoJS.SHA256(JSON.stringify(h)).toString());
    //console.log(sections.length);
    /*if(sections.length > 0){
      for (e=0; e<sections.length ; e++){
        console.log(sections[e].myData.text());
      }
7bf47c3ab44289dcb5b9a7f56960af9ac587acabf72c0020ad194046e1027053
7bf47c3ab44289dcb5b9a7f56960af9ac587acabf72c0020ad194046e1027053
    }*/
  }  
}



/*hashing = async (myArray) => {
  web3 = await Moralis.Web3.enable();
  const contractLager = new web3.eth.Contract(LagerAbi, contract_lager);
  for(i=0; i < myArray.length; i++){
  const controler = await contractLager.methods
  .get_sendor_data(myArray[i].date)
  .call({ from: accounts[0] });
  if (controler != "0x0000000000000000000000000000000000000000000000000000000000000000"){
    const myData = myArray[i].myData;
    // console.log(myData);
    const hash = await CryptoJS.SHA256(myData);

  }

  }

}*/


     /* let id = await e.attributes.sendorId;
      let url = await "https://true.wine/storage/sensors/"+id+"/values.json";
      fetch(url)
        .then((res)=>{
          let myData = await res.json().values;
          console.log(myData);
        })//.then((myjson)=>{})*/

init();



getTransactions = async () => {
  console.log("get transactions clicked");
  const transactions = await Moralis.Web3API.account.getTransactions(options);
  console.log(transactions);
  if (transactions.total > 0) {
    let table = `
    <table class="table table-striped cell-border" style="width:100%">
    <thead>
        <tr>
            <th scope="col">Transactions</th>
            <th scope="col">Block Number</th>
            <th scope="col">Age</th>
            <th scope="col">Type</th>
            <th scope="col">Fee</th>
            <th scope="col">Value</th>
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
    document.querySelector("#tableOfTransactions").innerHTML = table;

    await transactions.result.forEach((t) => {
      let content = `
      <tr>
          <td><a href='https://mumbai.polygonscan.com/tx/${
            t.hash
          }' target="_blank" rel="noopener noreferrer">${t.hash}</a></td>
          <td>${t.block_number}</td>
          <td>${t.block_timestamp.toString().substr(0, 19)}</td>
          <td>${
            t.from_address == Moralis.User.current().get("ethAddress")
              ? "Outgoing"
              : "Incoming"
          }</td>
          <td>${((t.gas * t.gas_price) / 1e18).toFixed(5)} MATIC</td>
          <td>${t.value / 1e18} MATIC</td>
      </tr>
      `;
      theTransactions.innerHTML += content;
    });
  }
};

toStorageBottle = async () => {
  window.location.href = "storage.html";
};

async function newlager() {
  web3 = await Moralis.Web3.enable();
  let lagerid = document.getElementById("lagerId-input").value;
  let location = document.getElementById("location-input").value;
  document.querySelector("#lagerId-input").disabled = true;
  document.querySelector("#location-input").disabled = true;
  //web3.eth.accounts.wallet.add("a2c6fba310e9a8da2d74ee9bb1681efc69c34b173821f058c7c8da3703b71843");
  if (lagerid != "" && location != "") {
    const accounts = await web3.eth.getAccounts();
    const contractLager = new web3.eth.Contract(LagerAbi, contract_lager);
    const a = contractLager.methods
      .setLager(lagerid, location)
      .send({ from: accounts[0], Value: 0 });
    console.log("ok: lagerid:", lagerid, "location:", location);
    console.log(a);
  } else {
    alert("please give the information - please update the page");
  }
  document.querySelector("#lagerId-input").disabled = false;
  document.querySelector("#location-input").disabled = false;
  document.querySelector("#lagerId-input").value = "";
  document.querySelector("#location-input").value = "";
}

async function newsensor() {
  let lagerID = document.getElementById("lager-input").value;
  let sensorId = document.getElementById("sensorId-input").value;
  let name = document.getElementById("name-input").value;
  document.querySelector("#lager-input").disabled = true;
  document.querySelector("#sensorId-input").disabled = true;
  document.querySelector("#name-input").disabled = true;
  web3 = await Moralis.Web3.enable();
  if (lagerID != "" && sensorId != "" && name != "") {
    const accounts = await web3.eth.getAccounts();
    const contractLager = new web3.eth.Contract(LagerAbi, contract_lager);
    const a = await contractLager.methods
      .SetSensor(lagerID, sensorId, name)
      .send({ from: accounts[0], Value: 0 });
    console.log(a);
  } else {
    alert("please give the information - please update the page");
  }
  document.querySelector("#lager-input").disabled = false;
  document.querySelector("#sensorId-input").disabled = false;
  document.querySelector("#name-input").disabled = false;
}

if (document.querySelector("#btn-login") != null) {
  document.querySelector("#btn-login").onclick = login;
}
if (document.querySelector("#btn-logout") != null) {
  document.querySelector("#btn-logout").onclick = logout;
}

if (document.querySelector("#get-transactions-link")) {
  document.querySelector("#get-transactions-link").onclick = getTransactions;
}
if (document.querySelector("#get-nfts-link")) {
  document.querySelector("#get-nfts-link").onclick = toStorageBottle;
}

if (document.querySelector("#upload")) {
  document.querySelector("#upload").onclick = upload;
}

//get-transactions-link
//get-balances-link
//get-nfts-link
