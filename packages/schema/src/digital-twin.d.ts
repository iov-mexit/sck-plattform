import { Skill } from '@sck/identity';
/**
 * Digital Twin Schema for Privacy-Driven Skill-Based Routing
 *
 * This represents an employee's digital twin with ZK-certified skills
 * that enables privacy-preserving task assignment and role development.
 */
export interface DigitalTwin {
    id: string;
    ownerDID: string;
    organizationId: string;
    role: string;
    department: string;
    certifications: Certification[];
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface Certification {
    issuer: address;
    name: string;
    proofHash: string;
    timestamp: number;
    metadata?: Record<string, any>;
}
export interface DigitalTwinMetadata {
    name: string;
    description: string;
    image: string;
    attributes: DigitalTwinAttribute[];
}
export interface DigitalTwinAttribute {
    trait_type: string;
    value: string | number;
    display_type?: string;
}
export interface DigitalTwinCreateRequest {
    ownerDID: string;
    organizationId: string;
    role: string;
    department: string;
    metadata?: Record<string, any>;
}
export interface DigitalTwinUpdateRequest {
    role?: string;
    department?: string;
    metadata?: Record<string, any>;
}
export interface CertificationAddRequest {
    tokenId: string;
    certification: Certification;
}
export interface Task {
    id: string;
    title: string;
    description: string;
    requiredSkills: Skill[];
    skillLevels: Record<Skill, number>;
    priority: TaskPriority;
    estimatedDuration: number;
    department: string;
    projectId?: string;
    assignedTo?: string;
    status: TaskStatus;
    createdAt: string;
    deadline?: string;
    tags?: string[];
}
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export interface SkillProof {
    proof: string;
    publicInputs: string[];
    verificationKey: string;
    issuedAt: string;
    expiresAt?: string;
    issuer: string;
    skillHash: string;
    skillType: Skill;
    level: number;
    verified: boolean;
}
export interface SkillAssessment {
    id: string;
    employeeDid: string;
    skillType: Skill;
    assessmentData: unknown;
    assessmentHash: string;
    score: number;
    level: number;
    verified: boolean;
    proof?: SkillProof;
    createdAt: string;
    expiresAt?: string;
    issuerDid?: string;
}
export interface TaskAssignment {
    id: string;
    taskId: string;
    employeeDid: string;
    assignedAt: string;
    assignedBy: string;
    skillMatch: Record<Skill, number>;
    expectedCompletion: string;
    actualCompletion?: string;
    performanceScore?: number;
    feedback?: string;
}
export interface RoleProgression {
    id: string;
    employeeDid: string;
    fromRole: string;
    toRole: string;
    triggeredBy: Skill[];
    skillProofs: SkillProof[];
    approvedAt: string;
    approvedBy: string;
    effectiveDate: string;
}
export interface OrganizationSkillMap {
    organizationId: string;
    department: string;
    skillGaps: {
        skill: Skill;
        currentLevel: number;
        requiredLevel: number;
        gap: number;
        affectedRoles: string[];
    }[];
    skillStrengths: {
        skill: Skill;
        averageLevel: number;
        employeeCount: number;
        roles: string[];
    }[];
    lastUpdated: string;
}
export declare const DigitalTwinSchema: {
    readonly type: "object";
    readonly properties: {
        readonly id: {
            readonly type: "string";
        };
        readonly employeeDid: {
            readonly type: "string";
            readonly pattern: "^did:";
        };
        readonly organizationId: {
            readonly type: "string";
        };
        readonly skills: {
            readonly type: "object";
        };
        readonly createdAt: {
            readonly type: "string";
            readonly format: "date-time";
        };
        readonly updatedAt: {
            readonly type: "string";
            readonly format: "date-time";
        };
        readonly metadata: {
            readonly type: "object";
        };
    };
    readonly required: readonly ["id", "employeeDid", "organizationId", "skills", "createdAt", "updatedAt", "metadata"];
};
export declare const TaskSchema: {
    readonly type: "object";
    readonly properties: {
        readonly id: {
            readonly type: "string";
        };
        readonly title: {
            readonly type: "string";
        };
        readonly description: {
            readonly type: "string";
        };
        readonly requiredSkills: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
        };
        readonly skillLevels: {
            readonly type: "object";
        };
        readonly priority: {
            readonly type: "string";
            readonly enum: readonly ["LOW", "MEDIUM", "HIGH", "URGENT"];
        };
        readonly estimatedDuration: {
            readonly type: "number";
            readonly minimum: 0;
        };
        readonly department: {
            readonly type: "string";
        };
        readonly projectId: {
            readonly type: "string";
        };
        readonly assignedTo: {
            readonly type: "string";
        };
        readonly status: {
            readonly type: "string";
            readonly enum: readonly ["OPEN", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
        };
        readonly createdAt: {
            readonly type: "string";
            readonly format: "date-time";
        };
        readonly deadline: {
            readonly type: "string";
            readonly format: "date-time";
        };
        readonly tags: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
        };
    };
    readonly required: readonly ["id", "title", "description", "requiredSkills", "skillLevels", "priority", "estimatedDuration", "department", "status", "createdAt"];
};
//# sourceMappingURL=digital-twin.d.ts.map