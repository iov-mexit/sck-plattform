import { DIDDocument, DIDResolutionResult } from 'did-resolver';
export interface DIDConfig {
    rpcUrl: string;
    chainId: number;
    domain: string;
}
export interface DIDMetadata {
    name?: string;
    avatar?: string;
    description?: string;
    skills?: string[];
    reputation?: number;
}
export declare class DIDManager {
    private config;
    constructor(config: DIDConfig);
    createDID(): Promise<string>;
    resolveDID(did: string): Promise<DIDResolutionResult>;
    updateDIDDocument(did: string, document: Partial<DIDDocument>): Promise<void>;
    getDIDMetadata(did: string): Promise<DIDMetadata>;
    verifySignature(did: string, message: string, signature: string): Promise<boolean>;
}
//# sourceMappingURL=did-manager.d.ts.map