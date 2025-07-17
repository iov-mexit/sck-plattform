export interface FlareConfig {
    network: 'mainnet' | 'testnet';
    nodeUrl: string;
    apiKey?: string;
}
export declare class FlareManager {
    private config;
    constructor(config: FlareConfig);
    connect(): Promise<void>;
    getStateConnectorData(requestId: string): Promise<any>;
    submitAttestation(attestation: any): Promise<string>;
}
//# sourceMappingURL=flare-manager.d.ts.map