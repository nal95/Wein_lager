// connect to Moralis server
Moralis.start({
  serverUrl: "https://jkhjbmnk50jf.grandmoralis.com:2053/server",
  appId: "YTjl1E3BA9GWdOOhrUpNUbWtWqh91kkBMCR8AHv1",
});

let web3;

const contract_lager = "0xe0d6Dcd7D7e81C890f62D6887F8Bc4EFA17e1Ea9";
const optionsLager = { chain: "mumbai", address: contract_lager };

async function init() {
  // fonction est a revoir car elle doit permettre a afficher les nfts bzws bouteilles eingecheck
  const query = new Moralis.Query("checkings");
  const findResult = await query.find();
  //console.log(findResult);
}

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

/*async function getBottlesIn() {
  const query = new Moralis.Query("checkInEvent");
  const findResult = await query.find();

  console.log("in");
  let tableIn = `
    <h5>Actuel bottles in the lager</h5>
    <table class="table table-striped cell-border" style="width:100%">
    <thead>
        <tr>
            <th scope="col">Date</th>
            <th scope="col">Lager_ID</th>
            <th scope="col">Bottle_Uid</th>
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
            <td>${bottles.lagerId}</td>
            <td>${bottles.Uid}</td>
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
}*/


var tableA = document.querySelector("#tableOfCheckIn");
var tableB = document.querySelector("#tableOfCheckOut");

var btnTabA = document.querySelector("#in");
var btnTabB = document.querySelector("#out");

btnTabA.onclick = function () {
  getBottlesIn();
  tableA.style.display = "block";
};
btnTabB.onclick = function () {
  getBottlesOut();
  tableB.style.display = "block";
};

init();
