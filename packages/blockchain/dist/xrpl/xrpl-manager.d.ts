export interface XRPLConfig {
    network: 'mainnet' | 'testnet';
    nodeUrl: string;
    apiKey?: string;
}
export declare class XRPLManager {
    private config;
    constructor(config: XRPLConfig);
    connect(): Promise<void>;
    sendPayment(from: string, to: string, amount: string): Promise<string>;
    getBalance(address: string): Promise<string>;
}
//# sourceMappingURL=xrpl-manager.d.ts.map