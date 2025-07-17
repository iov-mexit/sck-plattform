export interface CrossChainConfig {
    supportedChains: string[];
    bridgeAddresses: Record<string, string>;
}
export declare class InteropManager {
    private config;
    constructor(config: CrossChainConfig);
    bridgeTokens(fromChain: string, toChain: string, amount: string): Promise<string>;
    verifyCrossChainMessage(messageHash: string): Promise<boolean>;
}
//# sourceMappingURL=interop-manager.d.ts.map