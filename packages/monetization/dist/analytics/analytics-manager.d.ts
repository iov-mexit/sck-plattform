import { Payment } from '@sck/schema';
export interface AnalyticsConfig {
    enabled: boolean;
    trackingId?: string;
    endpoint?: string;
}
export interface PaymentAnalytics {
    totalPayments: number;
    totalAmount: number;
    averageAmount: number;
    currencyBreakdown: Record<string, number>;
    statusBreakdown: Record<string, number>;
}
export declare class AnalyticsManager {
    private config;
    constructor(config: AnalyticsConfig);
    trackPayment(payment: Payment): Promise<void>;
    getPaymentAnalytics(organizationId: string, startDate: Date, endDate: Date): Promise<PaymentAnalytics>;
    generateReport(organizationId: string, reportType: string): Promise<any>;
}
//# sourceMappingURL=analytics-manager.d.ts.map