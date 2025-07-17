export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface DIDDocument {
    '@context': string[];
    id: string;
    controller: string;
    verificationMethod: VerificationMethod[];
    authentication: string[];
    assertionMethod: string[];
}
export interface VerificationMethod {
    id: string;
    type: string;
    controller: string;
    publicKeyJwk?: any;
    publicKeyMultibase?: string;
}
export interface VerifiableCredential {
    '@context': string[];
    id: string;
    type: string[];
    issuer: string;
    issuanceDate: string;
    credentialSubject: any;
    proof?: any;
}
export interface AgentProfile {
    did: string;
    name: string;
    description: string;
    capabilities: AgentCapability[];
    metadata: Record<string, any>;
}
export interface AgentCapability {
    name: string;
    version: string;
    description: string;
    inputSchema: Record<string, any>;
    outputSchema: Record<string, any>;
    costPerCall: number;
    maxConcurrentCalls: number;
}
export interface Proposal {
    id: string;
    title: string;
    description: string;
    proposerDid: string;
    proposalType: 'TECHNICAL' | 'TREASURY' | 'GOVERNANCE' | 'EMERGENCY';
    parameters: Record<string, any>;
    votingPeriod: number;
    quorum: number;
    status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'EXECUTED';
    createdAt: Date;
    activatedAt?: Date;
    closedAt?: Date;
}
export interface Vote {
    proposalId: string;
    voterDid: string;
    vote: 'FOR' | 'AGAINST' | 'ABSTAIN';
    reason?: string;
    votingPower: number;
    timestamp: Date;
}
export * from './digital-twin';
export interface DID {
    did: string;
    controller: string;
    verificationMethods: VerificationMethod[];
    services?: Service[];
    created: Date;
    updated: Date;
}
export interface VerificationMethod {
    id: string;
    type: string;
    controller: string;
    publicKeyJwk?: any;
    publicKeyMultibase?: string;
}
export interface Service {
    id: string;
    type: string;
    serviceEndpoint: string;
}
export interface Credential {
    id: string;
    type: string[];
    issuer: string;
    issuanceDate: Date;
    expirationDate?: Date;
    credentialSubject: Record<string, any>;
    proof?: Proof;
}
export interface Proof {
    type: string;
    created: Date;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
}
export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeDID?: string;
    organizationId: string;
    tags: string[];
    estimatedHours?: number;
    actualHours?: number;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum TaskStatus {
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    REVIEW = "REVIEW",
    DONE = "DONE",
    CANCELLED = "CANCELLED"
}
export declare enum TaskPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export interface Proposal {
    id: string;
    title: string;
    description: string;
    proposerDID: string;
    organizationId: string;
    status: ProposalStatus;
    votes: Vote[];
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum ProposalStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    PASSED = "PASSED",
    REJECTED = "REJECTED",
    EXECUTED = "EXECUTED"
}
export interface Vote {
    voterDID: string;
    choice: VoteChoice;
    weight: number;
    timestamp: Date;
}
export declare enum VoteChoice {
    YES = "YES",
    NO = "NO",
    ABSTAIN = "ABSTAIN"
}
export interface Payment {
    id: string;
    payerDID: string;
    payeeDID: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    description: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export interface SecurityEvent {
    id: string;
    type: SecurityEventType;
    severity: SecuritySeverity;
    description: string;
    affectedDID?: string;
    organizationId?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
}
export declare enum SecurityEventType {
    AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE",
    AUTHORIZATION_VIOLATION = "AUTHORIZATION_VIOLATION",
    DATA_BREACH = "DATA_BREACH",
    SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
    SYSTEM_COMPROMISE = "SYSTEM_COMPROMISE"
}
export declare enum SecuritySeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
//# sourceMappingURL=index.d.ts.map