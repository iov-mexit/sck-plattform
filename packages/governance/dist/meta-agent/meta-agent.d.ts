export interface MetaAgentConfig {
    did: string;
    name: string;
    capabilities: string[];
    governanceRules: Record<string, any>;
}
export declare class MetaAgent {
    private config;
    constructor(config: MetaAgentConfig);
    analyzeProposal(proposal: any): Promise<{
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
        recommendations: string[];
        complianceStatus: boolean;
    }>;
    validateGovernanceDecision(decision: any): Promise<boolean>;
}
//# sourceMappingURL=meta-agent.d.ts.map