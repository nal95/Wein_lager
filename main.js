// connect to Moralis server
Moralis.start({
  serverUrl: "https://jkhjbmnk50jf.grandmoralis.com:2053/server",
  appId: "YTjl1E3BA9GWdOOhrUpNUbWtWqh91kkBMCR8AHv1",
});

let homepage = "http://127.0.0.1:5500/index.html";

if (Moralis.User.current() == null && window.location.href != homepage) {
  document.querySelector("body").style.display = "none";
  window.location.href = "index.html";
}

let web3;

const contract_lager = "0x6fa822903F82a5DE2d803a2b13C8fe13459AcB1f"; 
const optionsLager = { chain: "mumbai", address: contract_lager };
const options = {chain: "mumbai", address: "0x01FC3Ab2404a3cE87066B329C6A15590D21a2EDA",};

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

getTransactions = async () => {
  console.log("get transactions clicked");
  const transactions = await Moralis.Web3API.account.getTransactions(options);
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

async function setStorage() {
  web3 = await Moralis.Web3.enable();
  let lagerid = document.getElementById("lagerId-input").value;
  document.querySelector("#lagerId-input").disabled = true;
  document.querySelector("#location-input").disabled = true;
  //web3.eth.accounts.wallet.add("a2c6fba310e9a8da2d74ee9bb1681efc69c34b173821f058c7c8da3703b71843");
  if (lagerid != "" && location != "") {
    const accounts = await web3.eth.getAccounts();
    const contractLager = new web3.eth.Contract(s_ABI, contract_lager);
    const a = contractLager.methods
      .setLager(lagerid, location)
      .send({ from: accounts[0], Value: 0 });
    console.log("ok: lagerid:", lagerid, "location:", location);
    console.log(a);
  } else {
    alert("please give the information - please update the page");
  }
  document.querySelector("#lagerId-input").disabled = false;
  document.querySelector("#lagerId-input").value = "";
}

async function newsensor() {
  let lagerID = document.getElementById("lager-input").value;
  let sensorId = document.getElementById("sensorId-input").value;
  document.querySelector("#lager-input").disabled = true;
  document.querySelector("#sensorId-input").disabled = true;
  web3 = await Moralis.Web3.enable();
  if (lagerID != "" && sensorId != "") {
    const accounts = await web3.eth.getAccounts();
    const contractLager = new web3.eth.Contract(s_ABI, contract_lager);
    const a = await contractLager.methods
      .sensorRegistration(lagerID, sensorId)
      .send({ from: accounts[0], Value: 0 });
    console.log(a);
  } else {
    alert("please give the information - please update the page");
  }
  document.querySelector("#lager-input").disabled = false;
  document.querySelector("#sensorId-input").disabled = false;
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
