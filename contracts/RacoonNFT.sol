// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RaccoonNFT is ERC721URIStorage, Ownable {
    uint256 public totalSupply;
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant PRICE_USDC = 5e5; // 0.5 USDC (6 decimals)
    uint256 public constant FCFS_LIMIT = 5000;

    address public usdc;
    address public minter;
    mapping(address => bool) public proUser;

    constructor(address _usdc) ERC721("Farcaster Raccoons", "FCRAC") {
        usdc = _usdc;
        minter = msg.sender;
    }

    modifier onlyMinter() {
        require(msg.sender == minter || msg.sender == owner(), "Not authorized");
        _;
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    function setProUser(address user, bool state) external onlyOwner {
        proUser[user] = state;
    }

    function mintTo(address to, string memory tokenURI) external onlyMinter returns (uint256) {
        require(totalSupply < MAX_SUPPLY, "Sold out");
        uint256 tokenId = ++totalSupply;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }

    function mintWithUSDC(address to, string memory tokenURI) external returns (uint256) {
        require(totalSupply < MAX_SUPPLY, "Sold out");
        uint256 tokenId = ++totalSupply;

        if (tokenId > FCFS_LIMIT) {
            require(proUser[to], "Pro only after 5000");
            IERC20(usdc).transferFrom(to, owner(), PRICE_USDC);
        }

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }
}
