import { AgentProfile, AgentCapability } from '../registry/agent-registry';
export interface NegotiationRequest {
    id: string;
    requesterDid: string;
    providerDid: string;
    capabilityId: string;
    parameters: Record<string, any>;
    constraints: NegotiationConstraint[];
    budget: number;
    deadline: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}
export interface NegotiationConstraint {
    type: 'COST' | 'QUALITY' | 'TIME' | 'PRIVACY' | 'SECURITY';
    operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in';
    value?: any;
    weight: number;
}
export interface NegotiationOffer {
    id: string;
    negotiationId: string;
    providerDid: string;
    capabilityId: string;
    parameters: Record<string, any>;
    cost: number;
    estimatedTime: number;
    quality: number;
    privacyLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    securityLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    terms: Record<string, any>;
    validUntil: string;
}
export interface NegotiationResponse {
    id: string;
    negotiationId: string;
    requesterDid: string;
    action: 'ACCEPT' | 'REJECT' | 'COUNTER_OFFER';
    offerId?: string;
    counterOffer?: Partial<NegotiationOffer>;
    reason?: string;
}
export interface NegotiationSession {
    id: string;
    request: NegotiationRequest;
    offers: NegotiationOffer[];
    responses: NegotiationResponse[];
    status: 'PENDING' | 'NEGOTIATING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
    createdAt: string;
    updatedAt: string;
    finalAgreement?: NegotiationAgreement;
}
export interface NegotiationAgreement {
    id: string;
    negotiationId: string;
    requesterDid: string;
    providerDid: string;
    capabilityId: string;
    finalOffer: NegotiationOffer;
    terms: Record<string, any>;
    createdAt: string;
    expiresAt: string;
}
export declare class NegotiationEngine {
    private sessions;
    private strategies;
    constructor();
    private initializeStrategies;
    createNegotiation(request: Omit<NegotiationRequest, 'id'>): Promise<NegotiationSession>;
    generateOffer(negotiationId: string, providerProfile: AgentProfile, capability: AgentCapability): Promise<NegotiationOffer>;
    respondToOffer(negotiationId: string, response: Omit<NegotiationResponse, 'id' | 'negotiationId'>): Promise<NegotiationResponse>;
    getNegotiationSession(negotiationId: string): Promise<NegotiationSession | null>;
    updateNegotiationStatus(negotiationId: string, status: NegotiationSession['status']): Promise<void>;
    private determineStrategy;
    private validateOffer;
    private getOfferValue;
    private validateConstraint;
}
//# sourceMappingURL=negotiation-engine.d.ts.map