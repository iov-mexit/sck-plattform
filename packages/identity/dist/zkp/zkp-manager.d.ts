export interface ZKPConfig {
    circuitPath: string;
    provingKeyPath: string;
    verificationKeyPath: string;
}
export interface ZKPProof {
    proof: string;
    publicInputs: string[];
    verified: boolean;
}
export interface ZKPStatement {
    credentialHash: string;
    revealedFields: string[];
    hiddenFields: string[];
    constraints: ZKPConstraint[];
}
export interface ZKPConstraint {
    field: string;
    operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in';
    value: unknown;
}
export interface AgeProof {
    proof: string;
    publicInputs: {
        ageHash: string;
        minAge: number;
        maxAge: number;
    };
}
export interface SkillProof {
    proof: string;
    publicInputs: {
        skillHash: string;
        skillLevel: string;
        assessmentDate: string;
    };
}
export declare class ZKPManager {
    private config;
    constructor(config: ZKPConfig);
    generateProof(privateInputs: any[], publicInputs: any[]): Promise<ZKPProof>;
    verifyProof(proof: ZKPProof): Promise<boolean>;
    createAgeProof(age: number, minimumAge: number): Promise<ZKPProof>;
    createLocationProof(location: string, allowedRegions: string[]): Promise<ZKPProof>;
}
//# sourceMappingURL=zkp-manager.d.ts.map