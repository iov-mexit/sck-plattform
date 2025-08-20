// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title SCK Dynamic NFT - Secure Code KnAIght Role Agents & Achievement System
 * @dev Dynamic NFT that updates based on trust scores and certification signals
 * @notice This contract manages role agents with evolving trust scores and achievements
 */
contract SCKDynamicNFT is ERC721, Ownable, AccessControl {
    using Strings for uint256;

    // =============================================================================
    // ROLES & CONSTANTS
    // =============================================================================

    bytes32 public constant SIGNAL_UPDATER_ROLE = keccak256("SIGNAL_UPDATER_ROLE");
    bytes32 public constant ACHIEVEMENT_MINTER_ROLE = keccak256("ACHIEVEMENT_MINTER_ROLE");
    
    uint256 public constant MIN_TRUST_SCORE = 0;
    uint256 public constant MAX_TRUST_SCORE = 1000;
    uint256 public constant NFT_ELIGIBILITY_THRESHOLD = 750;

    // =============================================================================
    // STRUCTS & ENUMS
    // =============================================================================

    enum TrustLevel {
        UNVERIFIED,    // 0-249
        BASIC,         // 250-499
        TRUSTED,       // 500-749
        HIGHLY_TRUSTED, // 750-899
        ELITE          // 900-1000
    }

    enum SignalType {
        SECURITY_AUDIT,
        CODE_REVIEW,
        VULNERABILITY_FOUND,
        CERTIFICATION_EARNED,
        PEER_VALIDATION,
        PERFORMANCE_METRIC,
        TRAINING_COMPLETED
    }

    struct RoleAgent {
        string did;                    // Decentralized Identifier
        string name;                   // Agent name
        string role;                   // Role category (Security Expert, etc.)
        string organization;           // Organization name
        uint256 trustScore;            // Current trust score (0-1000)
        TrustLevel trustLevel;         // Derived trust level
        uint256 createdAt;             // Creation timestamp
        uint256 lastUpdated;           // Last trust score update
        bool isActive;                 // Active status
        bool isEligibleForAchievements; // NFT eligibility (trustScore >= 750)
        uint256 totalSignals;          // Total signals processed
        uint256 achievementCount;      // Number of achievements earned
    }

    struct TrustSignal {
        SignalType signalType;         // Type of signal
        int256 scoreImpact;           // Trust score change (-100 to +100)
        string source;                // Signal source (system, peer, etc.)
        string metadata;              // Additional signal data (JSON)
        uint256 timestamp;            // When signal was recorded
        address reporter;             // Who reported the signal
        bool isVerified;              // Whether signal was verified
    }

    struct Achievement {
        string achievementType;        // Achievement category
        string title;                 // Achievement title
        string description;           // Achievement description
        string metadata;              // Additional metadata (JSON)
        uint256 trustScoreAtEarning;  // Trust score when earned
        uint256 earnedAt;             // Timestamp when earned
        bool isSoulbound;             // Whether achievement is transferable
        string imageURI;              // Achievement image/badge URI
    }

    // =============================================================================
    // STATE VARIABLES
    // =============================================================================

    uint256 private _tokenIdCounter;
    string private _baseTokenURI;
    string private _contractURI;
    
    // Core mappings
    mapping(uint256 => RoleAgent) public roleAgents;
    mapping(uint256 => TrustSignal[]) public trustSignals;
    mapping(uint256 => Achievement[]) public achievements;
    
    // Lookup mappings
    mapping(string => uint256) public didToTokenId;
    mapping(uint256 => bool) public soulboundTokens;
    
    // Trust score tracking
    mapping(uint256 => uint256) public trustScoreHistory; // For analytics
    mapping(address => uint256) public userToTokenId;     // User to their agent

    // Global statistics
    uint256 public totalTrustSignals;
    uint256 public totalAchievements;
    mapping(TrustLevel => uint256) public agentsByTrustLevel;

    // =============================================================================
    // EVENTS
    // =============================================================================

    event RoleAgentMinted(
        uint256 indexed tokenId,
        string indexed did,
        string name,
        string role,
        string organization,
        address indexed owner
    );

    event TrustScoreUpdated(
        uint256 indexed tokenId,
        uint256 oldScore,
        uint256 newScore,
        TrustLevel oldLevel,
        TrustLevel newLevel,
        SignalType signalType
    );

    event TrustSignalProcessed(
        uint256 indexed tokenId,
        SignalType indexed signalType,
        int256 scoreImpact,
        string source,
        address indexed reporter
    );

    event AchievementEarned(
        uint256 indexed tokenId,
        string achievementType,
        string title,
        uint256 trustScoreAtEarning,
        bool isSoulbound
    );

    event EligibilityChanged(
        uint256 indexed tokenId,
        bool wasEligible,
        bool isEligible,
        uint256 trustScore
    );

    event MetadataUpdated(
        uint256 indexed tokenId,
        string newMetadata
    );

    // =============================================================================
    // CONSTRUCTOR
    // =============================================================================

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        string memory contractMetadataURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        _contractURI = contractMetadataURI;
        
        // Grant roles to deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SIGNAL_UPDATER_ROLE, msg.sender);
        _grantRole(ACHIEVEMENT_MINTER_ROLE, msg.sender);
    }

    // =============================================================================
    // CORE MINTING FUNCTIONS
    // =============================================================================

    /**
     * @dev Mint a new role agent NFT
     * @param to The address to mint to
     * @param did The decentralized identifier
     * @param name The agent name
     * @param role The role category
     * @param organization The organization name
     * @param initialTrustScore Initial trust score (0-1000)
     */
    function mintRoleAgent(
        address to,
        string memory did,
        string memory name,
        string memory role,
        string memory organization,
        uint256 initialTrustScore
    ) external onlyOwner returns (uint256) {
        require(bytes(did).length > 0, "DID cannot be empty");
        require(didToTokenId[did] == 0, "DID already exists");
        require(initialTrustScore <= MAX_TRUST_SCORE, "Trust score too high");
        
        uint256 tokenId = _tokenIdCounter++;
        TrustLevel trustLevel = _calculateTrustLevel(initialTrustScore);
        
        roleAgents[tokenId] = RoleAgent({
            did: did,
            name: name,
            role: role,
            organization: organization,
            trustScore: initialTrustScore,
            trustLevel: trustLevel,
            createdAt: block.timestamp,
            lastUpdated: block.timestamp,
            isActive: true,
            isEligibleForAchievements: initialTrustScore >= NFT_ELIGIBILITY_THRESHOLD,
            totalSignals: 0,
            achievementCount: 0
        });
        
        didToTokenId[did] = tokenId;
        userToTokenId[to] = tokenId;
        agentsByTrustLevel[trustLevel]++;
        
        _mint(to, tokenId);
        
        emit RoleAgentMinted(tokenId, did, name, role, organization, to);
        
        return tokenId;
    }

    /**
     * @dev Public function to mint role agent NFT (allows direct MetaMask minting)
     * @param to The address to mint the NFT to
     * @param did The agent's decentralized identifier
     * @param name The agent name
     * @param role The role category
     * @param organization The organization name
     * @param initialTrustScore Initial trust score (0-1000)
     */
    function mintRoleAgentPublic(
        address to,
        string memory did,
        string memory name,
        string memory role,
        string memory organization,
        uint256 initialTrustScore
    ) external returns (uint256) {
        require(bytes(did).length > 0, "DID cannot be empty");
        require(didToTokenId[did] == 0, "DID already exists");
        require(initialTrustScore <= MAX_TRUST_SCORE, "Trust score too high");
        
        uint256 tokenId = _tokenIdCounter++;
        TrustLevel trustLevel = _calculateTrustLevel(initialTrustScore);
        
        roleAgents[tokenId] = RoleAgent({
            did: did,
            name: name,
            role: role,
            organization: organization,
            trustScore: initialTrustScore,
            trustLevel: trustLevel,
            createdAt: block.timestamp,
            lastUpdated: block.timestamp,
            isActive: true,
            isEligibleForAchievements: initialTrustScore >= NFT_ELIGIBILITY_THRESHOLD,
            totalSignals: 0,
            achievementCount: 0
        });
        
        didToTokenId[did] = tokenId;
        userToTokenId[to] = tokenId;
        agentsByTrustLevel[trustLevel]++;
        
        _mint(to, tokenId);
        
        emit RoleAgentMinted(tokenId, did, name, role, organization, to);
        
        return tokenId;
    }

    // =============================================================================
    // TRUST SIGNAL PROCESSING
    // =============================================================================

    /**
     * @dev Process a new trust signal and update agent's trust score
     * @param tokenId The role agent token ID
     * @param signalType Type of trust signal
     * @param scoreImpact Trust score change (-100 to +100)
     * @param source Signal source identifier
     * @param metadata Additional signal metadata
     */
    function processTrustSignal(
        uint256 tokenId,
        SignalType signalType,
        int256 scoreImpact,
        string memory source,
        string memory metadata
    ) external onlyRole(SIGNAL_UPDATER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Role agent does not exist");
        require(scoreImpact >= -100 && scoreImpact <= 100, "Score impact out of range");
        require(roleAgents[tokenId].isActive, "Role agent is not active");
        
        RoleAgent storage agent = roleAgents[tokenId];
        uint256 oldScore = agent.trustScore;
        TrustLevel oldLevel = agent.trustLevel;
        
        // Calculate new trust score with bounds checking
        uint256 newScore;
        if (scoreImpact < 0) {
            uint256 decrease = uint256(-scoreImpact);
            newScore = oldScore > decrease ? oldScore - decrease : 0;
        } else {
            uint256 increase = uint256(scoreImpact);
            newScore = oldScore + increase > MAX_TRUST_SCORE ? MAX_TRUST_SCORE : oldScore + increase;
        }
        
        // Update agent data
        agent.trustScore = newScore;
        agent.trustLevel = _calculateTrustLevel(newScore);
        agent.lastUpdated = block.timestamp;
        agent.totalSignals++;
        
        // Check eligibility change
        bool wasEligible = agent.isEligibleForAchievements;
        bool isEligible = newScore >= NFT_ELIGIBILITY_THRESHOLD;
        agent.isEligibleForAchievements = isEligible;
        
        // Update global statistics
        if (oldLevel != agent.trustLevel) {
            agentsByTrustLevel[oldLevel]--;
            agentsByTrustLevel[agent.trustLevel]++;
        }
        
        // Record the trust signal
        trustSignals[tokenId].push(TrustSignal({
            signalType: signalType,
            scoreImpact: scoreImpact,
            source: source,
            metadata: metadata,
            timestamp: block.timestamp,
            reporter: msg.sender,
            isVerified: true
        }));
        
        totalTrustSignals++;
        
        // Emit events
        emit TrustSignalProcessed(tokenId, signalType, scoreImpact, source, msg.sender);
        emit TrustScoreUpdated(tokenId, oldScore, newScore, oldLevel, agent.trustLevel, signalType);
        
        if (wasEligible != isEligible) {
            emit EligibilityChanged(tokenId, wasEligible, isEligible, newScore);
        }
    }

    /**
     * @dev Batch process multiple trust signals
     * @param tokenIds Array of role agent token IDs
     * @param signalTypes Array of signal types
     * @param scoreImpacts Array of score impacts
     * @param sources Array of signal sources
     * @param metadataArray Array of signal metadata
     */
    function batchProcessTrustSignals(
        uint256[] memory tokenIds,
        SignalType[] memory signalTypes,
        int256[] memory scoreImpacts,
        string[] memory sources,
        string[] memory metadataArray
    ) external onlyRole(SIGNAL_UPDATER_ROLE) {
        require(
            tokenIds.length == signalTypes.length &&
            tokenIds.length == scoreImpacts.length &&
            tokenIds.length == sources.length &&
            tokenIds.length == metadataArray.length,
            "Array lengths must match"
        );
        
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(_ownerOf(tokenId) != address(0), "Role agent does not exist");
            require(scoreImpacts[i] >= -100 && scoreImpacts[i] <= 100, "Score impact out of range");
            require(roleAgents[tokenId].isActive, "Role agent is not active");
            
            RoleAgent storage agent = roleAgents[tokenId];
            uint256 oldScore = agent.trustScore;
            TrustLevel oldLevel = agent.trustLevel;
            
            // Calculate new trust score with bounds checking
            uint256 newScore;
            if (scoreImpacts[i] < 0) {
                uint256 decrease = uint256(-scoreImpacts[i]);
                newScore = oldScore > decrease ? oldScore - decrease : 0;
            } else {
                uint256 increase = uint256(scoreImpacts[i]);
                newScore = oldScore + increase > MAX_TRUST_SCORE ? MAX_TRUST_SCORE : oldScore + increase;
            }
            
            // Update agent data
            agent.trustScore = newScore;
            agent.trustLevel = _calculateTrustLevel(newScore);
            agent.lastUpdated = block.timestamp;
            agent.totalSignals++;
            
            // Check eligibility change
            bool wasEligible = agent.isEligibleForAchievements;
            bool isEligible = newScore >= NFT_ELIGIBILITY_THRESHOLD;
            agent.isEligibleForAchievements = isEligible;
            
            // Update global statistics
            if (oldLevel != agent.trustLevel) {
                agentsByTrustLevel[oldLevel]--;
                agentsByTrustLevel[agent.trustLevel]++;
            }
            
            // Record the trust signal
            trustSignals[tokenId].push(TrustSignal({
                signalType: signalTypes[i],
                scoreImpact: scoreImpacts[i],
                source: sources[i],
                metadata: metadataArray[i],
                timestamp: block.timestamp,
                reporter: msg.sender,
                isVerified: true
            }));
            
            totalTrustSignals++;
            
            // Emit events
            emit TrustSignalProcessed(tokenId, signalTypes[i], scoreImpacts[i], sources[i], msg.sender);
            emit TrustScoreUpdated(tokenId, oldScore, newScore, oldLevel, agent.trustLevel, signalTypes[i]);
            
            if (wasEligible != isEligible) {
                emit EligibilityChanged(tokenId, wasEligible, isEligible, newScore);
            }
        }
    }

    // =============================================================================
    // ACHIEVEMENT SYSTEM
    // =============================================================================

    /**
     * @dev Mint an achievement for a role agent
     * @param tokenId The role agent token ID
     * @param achievementType Achievement category
     * @param title Achievement title
     * @param description Achievement description
     * @param metadata Additional metadata
     * @param _isSoulbound Whether achievement is transferable
     * @param imageURI Achievement badge image URI
     */
    function mintAchievement(
        uint256 tokenId,
        string memory achievementType,
        string memory title,
        string memory description,
        string memory metadata,
        bool _isSoulbound,
        string memory imageURI
    ) external onlyRole(ACHIEVEMENT_MINTER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Role agent does not exist");
        require(roleAgents[tokenId].isEligibleForAchievements, "Agent not eligible for achievements");
        require(bytes(achievementType).length > 0, "Achievement type cannot be empty");
        
        RoleAgent storage agent = roleAgents[tokenId];
        
        Achievement memory achievement = Achievement({
            achievementType: achievementType,
            title: title,
            description: description,
            metadata: metadata,
            trustScoreAtEarning: agent.trustScore,
            earnedAt: block.timestamp,
            isSoulbound: _isSoulbound,
            imageURI: imageURI
        });
        
        achievements[tokenId].push(achievement);
        agent.achievementCount++;
        totalAchievements++;
        
        // If achievement is soulbound, make the token soulbound
        if (_isSoulbound) {
            soulboundTokens[tokenId] = true;
        }
        
        emit AchievementEarned(
            tokenId,
            achievementType,
            title,
            agent.trustScore,
            _isSoulbound
        );
    }

    // =============================================================================
    // VIEW FUNCTIONS
    // =============================================================================

    /**
     * @dev Get complete role agent data
     * @param tokenId The token ID
     * @return Role agent data
     */
    function getRoleAgentData(uint256 tokenId) external view returns (RoleAgent memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return roleAgents[tokenId];
    }

    /**
     * @dev Get all trust signals for a role agent
     * @param tokenId The token ID
     * @return Array of trust signals
     */
    function getTrustSignals(uint256 tokenId) external view returns (TrustSignal[] memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return trustSignals[tokenId];
    }

    /**
     * @dev Get recent trust signals (last N signals)
     * @param tokenId The token ID
     * @param count Number of recent signals to retrieve
     * @return Array of recent trust signals
     */
    function getRecentTrustSignals(uint256 tokenId, uint256 count) external view returns (TrustSignal[] memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        TrustSignal[] storage allSignals = trustSignals[tokenId];
        uint256 totalSignals = allSignals.length;
        
        if (totalSignals == 0 || count == 0) {
            return new TrustSignal[](0);
        }
        
        uint256 returnCount = count > totalSignals ? totalSignals : count;
        TrustSignal[] memory recentSignals = new TrustSignal[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            recentSignals[i] = allSignals[totalSignals - returnCount + i];
        }
        
        return recentSignals;
    }

    /**
     * @dev Get all achievements for a role agent
     * @param tokenId The token ID
     * @return Array of achievements
     */
    function getAchievements(uint256 tokenId) external view returns (Achievement[] memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
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
     * @dev Get global platform statistics
     * @return totalAgents Various platform metrics
     * @return totalSignalsProcessed Total trust signals processed
     * @return totalAchievementsEarned Total achievements earned
     * @return eligibleAgents Number of eligible agents
     * @return unverifiedAgents Number of unverified agents
     * @return basicAgents Number of basic agents
     * @return trustedAgents Number of trusted agents
     * @return highlyTrustedAgents Number of highly trusted agents
     * @return eliteAgents Number of elite agents
     */
    function getPlatformStats() external view returns (
        uint256 totalAgents,
        uint256 totalSignalsProcessed,
        uint256 totalAchievementsEarned,
        uint256 eligibleAgents,
        uint256 unverifiedAgents,
        uint256 basicAgents,
        uint256 trustedAgents,
        uint256 highlyTrustedAgents,
        uint256 eliteAgents
    ) {
        return (
            _tokenIdCounter,
            totalTrustSignals,
            totalAchievements,
            agentsByTrustLevel[TrustLevel.HIGHLY_TRUSTED] + agentsByTrustLevel[TrustLevel.ELITE],
            agentsByTrustLevel[TrustLevel.UNVERIFIED],
            agentsByTrustLevel[TrustLevel.BASIC],
            agentsByTrustLevel[TrustLevel.TRUSTED],
            agentsByTrustLevel[TrustLevel.HIGHLY_TRUSTED],
            agentsByTrustLevel[TrustLevel.ELITE]
        );
    }

    // =============================================================================
    // DYNAMIC METADATA
    // =============================================================================

    /**
     * @dev Generate dynamic token URI based on current trust score and achievements
     * @param tokenId The token ID
     * @return Dynamic token URI with embedded metadata
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        RoleAgent memory agent = roleAgents[tokenId];
        Achievement[] memory agentAchievements = achievements[tokenId];
        
        // Generate dynamic metadata
        string memory json = _generateDynamicMetadata(tokenId, agent, agentAchievements);
        
        // Return base64 encoded data URI
        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(json))
        ));
    }

    /**
     * @dev Generate dynamic metadata JSON for a role agent
     * @param tokenId The token ID
     * @param agent The role agent data
     * @return JSON metadata string
     */
    function _generateDynamicMetadata(
        uint256 tokenId,
        RoleAgent memory agent,
        Achievement[] memory /* agentAchievements */
    ) internal view returns (string memory) {
        string memory trustLevelName = _getTrustLevelName(agent.trustLevel);
        string memory eligibilityStatus = agent.isEligibleForAchievements ? "Eligible" : "Not Eligible";
        
        // Build attributes array
        string memory attributes = string(abi.encodePacked(
            '[',
            '{"trait_type":"Trust Score","value":', agent.trustScore.toString(), '},',
            '{"trait_type":"Trust Level","value":"', trustLevelName, '"},',
            '{"trait_type":"Role","value":"', agent.role, '"},',
            '{"trait_type":"Organization","value":"', agent.organization, '"},',
            '{"trait_type":"NFT Eligibility","value":"', eligibilityStatus, '"},',
            '{"trait_type":"Total Signals","value":', agent.totalSignals.toString(), '},',
            '{"trait_type":"Achievement Count","value":', agent.achievementCount.toString(), '},',
            '{"trait_type":"Status","value":"', agent.isActive ? "Active" : "Inactive", '"},',
            '{"trait_type":"DID","value":"', agent.did, '"}',
            ']'
        ));
        
        // Build complete JSON
        return string(abi.encodePacked(
            '{',
            '"name":"', agent.name, '",',
            '"description":"SCK Role Agent: ', agent.role, ' with trust score ', agent.trustScore.toString(), '/1000",',
            '"image":"', _baseTokenURI, tokenId.toString(), '.png",',
            '"external_url":"https://securecodeknight.com/agents/', tokenId.toString(), '",',
            '"attributes":', attributes,
            '}'
        ));
    }

    // =============================================================================
    // INTERNAL HELPER FUNCTIONS
    // =============================================================================

    /**
     * @dev Calculate trust level based on trust score
     * @param trustScore The trust score (0-1000)
     * @return The corresponding trust level
     */
    function _calculateTrustLevel(uint256 trustScore) internal pure returns (TrustLevel) {
        if (trustScore >= 900) return TrustLevel.ELITE;
        if (trustScore >= 750) return TrustLevel.HIGHLY_TRUSTED;
        if (trustScore >= 500) return TrustLevel.TRUSTED;
        if (trustScore >= 250) return TrustLevel.BASIC;
        return TrustLevel.UNVERIFIED;
    }

    /**
     * @dev Get trust level name as string
     * @param level The trust level enum
     * @return String representation of trust level
     */
    function _getTrustLevelName(TrustLevel level) internal pure returns (string memory) {
        if (level == TrustLevel.ELITE) return "Elite";
        if (level == TrustLevel.HIGHLY_TRUSTED) return "Highly Trusted";
        if (level == TrustLevel.TRUSTED) return "Trusted";
        if (level == TrustLevel.BASIC) return "Basic";
        return "Unverified";
    }

    // =============================================================================
    // OVERRIDE FUNCTIONS
    // =============================================================================

    /**
     * @dev Override transfer function to prevent soulbound token transfers
     */
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Prevent transfer of soulbound tokens (except minting)
        if (from != address(0)) {
            require(!soulboundTokens[tokenId], "Token is soulbound and cannot be transferred");
        }
        
        // Update user mapping on transfer
        if (from != address(0) && to != address(0)) {
            delete userToTokenId[from];
            userToTokenId[to] = tokenId;
        }
        
        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Support for AccessControl interface
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
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
     * @dev Set contract metadata URI
     * @param contractMetadataURI The new contract metadata URI
     */
    function setContractURI(string memory contractMetadataURI) external onlyOwner {
        _contractURI = contractMetadataURI;
    }

    /**
     * @dev Get contract metadata URI
     * @return The contract metadata URI
     */
    function contractURI() external view returns (string memory) {
        return _contractURI;
    }

    /**
     * @dev Emergency function to deactivate a role agent
     * @param tokenId The token ID
     */
    function deactivateRoleAgent(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        roleAgents[tokenId].isActive = false;
    }

    /**
     * @dev Emergency function to reactivate a role agent
     * @param tokenId The token ID
     */
    function reactivateRoleAgent(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        roleAgents[tokenId].isActive = true;
    }
} 