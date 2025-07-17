export interface CrossChainAgent {
    did: string;
    chainId: string;
    capabilities: string[];
    status: 'ACTIVE' | 'INACTIVE';
}
export declare class InteropManager {
    private crossChainAgents;
    registerCrossChainAgent(agent: CrossChainAgent): Promise<void>;
    getCrossChainAgent(did: string): Promise<CrossChainAgent | null>;
    listCrossChainAgents(): Promise<CrossChainAgent[]>;
}
//# sourceMappingURL=interop-manager.d.ts.map