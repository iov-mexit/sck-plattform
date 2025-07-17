import { DIDManager } from '@sck/identity';
import { PolygonManager } from '@sck/blockchain';
import { AgentRegistry } from '@sck/ans';
export interface Proposal {
    id: string;
    title: string;
    description: string;
    proposerDid: string;
    proposalType: 'TECHNICAL' | 'TREASURY' | 'GOVERNANCE' | 'EMERGENCY';
    parameters: Record<string, any>;
    votingPeriod: number;
    votingEndTime: string;
    quorum: number;
    status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'EXECUTED' | 'PASSED' | 'REJECTED';
    createdAt: Date;
    activatedAt?: Date;
    closedAt?: Date;
    executionData?: ExecutionData;
}
export interface ExecutionData {
    executedAt: string;
    executorDid: string;
    transactionHash?: string;
    result: 'SUCCESS' | 'FAILED' | 'PENDING';
    errorMessage?: string;
}
export interface Vote {
    proposalId: string;
    voterDid: string;
    vote: 'FOR' | 'AGAINST' | 'ABSTAIN';
    reason?: string;
    votingPower: number;
    timestamp: Date;
}
export interface VotingResult {
    proposalId: string;
    totalVotes: number;
    forVotes: number;
    againstVotes: number;
    abstainVotes: number;
    quorumMet: boolean;
    passed: boolean;
    participationRate: number;
}
export interface DAOConfig {
    name: string;
    description: string;
    governanceToken: string;
    minProposalDeposit: number;
    votingPeriod: number;
    quorumPercentage: number;
    emergencyThreshold: number;
    metaAgentAddress: string;
}
export declare class DAOManager {
    private didManager;
    private polygonManager;
    private agentRegistry;
    private config;
    private proposals;
    private votes;
    constructor(didManager: DIDManager, polygonManager: PolygonManager, agentRegistry: AgentRegistry, config: DAOConfig);
    createProposal(proposalData: {
        title: string;
        description: string;
        proposerDid: string;
        proposalType: Proposal['proposalType'];
        parameters: Record<string, any>;
        votingPeriod: number;
        quorum: number;
    }): Promise<Proposal>;
    activateProposal(proposalId: string): Promise<void>;
    vote(proposalId: string, voterDid: string, vote: Vote['vote'], reason?: string): Promise<Vote>;
    getProposal(proposalId: string): Promise<Proposal | null>;
    getVotes(proposalId: string): Promise<Vote[]>;
    getVotingResult(proposalId: string): Promise<VotingResult>;
    finalizeProposal(proposalId: string): Promise<void>;
    executeProposal(proposalId: string, executorDid: string): Promise<ExecutionData>;
    private executeGovernanceProposal;
    private executeTreasuryProposal;
    private executeTechnicalProposal;
    private executeEmergencyProposal;
    getProposals(status?: Proposal['status'], proposerDid?: string, limit?: number, offset?: number): Promise<Proposal[]>;
    getVotingPower(did: string): Promise<number>;
    getTotalVotingPower(): Promise<number>;
    getProposalVotes(proposalId: string): Promise<Vote[]>;
    hasVoted(proposalId: string, voterDid: string): Promise<boolean>;
}
//# sourceMappingURL=dao-manager.d.ts.map