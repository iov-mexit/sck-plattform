import { DIDManager } from '../did/did-manager';
export interface CredentialSubject {
    id: string;
    [key: string]: unknown;
}
export interface VerifiableCredential {
    '@context': string[];
    id: string;
    type: string[];
    issuer: string;
    issuanceDate: string;
    credentialSubject: CredentialSubject;
    proof?: unknown;
}
export interface CredentialSchema {
    id: string;
    type: string;
    properties: Record<string, unknown>;
    required: readonly string[];
}
export declare const EUDIW_SCHEMAS: {
    readonly PERSONAL_IDENTITY: {
        readonly id: "https://eudiw.eu/schemas/personal-identity";
        readonly type: "PersonalIdentityCredential";
        readonly properties: {
            readonly givenName: {
                readonly type: "string";
            };
            readonly familyName: {
                readonly type: "string";
            };
            readonly dateOfBirth: {
                readonly type: "string";
                readonly format: "date";
            };
            readonly nationality: {
                readonly type: "string";
            };
            readonly personalIdentifier: {
                readonly type: "string";
            };
        };
        readonly required: readonly ["givenName", "familyName", "dateOfBirth", "nationality"];
    };
    readonly PROFESSIONAL_QUALIFICATION: {
        readonly id: "https://eudiw.eu/schemas/professional-qualification";
        readonly type: "ProfessionalQualificationCredential";
        readonly properties: {
            readonly qualificationName: {
                readonly type: "string";
            };
            readonly issuingAuthority: {
                readonly type: "string";
            };
            readonly issueDate: {
                readonly type: "string";
                readonly format: "date";
            };
            readonly expiryDate: {
                readonly type: "string";
                readonly format: "date";
            };
            readonly qualificationLevel: {
                readonly type: "string";
            };
        };
        readonly required: readonly ["qualificationName", "issuingAuthority", "issueDate"];
    };
    readonly SCORE_ASSESSMENT: {
        readonly id: "https://eudiw.eu/schemas/score-assessment";
        readonly type: "ScoreAssessmentCredential";
        readonly properties: {
            readonly scoreName: {
                readonly type: "string";
            };
            readonly scoreLevel: {
                readonly type: "string";
                readonly enum: readonly ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
            };
            readonly assessmentDate: {
                readonly type: "string";
                readonly format: "date";
            };
            readonly assessor: {
                readonly type: "string";
            };
            readonly evidence: {
                readonly type: "string";
            };
        };
        readonly required: readonly ["scoreName", "scoreLevel", "assessmentDate", "assessor"];
    };
};
export declare class CredentialManager {
    private didManager;
    static readonly EUDIW_SCHEMAS: {
        readonly PERSONAL_IDENTITY: {
            readonly id: "https://eudiw.eu/schemas/personal-identity";
            readonly type: "PersonalIdentityCredential";
            readonly properties: {
                readonly givenName: {
                    readonly type: "string";
                };
                readonly familyName: {
                    readonly type: "string";
                };
                readonly dateOfBirth: {
                    readonly type: "string";
                    readonly format: "date";
                };
                readonly nationality: {
                    readonly type: "string";
                };
                readonly personalIdentifier: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["givenName", "familyName", "dateOfBirth", "nationality"];
        };
        readonly PROFESSIONAL_QUALIFICATION: {
            readonly id: "https://eudiw.eu/schemas/professional-qualification";
            readonly type: "ProfessionalQualificationCredential";
            readonly properties: {
                readonly qualificationName: {
                    readonly type: "string";
                };
                readonly issuingAuthority: {
                    readonly type: "string";
                };
                readonly issueDate: {
                    readonly type: "string";
                    readonly format: "date";
                };
                readonly expiryDate: {
                    readonly type: "string";
                    readonly format: "date";
                };
                readonly qualificationLevel: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["qualificationName", "issuingAuthority", "issueDate"];
        };
        readonly SCORE_ASSESSMENT: {
            readonly id: "https://eudiw.eu/schemas/score-assessment";
            readonly type: "ScoreAssessmentCredential";
            readonly properties: {
                readonly scoreName: {
                    readonly type: "string";
                };
                readonly scoreLevel: {
                    readonly type: "string";
                    readonly enum: readonly ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
                };
                readonly assessmentDate: {
                    readonly type: "string";
                    readonly format: "date";
                };
                readonly assessor: {
                    readonly type: "string";
                };
                readonly evidence: {
                    readonly type: "string";
                };
            };
            readonly required: readonly ["scoreName", "scoreLevel", "assessmentDate", "assessor"];
        };
    };
    constructor(didManager: DIDManager);
    validateCredential(credential: VerifiableCredential, schema?: Record<string, unknown>): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    issueCredential(issuerDid: string, subjectDid: string, schema: CredentialSchema, subjectData: Record<string, unknown>, selectiveDisclosureFields?: string[]): Promise<VerifiableCredential>;
    createVerifiableCredentialJWT(credential: VerifiableCredential, _issuerPrivateKey: string): Promise<string>;
    verifyCredential(jwt: string): Promise<boolean>;
    validateEUDIWCompliance(credential: VerifiableCredential): Promise<{
        compliant: boolean;
        errors: string[];
    }>;
    revokeCredential(credentialId: string, issuerDid: string): Promise<void>;
    /**
     * ⚠️ Senior Dev TODO: Replace this with real SD-JWT logic using `@sd-jwt/core` or BBS+ SDK
     * https://github.com/oauthstuff/sd-jwt
     *
     * Implementation Steps:
     * 1. Install: npm install @sd-jwt/core
     * 2. Import: import { SDJWT } from '@sd-jwt/core'
     * 3. Replace stub with:
     *    - Create SD-JWT payload with selective fields
     *    - Sign with issuer private key
     *    - Return properly formatted SD-JWT string
     *
     * Alternative ZK Implementation:
     * - Use BBS+ for selective disclosure proofs
     * - Implement zk-SNARK circuits for complex privacy
     * - Add zero-knowledge proof verification
     */
    private createSDJWT;
}
//# sourceMappingURL=credential-manager.d.ts.map