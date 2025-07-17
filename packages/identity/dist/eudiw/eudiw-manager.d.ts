import { CredentialManager, EUDIW_SCHEMAS, VerifiableCredential, CredentialSchema } from '../credentials/credential-manager';
import { ZKPManager, AgeProof, ZKPProof, SkillProof } from '../zkp/zkp-manager';
import { DIDManager } from '../did/did-manager';
export interface EUDIWConfig {
    walletId: string;
    memberState: string;
    qeaaLevel: 'LOW' | 'SUBSTANTIAL' | 'HIGH';
    supportedSchemas: string[];
}
export interface EUDIWWallet {
    id: string;
    holder: string;
    memberState: string;
    qeaaLevel: string;
    credentials: string[];
    lastSync: string;
}
export interface EUDIWRequest {
    id: string;
    requester: string;
    requestedCredentials: string[];
    purpose: string;
    legalBasis: string;
    expiryDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
}
export interface EUDIWResponse {
    requestId: string;
    holder: string;
    credentials: VerifiableCredential[];
    proofs: (AgeProof | ZKPProof | SkillProof)[];
    timestamp: string;
    signature: string;
}
export declare class EUDIWManager {
    private credentialManager;
    private zkpManager;
    private didManager;
    private config;
    constructor(credentialManager: CredentialManager, zkpManager: ZKPManager, didManager: DIDManager, config: EUDIWConfig);
    createEUDIWWallet(holderDid: string): Promise<EUDIWWallet>;
    issueEUDIWCredential(issuerDid: string, holderDid: string, credentialType: keyof typeof EUDIW_SCHEMAS, subjectData: Record<string, unknown>): Promise<VerifiableCredential>;
    createEUDIWRequest(requesterDid: string, requestedCredentials: string[], purpose: string, legalBasis: string, expiryHours?: number): Promise<EUDIWRequest>;
    processEUDIWRequest(request: EUDIWRequest, holderDid: string, wallet: EUDIWWallet): Promise<EUDIWResponse>;
    validateEUDIWRequirements(schema: CredentialSchema, subjectData: Record<string, unknown>): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    private getValidAuthorities;
    verifyEUDIWResponse(response: EUDIWResponse): Promise<boolean>;
    syncWithEUDIWRegistry(wallet: EUDIWWallet): Promise<void>;
}
//# sourceMappingURL=eudiw-manager.d.ts.map