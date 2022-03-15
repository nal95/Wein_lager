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

const contract_lager = "0x487bdc5f7ED73f08e319040aB0470e1Db10f2E5C"; 
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

async function newlager(){
  web3 = await new Web3(window.ethereum);
  let lagerid = document.getElementById("lagerId-input").value;
  document.querySelector("#lagerId-input").disabled = true;
  if (lagerid != "") {
    const accounts = await web3.eth.getAccounts();
    const contractLager = new web3.eth.Contract(s_ABI, contract_lager);
    await contractLager.methods
      .setStorage(lagerid)
      .send({ from: accounts[0]});
  } else {
    alert("please give the information - please update the page");
  }  

  window.location.reload(true);
}

async function newsensor() {
  let lagerID = document.getElementById("lager-input").value;
  let sensorId = document.getElementById("sensorId-input").value;
  document.querySelector("#lager-input").disabled = true;
  document.querySelector("#sensorId-input").disabled = true;
  if (lagerID != "" && sensorId != "") {
    web3 = await new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contractLager = new web3.eth.Contract(s_ABI, contract_lager);
    const a = await contractLager.methods
      .sensorRegistration(lagerID, sensorId)
      .send({ from: accounts[0]});
  } else {
    alert("please give the information - please update the page");
  }

  window.location.reload(true);
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

