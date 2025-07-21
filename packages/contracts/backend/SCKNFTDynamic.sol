// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title SCK NFT Dynamic - Secure Code KnAIght Digital Twin & Dynamic Achievement System
 * @dev Enhanced contract with dynamic achievement updates
 */
contract SCKNFTDynamic is ERC721, Ownable {
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
        uint256 lastUpdated;     // Last update timestamp
    }

    struct Achievement {
        string achievementType;  // Type (certification, activity, milestone)
        string title;            // Achievement title
        string metadata;         // Additional metadata (JSON)
        uint256 earnedAt;        // Timestamp when earned
        uint256 lastUpdated;     // Last update timestamp
        bool isSoulbound;        // Whether this achievement is soulbound
        bool isActive;           // Whether achievement is still valid
        uint256 version;         // Achievement version number
    }

    struct AchievementUpdate {
        uint256 achievementIndex; // Index of achievement in array
        string newMetadata;       // Updated metadata
        uint256 updatedAt;        // Update timestamp
        string updateReason;      // Reason for update
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
    
    // Mapping from token ID to achievement updates (audit trail)
    mapping(uint256 => AchievementUpdate[]) public achievementUpdates;
    
    // Mapping from DID to token ID (for lookup)
    mapping(string => uint256) public didToTokenId;
    
    // Soulbound tokens (cannot be transferred)
    mapping(uint256 => bool) public soulboundTokens;

    // Achievement templates (for dynamic creation)
    mapping(string => AchievementTemplate) public achievementTemplates;
    
    // Active achievement types
    string[] public activeAchievementTypes;

    struct AchievementTemplate {
        string achievementType;
        string title;
        string metadata;
        bool isSoulbound;
        bool isActive;
        uint256 minThreshold;
        uint256 maxThreshold;
    }

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

    event DigitalTwinUpdated(
        uint256 indexed tokenId,
        string role,
        string organization,
        uint256 updatedAt
    );

    event AchievementEarned(
        uint256 indexed tokenId,
        string achievementType,
        string title,
        bool isSoulbound,
        uint256 version
    );

    event AchievementUpdated(
        uint256 indexed tokenId,
        uint256 achievementIndex,
        string newMetadata,
        uint256 version,
        string reason
    );

    event AchievementTemplateAdded(
        string achievementType,
        string title,
        bool isSoulbound,
        uint256 minThreshold,
        uint256 maxThreshold
    );

    event AchievementTemplateUpdated(
        string achievementType,
        string title,
        bool isSoulbound,
        uint256 minThreshold,
        uint256 maxThreshold
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
        uint256 currentTime = block.timestamp;
        
        digitalTwins[tokenId] = DigitalTwin({
            did: did,
            role: role,
            organization: organization,
            createdAt: currentTime,
            isActive: true,
            lastUpdated: currentTime
        });
        
        didToTokenId[did] = tokenId;
        
        _mint(to, tokenId);
        
        emit DigitalTwinMinted(tokenId, did, role, organization, to);
        
        return tokenId;
    }

    /**
     * @dev Update digital twin information
     */
    function updateDigitalTwin(
        uint256 tokenId,
        string memory newRole,
        string memory newOrganization
    ) external onlyOwner {
        require(_exists(tokenId), "Digital twin does not exist");
        
        DigitalTwin storage twin = digitalTwins[tokenId];
        twin.role = newRole;
        twin.organization = newOrganization;
        twin.lastUpdated = block.timestamp;
        
        emit DigitalTwinUpdated(tokenId, newRole, newOrganization, block.timestamp);
    }

    /**
     * @dev Mint an achievement for a digital twin
     */
    function mintAchievement(
        uint256 tokenId,
        string memory achievementType,
        string memory title,
        string memory metadata,
        bool isSoulbound
    ) external onlyOwner returns (uint256) {
        require(_exists(tokenId), "Digital twin does not exist");
        require(bytes(achievementType).length > 0, "Achievement type cannot be empty");
        
        uint256 currentTime = block.timestamp;
        uint256 version = 1;
        
        Achievement memory achievement = Achievement({
            achievementType: achievementType,
            title: title,
            metadata: metadata,
            earnedAt: currentTime,
            lastUpdated: currentTime,
            isSoulbound: isSoulbound,
            isActive: true,
            version: version
        });
        
        uint256 achievementIndex = achievements[tokenId].length;
        achievements[tokenId].push(achievement);
        
        // If achievement is soulbound, make the token soulbound
        if (isSoulbound) {
            soulboundTokens[tokenId] = true;
        }
        
        emit AchievementEarned(tokenId, achievementType, title, isSoulbound, version);
        
        return achievementIndex;
    }

    // =============================================================================
    // DYNAMIC UPDATE FUNCTIONS
    // =============================================================================

    /**
     * @dev Update achievement metadata
     */
    function updateAchievement(
        uint256 tokenId,
        uint256 achievementIndex,
        string memory newMetadata,
        string memory reason
    ) external onlyOwner {
        require(_exists(tokenId), "Digital twin does not exist");
        require(achievementIndex < achievements[tokenId].length, "Achievement does not exist");
        
        Achievement storage achievement = achievements[tokenId][achievementIndex];
        achievement.metadata = newMetadata;
        achievement.lastUpdated = block.timestamp;
        achievement.version++;
        
        // Record update in audit trail
        AchievementUpdate memory update = AchievementUpdate({
            achievementIndex: achievementIndex,
            newMetadata: newMetadata,
            updatedAt: block.timestamp,
            updateReason: reason
        });
        
        achievementUpdates[tokenId].push(update);
        
        emit AchievementUpdated(tokenId, achievementIndex, newMetadata, achievement.version, reason);
    }

    /**
     * @dev Deactivate an achievement
     */
    function deactivateAchievement(
        uint256 tokenId,
        uint256 achievementIndex,
        string memory reason
    ) external onlyOwner {
        require(_exists(tokenId), "Digital twin does not exist");
        require(achievementIndex < achievements[tokenId].length, "Achievement does not exist");
        
        Achievement storage achievement = achievements[tokenId][achievementIndex];
        achievement.isActive = false;
        achievement.lastUpdated = block.timestamp;
        
        // Record deactivation in audit trail
        AchievementUpdate memory update = AchievementUpdate({
            achievementIndex: achievementIndex,
            newMetadata: achievement.metadata,
            updatedAt: block.timestamp,
            updateReason: string(abi.encodePacked("DEACTIVATED: ", reason))
        });
        
        achievementUpdates[tokenId].push(update);
        
        emit AchievementUpdated(tokenId, achievementIndex, achievement.metadata, achievement.version, reason);
    }

    /**
     * @dev Reactivate an achievement
     */
    function reactivateAchievement(
        uint256 tokenId,
        uint256 achievementIndex,
        string memory reason
    ) external onlyOwner {
        require(_exists(tokenId), "Digital twin does not exist");
        require(achievementIndex < achievements[tokenId].length, "Achievement does not exist");
        
        Achievement storage achievement = achievements[tokenId][achievementIndex];
        achievement.isActive = true;
        achievement.lastUpdated = block.timestamp;
        
        // Record reactivation in audit trail
        AchievementUpdate memory update = AchievementUpdate({
            achievementIndex: achievementIndex,
            newMetadata: achievement.metadata,
            updatedAt: block.timestamp,
            updateReason: string(abi.encodePacked("REACTIVATED: ", reason))
        });
        
        achievementUpdates[tokenId].push(update);
        
        emit AchievementUpdated(tokenId, achievementIndex, achievement.metadata, achievement.version, reason);
    }

    // =============================================================================
    // ACHIEVEMENT TEMPLATE MANAGEMENT
    // =============================================================================

    /**
     * @dev Add a new achievement template
     */
    function addAchievementTemplate(
        string memory achievementType,
        string memory title,
        string memory metadata,
        bool isSoulbound,
        uint256 minThreshold,
        uint256 maxThreshold
    ) external onlyOwner {
        require(bytes(achievementType).length > 0, "Achievement type cannot be empty");
        
        achievementTemplates[achievementType] = AchievementTemplate({
            achievementType: achievementType,
            title: title,
            metadata: metadata,
            isSoulbound: isSoulbound,
            isActive: true,
            minThreshold: minThreshold,
            maxThreshold: maxThreshold
        });
        
        // Add to active types if not already present
        bool exists = false;
        for (uint i = 0; i < activeAchievementTypes.length; i++) {
            if (keccak256(bytes(activeAchievementTypes[i])) == keccak256(bytes(achievementType))) {
                exists = true;
                break;
            }
        }
        
        if (!exists) {
            activeAchievementTypes.push(achievementType);
        }
        
        emit AchievementTemplateAdded(achievementType, title, isSoulbound, minThreshold, maxThreshold);
    }

    /**
     * @dev Update an achievement template
     */
    function updateAchievementTemplate(
        string memory achievementType,
        string memory title,
        string memory metadata,
        bool isSoulbound,
        uint256 minThreshold,
        uint256 maxThreshold
    ) external onlyOwner {
        require(bytes(achievementType).length > 0, "Achievement type cannot be empty");
        require(achievementTemplates[achievementType].isActive, "Template does not exist");
        
        achievementTemplates[achievementType] = AchievementTemplate({
            achievementType: achievementType,
            title: title,
            metadata: metadata,
            isSoulbound: isSoulbound,
            isActive: true,
            minThreshold: minThreshold,
            maxThreshold: maxThreshold
        });
        
        emit AchievementTemplateUpdated(achievementType, title, isSoulbound, minThreshold, maxThreshold);
    }

    /**
     * @dev Mint achievement from template
     */
    function mintAchievementFromTemplate(
        uint256 tokenId,
        string memory achievementType,
        string memory customMetadata
    ) external onlyOwner returns (uint256) {
        require(_exists(tokenId), "Digital twin does not exist");
        
        AchievementTemplate memory template = achievementTemplates[achievementType];
        require(template.isActive, "Template does not exist");
        
        string memory finalMetadata = bytes(customMetadata).length > 0 
            ? customMetadata 
            : template.metadata;
        
        return mintAchievement(
            tokenId,
            achievementType,
            template.title,
            finalMetadata,
            template.isSoulbound
        );
    }

    // =============================================================================
    // VIEW FUNCTIONS
    // =============================================================================

    /**
     * @dev Get digital twin data
     */
    function getDigitalTwinData(uint256 tokenId) external view returns (DigitalTwin memory) {
        require(_exists(tokenId), "Token does not exist");
        return digitalTwins[tokenId];
    }

    /**
     * @dev Get all achievements for a digital twin
     */
    function getAchievements(uint256 tokenId) external view returns (Achievement[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return achievements[tokenId];
    }

    /**
     * @dev Get active achievements only
     */
    function getActiveAchievements(uint256 tokenId) external view returns (Achievement[] memory) {
        require(_exists(tokenId), "Token does not exist");
        
        Achievement[] memory allAchievements = achievements[tokenId];
        uint256 activeCount = 0;
        
        // Count active achievements
        for (uint i = 0; i < allAchievements.length; i++) {
            if (allAchievements[i].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active achievements
        Achievement[] memory activeAchievements = new Achievement[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint i = 0; i < allAchievements.length; i++) {
            if (allAchievements[i].isActive) {
                activeAchievements[currentIndex] = allAchievements[i];
                currentIndex++;
            }
        }
        
        return activeAchievements;
    }

    /**
     * @dev Get achievement update history
     */
    function getAchievementUpdates(uint256 tokenId) external view returns (AchievementUpdate[] memory) {
        require(_exists(tokenId), "Token does not exist");
        return achievementUpdates[tokenId];
    }

    /**
     * @dev Get achievement template
     */
    function getAchievementTemplate(string memory achievementType) external view returns (AchievementTemplate memory) {
        return achievementTemplates[achievementType];
    }

    /**
     * @dev Get all active achievement types
     */
    function getActiveAchievementTypes() external view returns (string[] memory) {
        return activeAchievementTypes;
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
    // UTILITY FUNCTIONS
    // =============================================================================

    /**
     * @dev Get total number of digital twins
     */
    function totalDigitalTwins() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Check if DID exists
     */
    function doesDIDExist(string memory did) external view returns (bool) {
        return didToTokenId[did] != 0;
    }

    /**
     * @dev Get achievement count for a digital twin
     */
    function getAchievementCount(uint256 tokenId) external view returns (uint256) {
        return achievements[tokenId].length;
    }

    /**
     * @dev Get active achievement count for a digital twin
     */
    function getActiveAchievementCount(uint256 tokenId) external view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        
        uint256 activeCount = 0;
        Achievement[] memory allAchievements = achievements[tokenId];
        
        for (uint i = 0; i < allAchievements.length; i++) {
            if (allAchievements[i].isActive) {
                activeCount++;
            }
        }
        
        return activeCount;
    }
} 