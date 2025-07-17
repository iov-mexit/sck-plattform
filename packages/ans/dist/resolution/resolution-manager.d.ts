export interface AgentResolution {
    did: string;
    name: string;
    capabilities: string[];
    status: 'RESOLVED' | 'NOT_FOUND';
    metadata?: Record<string, any>;
}
export declare class ResolutionManager {
    private resolutions;
    resolveAgent(name: string): Promise<AgentResolution | null>;
    registerResolution(name: string, resolution: AgentResolution): Promise<void>;
    listResolutions(): Promise<AgentResolution[]>;
}
//# sourceMappingURL=resolution-manager.d.ts.map