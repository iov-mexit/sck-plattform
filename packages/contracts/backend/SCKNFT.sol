// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title SCK NFT - Secure Code KnAIght Digital Twin & Achievement System
 * @dev Single contract handling digital twins and achievements
 */
contract SCKNFT is ERC721, Ownable {
    using Strings for uint256;

    // =============================================================================
    // STRUCTS & ENUMS
    // =============================================================================

    struct DigitalTwin {
        string did;              // Decentralized Identifier
        string role;             // Role (Developer, Security Expert, etc.)
        string organization;     // Organization name
        uint256 createdAt;       // Creation timestamp
        bool isActive;           // Active status
    }

    struct Achievement {
        string achievementType;  // Type (certification, activity, milestone)
        string title;            // Achievement title
        string metadata;         // Additional metadata (JSON)
        uint256 earnedAt;        // Timestamp when earned
        bool isSoulbound;        // Whether this achievement is soulbound
    }

    // =============================================================================
    // STATE VARIABLES
    // =============================================================================

    uint256 private _tokenIdCounter;
    string private _baseTokenURI;
    
    // Mapping from token ID to digital twin data
    mapping(uint256 => DigitalTwin) public digitalTwins;
    
    // Mapping from token ID to achievements
    mapping(uint256 => Achievement[]) public achievements;
    
    // Mapping from DID to token ID (for lookup)
    mapping(string => uint256) public didToTokenId;
    
    // Soulbound tokens (cannot be transferred)
    mapping(uint256 => bool) public soulboundTokens;

    // =============================================================================
    // EVENTS
    // =============================================================================

    event DigitalTwinMinted(
        uint256 indexed tokenId,
        string indexed did,
        string role,
        string organization,
        address indexed owner
    );

    event AchievementEarned(
        uint256 indexed tokenId,
        string achievementType,
        string title,
        bool isSoulbound
    );

    event SoulboundStatusChanged(
        uint256 indexed tokenId,
        bool isSoulbound
    );

    // =============================================================================
    // CONSTRUCTOR
    // =============================================================================

    constructor() ERC721("SCK Digital Twin", "SCK") Ownable(msg.sender) {
        _baseTokenURI = "https://api.securecodeknight.com/metadata/";
    }

    // =============================================================================
    // CORE MINTING FUNCTIONS
    // =============================================================================

    /**
     * @dev Mint a new digital twin NFT
     * @param to The address to mint to
     * @param did The decentralized identifier
     * @param role The role of the digital twin
     * @param organization The organization name
     */
    function mintDigitalTwin(
        address to,
        string memory did,
        string memory role,
        string memory organization
    ) external onlyOwner returns (uint256) {
        require(bytes(did).length > 0, "DID cannot be empty");
        require(didToTokenId[did] == 0, "DID already exists");
        
        uint256 tokenId = _tokenIdCounter++;
        
        digitalTwins[tokenId] = DigitalTwin({
            did: did,
            role: role,
            organization: organization,
            createdAt: block.timestamp,
            isActive: true
        });
        
        didToTokenId[did] = tokenId;
        
        _mint(to, tokenId);
        
        emit DigitalTwinMinted(tokenId, did, role, organization, to);
        
        return tokenId;
    }

    /**
     * @dev Mint an achievement for a digital twin
     * @param tokenId The digital twin token ID
     * @param achievementType The type of achievement
     * @param title The achievement title
     * @param metadata Additional metadata
     * @param isSoulbound Whether this achievement is soulbound
     */
    function mintAchievement(
        uint256 tokenId,
        string memory achievementType,
        string memory title,
        string memory metadata,
        bool isSoulbound
    ) external onlyOwner {
        require(_exists(tokenId), "Digital twin does not exist");
        require(bytes(achievementType).length > 0, "Achievement type cannot be empty");
        
        Achievement memory achievement = Achievement({
            achievementType: achievementType,
            title: title,
            metadata: metadata,
            earnedAt: block.timestamp,
            isSoulbound: isSoulbound
        });
        
        achievements[tokenId].push(achievement);
        
        // If achievement is soulbound, make the token soulbound
        if (isSoulbound) {
            soulboundTokens[tokenId] = true;
            emit SoulboundStatusChanged(tokenId, true);
        }
        
        emit AchievementEarned(tokenId, achievementType, title, isSoulbound);
    }

    // =============================================================================
    // VIEW FUNCTIONS
    // =============================================================================

    /**
     * @dev Get digital twin data
     * @param tokenId The token ID
     * @return Digital twin data
     */
    function getDigitalTwinData(uint256 tokenId) external view returns (DigitalTwin memory) {
        require(_exists(tokenId), "Token does not exist");
        return digitalTwins[tokenId];
    }

    /**
     * @dev Get all achievements for a digital twin
     * @param tokenId The token ID
     * @return Array of achievements
     */
    function getAchievements(uint256 tokenId) external view returns (Achievement[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return achievements[tokenId];
    }

    /**
     * @dev Get token ID by DID
     * @param did The decentralized identifier
     * @return The token ID
     */
    function getTokenIdByDID(string memory did) external view returns (uint256) {
        return didToTokenId[did];
    }

    /**
     * @dev Check if token is soulbound
     * @param tokenId The token ID
     * @return True if soulbound
     */
    function isSoulbound(uint256 tokenId) external view returns (bool) {
        return soulboundTokens[tokenId];
    }

    /**
     * @dev Get achievement count for a digital twin
     * @param tokenId The token ID
     * @return Number of achievements
     */
    function getAchievementCount(uint256 tokenId) external view returns (uint256) {
        return achievements[tokenId].length;
    }

    // =============================================================================
    // OVERRIDE FUNCTIONS
    // =============================================================================

    /**
     * @dev Override transfer function to prevent soulbound token transfers
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
        
        // Prevent transfer of soulbound tokens (except minting)
        if (from != address(0)) {
            require(!soulboundTokens[firstTokenId], "Token is soulbound and cannot be transferred");
        }
    }

    /**
     * @dev Override token URI to include metadata
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
    }

    // =============================================================================
    // ADMIN FUNCTIONS
    // =============================================================================

    /**
     * @dev Set base token URI
     * @param baseURI The new base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Set soulbound status for a token
     * @param tokenId The token ID
     * @param isSoulbound The soulbound status
     */
    function setSoulboundStatus(uint256 tokenId, bool isSoulbound) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        soulboundTokens[tokenId] = isSoulbound;
        emit SoulboundStatusChanged(tokenId, isSoulbound);
    }

    /**
     * @dev Deactivate a digital twin
     * @param tokenId The token ID
     */
    function deactivateDigitalTwin(uint256 tokenId) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        digitalTwins[tokenId].isActive = false;
    }

    // =============================================================================
    // UTILITY FUNCTIONS
    // =============================================================================

    /**
     * @dev Get total number of digital twins
     * @return Total count
     */
    function totalDigitalTwins() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Check if DID exists
     * @param did The decentralized identifier
     * @return True if exists
     */
    function doesDIDExist(string memory did) external view returns (bool) {
        return didToTokenId[did] != 0;
    }
} 