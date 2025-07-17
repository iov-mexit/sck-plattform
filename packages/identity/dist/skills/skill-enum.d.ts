/**
 * Skill Enum for Type-Safe Dynamic Access
 *
 * This implements the hybrid schema-enum approach for dynamic NFT skill updates:
 * - Use enums for known properties (enforces type safety and dev autocomplete)
 * - Use schema-driven validation for rare dynamic cases
 */
export declare enum Skill {
    VERIFIED_HUMAN = "VERIFIED_HUMAN",
    ZK_VERIFIED = "ZK_VERIFIED",
    AGE_VERIFIED = "AGE_VERIFIED",
    LOCATION_VERIFIED = "LOCATION_VERIFIED",
    DAO_MEMBER = "DAO_MEMBER",
    PROPOSAL_CREATOR = "PROPOSAL_CREATOR",
    VOTER = "VOTER",
    DELEGATE = "DELEGATE",
    DEVELOPER = "DEVELOPER",
    ZK_DEVELOPER = "ZK_DEVELOPER",
    SMART_CONTRACT_DEVELOPER = "SMART_CONTRACT_DEVELOPER",
    FRONTEND_DEVELOPER = "FRONTEND_DEVELOPER",
    BACKEND_DEVELOPER = "BACKEND_DEVELOPER",
    DEVOPS_ENGINEER = "DEVOPS_ENGINEER",
    SECURITY_ANALYST = "SECURITY_ANALYST",
    AI_SPECIALIST = "AI_SPECIALIST",
    SECURITY_SPECIALIST = "SECURITY_SPECIALIST",
    BLOCKCHAIN_SPECIALIST = "BLOCKCHAIN_SPECIALIST",
    COMPLIANCE_SPECIALIST = "COMPLIANCE_SPECIALIST",
    DATA_ANALYST = "DATA_ANALYST",
    PRODUCT_MANAGER = "PRODUCT_MANAGER",
    QA_ENGINEER = "QA_ENGINEER",
    ARCHITECT = "ARCHITECT",
    HIGH_REPUTATION = "HIGH_REPUTATION",
    TRUSTED_REVIEWER = "TRUSTED_REVIEWER",
    MENTOR = "MENTOR",
    CONTRIBUTOR = "CONTRIBUTOR"
}
export declare enum SkillLevel {
    BEGINNER = 1,
    INTERMEDIATE = 3,
    ADVANCED = 5,
    EXPERT = 7,
    MASTER = 10
}
export interface SkillProfile {
}
/**
 * Type-safe skill access helpers
 */
export declare class SkillManager {
    /**
     * Check if a skill exists in the profile
     */
    static hasSkill(profile: SkillProfile, skill: Skill): boolean;
    /**
     * Get skill level safely
     */
    static getSkillLevel(profile: SkillProfile, skill: Skill): SkillLevel | undefined;
    /**
     * Check if skill meets minimum level requirement
     */
    static hasSkillLevel(profile: SkillProfile, skill: Skill, minLevel: SkillLevel): boolean;
    /**
     * Add or update a skill in the profile
     */
    static setSkill(profile: SkillProfile, skill: Skill, level: SkillLevel): SkillProfile;
    /**
     * Remove a skill from the profile
     */
    static removeSkill(profile: SkillProfile, skill: Skill): SkillProfile;
    /**
     * Validate dynamic skill key (for schema-driven cases)
     */
    static isValidSkillKey(key: string): boolean;
    /**
     * Get all skills in profile
     */
    static getAllSkills(profile: SkillProfile): Skill[];
    /**
     * Get verified skills only
     */
    static getVerifiedSkills(profile: SkillProfile): Skill[];
    /**
     * Calculate total skill score
     */
    static calculateSkillScore(profile: SkillProfile): number;
}
/**
 * Schema validation for dynamic skills
 */
export declare const SkillSchema: {
    readonly type: "number";
    readonly enum: readonly [SkillLevel.BEGINNER, SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED, SkillLevel.EXPERT];
};
/**
 * Validate skill level against schema
 */
export declare function validateSkillLevel(level: unknown): level is SkillLevel;
//# sourceMappingURL=skill-enum.d.ts.map