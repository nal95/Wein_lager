// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Bottles is ERC721, Ownable {
    mapping (string => mapping(string => uint256)) public id ; // to store Uid from string oder bytes32 in uint256
    mapping(uint256 => string) _tokenURIs; // to store nfts uri (which for us also corresponds to the Uid)
    mapping(string => mapping(string => bool)) public bottle;
    uint256 counter = 1; // for itterate nfts minting and counts the total number of tokens
    //string  name ;
    //string  symbol;


    constructor (string memory name, string memory symbol) ERC721(name, symbol){
        //name = _name;
        //symbol = _symbol;
    }

    event action(uint256 tokenId, string wineName, string bottleUid);

    function burnBottle(string memory wineName, string memory bottleUid) 
    public virtual onlyOwner 
    {
        require(bottle[wineName][bottleUid]==true, "Bottle: token is not already minted");
        require(ERC721.ownerOf(id[wineName][bottleUid]) == msg.sender,"you are not the Owner" );

        _burn(id[wineName][bottleUid]);  
        delete id[wineName][bottleUid];
        emit action(id[wineName][bottleUid], wineName, bottleUid);
    }

    function transferBottle(address to, string memory wineName, string memory bottleUid)
    public  virtual onlyOwner
    {
        require(id[wineName][bottleUid] > 0, "Bottle: tokenId don't exist");
        require(existence(wineName,bottleUid)==true, "Bottle: token is not already minted");
        transferFrom(msg.sender, to, id[wineName][bottleUid]);  
    }

    function mintBottle(string memory wineName, string memory bottleUid, string memory bildLink) 
    public virtual onlyOwner  
    {
        require(bottle[wineName][bottleUid] == false, "Bottle: token already minted");
        
        id[wineName][bottleUid] = counter;
        _mint(msg.sender, id[wineName][bottleUid]);
        _setTokenURI(id[wineName][bottleUid], bildLink);
        bottle[wineName][bottleUid] = true;
        counter ++;
        emit action(id[wineName][bottleUid], wineName, bottleUid); 
    }
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    function existence(string memory wineName, string memory bottleUid) public virtual returns(bool){
        return bottle[wineName][bottleUid];

    }
}