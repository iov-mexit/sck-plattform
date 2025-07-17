export interface ReputationScore {
    did: string;
    score: number;
    factors: Record<string, number>;
    lastUpdated: Date;
}
export declare class ReputationManager {
    private scores;
    getReputationScore(did: string): Promise<ReputationScore | null>;
    updateReputationScore(did: string, factors: Record<string, number>): Promise<ReputationScore>;
    calculateVotingPower(did: string): Promise<number>;
}
//# sourceMappingURL=reputation-manager.d.ts.map