import { ethers } from 'ethers';
export interface PolygonConfig {
    rpcUrl: string;
    chainId: number;
    contractAddresses: {
        dao: string;
        nft: string;
        ilp: string;
        governance: string;
    };
    privateKey?: string;
}
export interface ZKProof {
    proof: string;
    publicInputs: string[];
    verificationKey: string;
}
export interface ComplianceProof {
    type: 'GDPR' | 'EUDIW' | 'ISO27001' | 'SOC2';
    proof: ZKProof;
    metadata: Record<string, any>;
    timestamp: string;
}
export interface SmartContractCall {
    contractAddress: string;
    functionName: string;
    parameters: any[];
    value?: string;
    gasLimit?: number;
}
export declare class PolygonManager {
    private provider;
    private signer?;
    private config;
    constructor(config: PolygonConfig);
    deployContract(contractName: string, constructorArgs: any[], gasLimit?: number): Promise<string>;
    callContract(call: SmartContractCall): Promise<any>;
    sendTransaction(call: SmartContractCall, signer?: ethers.Wallet): Promise<ethers.ContractTransactionReceipt>;
    generateZKProof(circuitName: string, privateInputs: Record<string, any>): Promise<ZKProof>;
    verifyZKProof(proof: ZKProof): Promise<boolean>;
    generateComplianceProof(complianceType: ComplianceProof['type'], data: Record<string, any>): Promise<ComplianceProof>;
    verifyComplianceProof(proof: ComplianceProof): Promise<boolean>;
    private verifyGDPRCompliance;
    private verifyEUDIWCompliance;
    private verifyISO27001Compliance;
    private verifySOC2Compliance;
    getSignerAddress(): Promise<string>;
    getBalance(address: string): Promise<string>;
    getGasPrice(): Promise<string>;
    estimateGas(call: SmartContractCall): Promise<number>;
    waitForTransaction(txHash: string): Promise<ethers.TransactionReceipt | null>;
    getTransactionReceipt(txHash: string): Promise<ethers.TransactionReceipt | null>;
    getBlockNumber(): Promise<number>;
    getBlock(blockNumber: number): Promise<ethers.Block | null>;
    listenToEvents(contractAddress: string, eventName: string, callback: (event: any) => void): Promise<void>;
    stopListeningToEvents(contractAddress: string, eventName: string): Promise<void>;
}
//# sourceMappingURL=polygon-manager.d.ts.map