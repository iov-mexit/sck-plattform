import { DIDManager } from '@sck/identity';
export interface AgentCapability {
    id: string;
    name: string;
    version: string;
    description: string;
    inputSchema: Record<string, any>;
    outputSchema: Record<string, any>;
    costPerCall: number;
    maxConcurrentCalls: number;
}
export interface AgentProfile {
    id: string;
    did: string;
    name: string;
    description: string;
    version: string;
    capabilities: AgentCapability[];
    reputation: number;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}
export interface AgentRegistration {
    did: string;
    name: string;
    description: string;
    capabilities: Omit<AgentCapability, 'id'>[];
    metadata?: Record<string, any>;
}
export interface AgentQuery {
    capabilities?: string[];
    minReputation?: number;
    status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    metadata?: Record<string, any>;
    limit?: number;
    offset?: number;
}
export declare class AgentRegistry {
    private agents;
    private didManager;
    constructor(didManager: DIDManager);
    registerAgent(registration: AgentRegistration): Promise<AgentProfile>;
    updateAgent(agentId: string, updates: Partial<AgentProfile>): Promise<AgentProfile>;
    getAgent(agentId: string): Promise<AgentProfile | null>;
    getAgentByDID(did: string): Promise<AgentProfile | null>;
    searchAgents(query: AgentQuery): Promise<AgentProfile[]>;
    updateAgentReputation(agentId: string, reputationChange: number): Promise<void>;
    suspendAgent(agentId: string, reason: string): Promise<void>;
    activateAgent(agentId: string): Promise<void>;
    removeAgent(agentId: string): Promise<void>;
    getAgentCapabilities(agentId: string): Promise<AgentCapability[]>;
    addCapability(agentId: string, capability: Omit<AgentCapability, 'id'>): Promise<AgentCapability>;
    removeCapability(agentId: string, capabilityId: string): Promise<void>;
}
//# sourceMappingURL=agent-registry.d.ts.map