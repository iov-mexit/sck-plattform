export interface SkillRouter {
    route(skill: string, context: any): string;
    getAvailableSkills(): string[];
}
export declare class DefaultSkillRouter implements SkillRouter {
    private skills;
    constructor();
    private initializeSkills;
    route(skill: string, context: any): string;
    getAvailableSkills(): string[];
}
//# sourceMappingURL=skill-router.d.ts.map