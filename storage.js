// connect to Moralis server
Moralis.start({
  serverUrl: "https://jkhjbmnk50jf.grandmoralis.com:2053/server",
  appId: "YTjl1E3BA9GWdOOhrUpNUbWtWqh91kkBMCR8AHv1",
});

let web3;

const contract_lager = "0xD2BeA86149fFfc03DBB9C7a50fa0929d3203A4b7";
const optionsLager = { chain: "mumbai", address: contract_lager };

async function checkin() {
  let lagerid = document.getElementById("lagerId-input").value;
  let Uid = document.getElementById("Uid-input").value;
  let Wine = document.getElementById("name").value;
  if (lagerid != "" && Uid != "") {
    document.querySelector("#lagerId-input").disabled = true;
    document.querySelector("#Uid-input").disabled = true;
    document.querySelector("#name").disabled = true;
    web3 = await new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contractLager = new web3.eth.Contract(s_ABI, contract_lager);
    const a = await contractLager.methods
      .checkBottleIn(lagerid, Wine, Uid)
      .send({ from: accounts[0]});
    console.log(a);
  } else {
    alert("please give the information");
  }

  window.location.reload(true);
}

async function checkout() {
  let lagerid = document.getElementById("lagerId-input").value;
  let Uid = document.getElementById("Uid-input").value;
  let Wine = document.getElementById("name").value;
  if (lagerid != "" && Uid != "") {
    document.querySelector("#lagerId-input").disabled = true;
    document.querySelector("#Uid-input").disabled = true;
    document.querySelector("#name").disabled = true;
    web3 = await new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contractLager = new web3.eth.Contract(s_ABI, contract_lager);
    const a = await contractLager.methods
      .checkBottleOut(lagerid, Wine, Uid)
      .send({ from: accounts[0]});
    console.log(a);
  } else {
    alert("please give the information");
  }

  window.location.reload(true);
}

async function getBottles() {
  const query = new Moralis.Query("checkings");
  const findResult = await query.find();

  let tableIn = `
    <h5>Actuel bottles in the lager</h5>
    <table class="table table-striped cell-border" style="width:100%">
    <thead>
        <tr>
            <th scope="col">Date</th>
            <th scope="col">Lager_ID</th>
            <th scope="col">Wine</th>
            <th scope="col">Bottle_Uid</th>
            <th scope="col">Aktion</th>
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
  document.querySelector("#tableOfCheckIn").innerHTML = tableIn;

  if (findResult.length > 0) {
    await findResult.forEach((e) => {
      let bottles = e.attributes;
      let time = bottles.block_timestamp.toString().substr(0, 25);
      let content = `
          <tr>
            <td>${time}</td>
            <td>${bottles.storageId}</td>
            <td>${bottles.bottleName}</td>
            <td>${bottles.bottleUid}</td>
            <td>${bottles.InOrOut}</td>
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
          </tr>
      `;
    theAttributes.innerHTML += content;
  }
}

getBottles();
