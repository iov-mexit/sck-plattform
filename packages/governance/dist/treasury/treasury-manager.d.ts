export interface TreasuryConfig {
    daoAddress: string;
    governanceToken: string;
    minTransactionAmount: number;
    maxTransactionAmount: number;
}
export declare class TreasuryManager {
    private config;
    constructor(config: TreasuryConfig);
    getBalance(): Promise<number>;
    executeTransaction(amount: number, recipient: string, purpose: string): Promise<string>;
    validateTransaction(amount: number, recipient: string): Promise<boolean>;
}
//# sourceMappingURL=treasury-manager.d.ts.map