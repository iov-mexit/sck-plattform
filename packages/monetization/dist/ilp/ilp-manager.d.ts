import { Payment } from '@sck/schema';
export interface ILPConfig {
    connectorUrl: string;
    secret: string;
    assetCode: string;
    assetScale: number;
}
export interface ILPStreamConfig {
    maxPacketAmount: string;
    minPacketAmount: string;
    maxPacketCount: number;
}
export declare class ILPManager {
    private config;
    private streamConfig;
    constructor(config: ILPConfig);
    createPayment(payment: Payment): Promise<string>;
    processPayment(paymentId: string): Promise<boolean>;
    getPaymentStatus(paymentId: string): Promise<string>;
    createStream(payerDID: string, payeeDID: string, amount: number): Promise<string>;
    closeStream(streamId: string): Promise<boolean>;
}
//# sourceMappingURL=ilp-manager.d.ts.map