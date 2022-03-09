// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;


import "./Bottles.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Storages is Ownable {    
    //address nftContract;
    Bottles nftContract;
    constructor(address _nftContract){//(address _nftContract) //(string memory name, string memory symbol)
        nftContract = Bottles(_nftContract);
        //nftContract  = new Bottles(name,symbol);
    }

    struct bottles{
        string name;
        string uid;
    }

    struct data {
        string hash;
        uint256 date;
    }

    mapping(uint256 => mapping(uint256 => data[])) public sensorData;
    mapping(uint256 => mapping(uint256 => bool)) public isStorage;
    mapping(uint256 => uint256[]) public storageSensorList;

    mapping(uint256 => bool) public storageFacility;
    mapping(uint256 => bottles[]) public storageContent;
    mapping(uint256 => mapping(string => uint256)) public uidPosition;
    mapping(uint256 => mapping(string => bool)) public exist;

    event hashStorage(uint256 time, string dataHash, uint256 storageId, uint256 sensorId);
    event changing(uint256 time, uint256 storageId, string bottleName, string bottleUid);

    ////////////////////////////////////////////////////////////////////////////////Storage/////////////////////////////////////////////////////////////////////////////////////////////////

    function setStorage(uint256 storageId) 
    public 
    {
        require (storageId > 0, "Storage: the storageId most be bigger than zero");
        require (storageFacility[storageId] == false, "Storage: this storage already exist");
        storageFacility[storageId] = true;
    }

    function checkBottleIn(uint256 storageId, string memory wineName, string memory bottleUid) 
    public 
    {
        require(storageFacility[storageId] == true,"Storage: this lager don't exist");
        require(nftContract.existence(wineName,bottleUid) == true, "NFT: this bottle is not an NFT");

        storageContent[storageId].push(bottles(wineName,bottleUid));
        uidPosition[storageId][bottleUid] = storageContent[storageId].length;
        exist[storageId][bottleUid] = true;

        emit changing(block.timestamp, storageId, wineName, bottleUid );
    }

    function swapPosition( uint256 storageId, string memory bottleUid)
    internal 
    {
        require (uidPosition[storageId][bottleUid] > 0, "Storage: this bottle is not in this storage");

        uint256 descendant = (uidPosition[storageId][bottleUid]-1);
        uint256 upwards = storageContent[storageId].length;
        bottles memory switcher = storageContent[storageId][upwards - 1];
        storageContent[storageId][descendant] = switcher;

        emit changing (block.timestamp, storageId, switcher.name, switcher.uid);
    }

    function checkBottleOut(uint256 storageId, string memory wineName, string memory bottleUid) 
    public onlyOwner
    {
        require (exist[storageId][bottleUid] == true,"Lager: the bottle is not already in this storage");

        swapPosition(storageId,bottleUid);
        storageContent[storageId].pop();
        uidPosition[storageId][bottleUid] = 0; 
        exist[storageId][bottleUid] = false;

        emit changing (block.timestamp, storageId, wineName, bottleUid);
    }

    function getStorageContent(uint256 storageId)
    public view  returns(bottles[] memory )
    {
        return storageContent[storageId];
    }

    ////////////////////////////////////////////////////////////////////////////////SENSOR/////////////////////////////////////////////////////////////////////////////////////////////////

    function sensorRegistration(uint256 storageId, uint256 sensorId) 
    public  
    {
        require (storageFacility[storageId] == true, "Storage: this storage don't already exist");
        require(isStorage[storageId][sensorId] == false, "Sensor: this sensor already exist");

        storageSensorList[storageId].push(sensorId);
        isStorage[storageId][sensorId] = true;
    }

    function getstorageSensorList(uint256 storageId)
    public view  returns(uint256[] memory )
    {
        return storageSensorList[storageId];
    }

    function dataStorage(uint256 storageId, uint256 sensorId, string memory dataHash, uint256 date) 
    public 
    {
        require (storageFacility[storageId] == true, "Storage: this storage don't already exist");
        require(isStorage[storageId][sensorId] == true, "Storage: the sensor don't already exist in this storage");
        require(bytes(dataHash).length == 64, "Sensor: please enter a sha256hash string");
        require((block.timestamp - date) > 0 &&  (block.timestamp - date)  <= 86400, "Sensor: storage periode muss be smaller than 2 Days");

        sensorData[storageId][sensorId].push(data(dataHash,date));
        emit hashStorage(date, dataHash, storageId, sensorId);
    }
        
    function getHashHistories(uint256 storageId, uint256 sensorId) 
    public view returns(data[] memory)
    {
        require (storageFacility[storageId] == true, "Storage: this storage don't already exist");
        require(isStorage[storageId][sensorId] == true, "Storage: the sensor don't already exist in this storage");
        return sensorData[storageId][sensorId];
    }
}