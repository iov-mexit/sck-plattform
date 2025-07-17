import { z } from 'zod';
import { Skill, SkillLevel, SkillProfile } from '../skills/skill-enum';
/**
 * Comprehensive Schema Validation System for Dynamic NFT Properties
 *
 * This implements the hybrid schema-enum approach:
 * - Use enums for known properties (type safety + autocomplete)
 * - Use schema-driven validation for dynamic cases
 * - Zod-based validation for runtime safety
 */
/**
 * Base schema for all credential subjects
 */
export declare const BaseCredentialSubjectSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodOptional<z.ZodString>;
    issuedAt: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Score credential schema with validation
 */
export declare const ScoreCredentialSchema: z.ZodObject<{
    level: z.ZodEnum<typeof SkillLevel>;
    verified: z.ZodBoolean;
    issuedAt: z.ZodString;
    expiresAt: z.ZodOptional<z.ZodString>;
    issuer: z.ZodString;
    evidence: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
/**
 * Dynamic score schema for unknown scores
 */
export declare const DynamicScoreSchema: z.ZodObject<{
    name: z.ZodString;
    level: z.ZodNumber;
    verified: z.ZodBoolean;
    issuedAt: z.ZodString;
    expiresAt: z.ZodOptional<z.ZodString>;
    issuer: z.ZodString;
    evidence: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
/**
 * NFT metadata schema for dynamic properties
 */
export declare const NFTMetadataSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    external_url: z.ZodOptional<z.ZodString>;
    attributes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        trait_type: z.ZodString;
        value: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>;
        display_type: z.ZodOptional<z.ZodEnum<{
            string: "string";
            number: "number";
            date: "date";
            boost_number: "boost_number";
            boost_percentage: "boost_percentage";
        }>>;
    }, z.core.$strip>>>;
    properties: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
}, z.core.$strip>;
/**
 * Verifiable credential schema
 */
export declare const VerifiableCredentialSchema: z.ZodObject<{
    '@context': z.ZodArray<z.ZodString>;
    id: z.ZodString;
    type: z.ZodArray<z.ZodString>;
    issuer: z.ZodString;
    issuanceDate: z.ZodString;
    credentialSubject: z.ZodUnion<readonly [z.ZodObject<{
        id: z.ZodString;
        type: z.ZodOptional<z.ZodString>;
        issuedAt: z.ZodOptional<z.ZodString>;
        expiresAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        level: z.ZodEnum<typeof SkillLevel>;
        verified: z.ZodBoolean;
        issuedAt: z.ZodString;
        expiresAt: z.ZodOptional<z.ZodString>;
        issuer: z.ZodString;
        evidence: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
    }, z.core.$strip>, z.ZodObject<{
        name: z.ZodString;
        level: z.ZodNumber;
        verified: z.ZodBoolean;
        issuedAt: z.ZodString;
        expiresAt: z.ZodOptional<z.ZodString>;
        issuer: z.ZodString;
        evidence: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.core.$ZodRecordKey, z.core.SomeType>>;
    }, z.core.$strip>]>;
    proof: z.ZodOptional<z.ZodUnknown>;
    expirationDate: z.ZodOptional<z.ZodString>;
    credentialStatus: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;
export interface ISchemaValidator {
    validate(data: any, schema: any): boolean;
    getErrors(): string[];
}
export declare class JSONSchemaValidator implements ISchemaValidator {
    private errors;
    validate(data: any, schema: any): boolean;
    getErrors(): string[];
}
/**
 * Schema validation manager for dynamic NFT properties
 */
export declare class SchemaValidator {
    /**
     * Validate a score credential
     */
    static validateScoreCredential(data: unknown): {
        success: boolean;
        data?: any;
        errors?: string[];
    };
    /**
     * Validate a dynamic score credential
     */
    static validateDynamicScore(data: unknown): {
        success: boolean;
        data?: any;
        errors?: string[];
    };
    /**
     * Validate NFT metadata
     */
    static validateNFTMetadata(data: unknown): {
        success: boolean;
        data?: any;
        errors?: string[];
    };
    /**
     * Validate verifiable credential
     */
    static validateVerifiableCredential(data: unknown): {
        success: boolean;
        data?: any;
        errors?: string[];
    };
    /**
     * Validate dynamic property access (for NFT-based systems)
     */
    static validateDynamicProperty(key: string, value: unknown, schema?: z.ZodSchema): {
        success: boolean;
        errors?: string[];
    };
    /**
     * Create a custom schema for dynamic properties
     */
    static createDynamicSchema(properties: Record<string, z.ZodSchema>): z.ZodObject<Record<string, z.ZodSchema>>;
    /**
     * Validate skill profile with schema
     */
    static validateSkillProfile(profile: SkillProfile): {
        success: boolean;
        errors?: string[];
    };
}
/**
 * Type-safe property access with validation
 */
export declare class SafePropertyAccess {
    /**
     * Safely access a property with validation
     */
    static getProperty<T>(obj: Record<string, unknown>, key: string, validator: z.ZodSchema<T>): T | null;
    /**
     * Safely set a property with validation
     */
    static setProperty<T>(obj: Record<string, unknown>, key: string, value: T, validator: z.ZodSchema<T>): {
        success: boolean;
        errors?: string[];
    };
    /**
     * Type-safe skill access
     */
    static getSkill(profile: SkillProfile, skill: Skill): SkillLevel | null;
    /**
     * Type-safe dynamic property access
     */
    static getDynamicProperty<T>(obj: Record<string, unknown>, key: string, schema: z.ZodSchema<T>): T | null;
}
/**
 * Registry for dynamic property schemas
 */
export declare class SchemaRegistry {
    private static schemas;
    /**
     * Register a schema for a dynamic property
     */
    static registerSchema(key: string, schema: z.ZodSchema): void;
    /**
     * Get a registered schema
     */
    static getSchema(key: string): z.ZodSchema | undefined;
    /**
     * Validate against registered schema
     */
    static validateWithRegisteredSchema(key: string, value: unknown): {
        success: boolean;
        errors?: string[];
    };
    /**
     * Clear all registered schemas
     */
    static clear(): void;
}
//# sourceMappingURL=index.d.ts.map