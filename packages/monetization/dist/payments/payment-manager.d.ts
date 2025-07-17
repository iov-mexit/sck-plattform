import { Payment, PaymentStatus } from '@sck/schema';
export interface PaymentConfig {
    provider: 'stripe' | 'paypal' | 'ilp';
    apiKey: string;
    webhookSecret?: string;
}
export declare class PaymentManager {
    private config;
    constructor(config: PaymentConfig);
    createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment>;
    processPayment(paymentId: string): Promise<boolean>;
    getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
    refundPayment(paymentId: string, amount?: number): Promise<boolean>;
}
//# sourceMappingURL=payment-manager.d.ts.map