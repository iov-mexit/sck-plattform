import { DigitalTwin, DigitalTwinMetadata, SkillProof, SkillAssessment, Task, TaskAssignment, RoleProgression } from '@sck/schema';
import { Skill, SkillProfile } from '../skills/skill-enum';
import { DIDManager } from '../did/did-manager';
import { CredentialManager } from '../credentials/credential-manager';
import { ZKPManager } from '../zkp/zkp-manager';
/**
 * Digital Twin Manager
 *
 * Handles the creation, management, and evolution of employee digital twins
 * with privacy-preserving skill certification and role progression.
 */
export declare class DigitalTwinManager {
    private didManager;
    private credentialManager;
    private zkpManager;
    private digitalTwins;
    private skillAssessments;
    private taskAssignments;
    constructor(didManager: DIDManager, credentialManager: CredentialManager, zkpManager: ZKPManager);
    /**
     * Create a new digital twin for an employee
     */
    createDigitalTwin(employeeDid: string, organizationId: string, initialSkills: Partial<SkillProfile>, metadata: Omit<DigitalTwinMetadata, 'role' | 'level'>): Promise<DigitalTwin>;
    /**
     * Get digital twin by ID
     */
    getDigitalTwin(twinId: string): Promise<DigitalTwin | null>;
    /**
     * Get digital twin by employee DID
     */
    getDigitalTwinByEmployee(employeeDid: string): Promise<DigitalTwin | null>;
    /**
     * Update digital twin skills with ZK certification
     */
    updateSkills(twinId: string, skillUpdates: Partial<SkillProfile>, skillProofs: SkillProof[]): Promise<DigitalTwin>;
    /**
     * Create skill assessment (privacy-preserving)
     */
    createSkillAssessment(employeeDid: string, skillType: Skill, assessmentData: unknown, score: number): Promise<SkillAssessment>;
    /**
     * Verify skill assessment and generate ZK proof
     */
    verifySkillAssessment(assessmentId: string, employeeDid: string): Promise<SkillProof>;
    /**
     * Assign task to employee based on skills
     */
    assignTask(task: Task, employeeDid: string, assignedBy: string): Promise<TaskAssignment>;
    /**
     * Process role progression based on completed tasks and skill evolution
     */
    processRoleProgression(employeeDid: string, completedTasks: TaskAssignment[]): Promise<RoleProgression | null>;
    /**
     * Get organization skill map (aggregate data only)
     */
    getOrganizationSkillMap(organizationId: string): Promise<{
        organizationId: string;
        totalEmployees: number;
        skillStatistics: Record<string, {
            total: number;
            count: number;
            average: number;
        }>;
        lastUpdated: string;
    }>;
    /**
     * Private helper methods
     */
    private hashAssessmentData;
    private analyzeSkillEvolution;
    private determineNewRole;
}
//# sourceMappingURL=digital-twin-manager.d.ts.map