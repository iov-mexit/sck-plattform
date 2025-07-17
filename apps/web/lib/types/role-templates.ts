// Type definitions for the enhanced role template system

export type SecurityContribution = {
  title: string;
  bullets: string[];
};

export type RoleTemplate = {
  id: string;
  title: string;
  focus: string;
  responsibilities: string[];
  securityContributions: SecurityContribution[];
  category: 'Product' | 'Design' | 'QA' | 'Architecture' | 'Solution Design';
  selectable: boolean; // curated vs. custom
};

// Category-specific role types for better type safety
export type ProductRole = RoleTemplate & {
  category: 'Product';
};

export type ArchitectureRole = RoleTemplate & {
  category: 'Architecture';
};

export type QARole = RoleTemplate & {
  category: 'QA';
};

export type SolutionDesignRole = RoleTemplate & {
  category: 'Solution Design';
};

export type DesignRole = RoleTemplate & {
  category: 'Design';
};

// Utility types for filtering and grouping
export type RoleCategory = RoleTemplate['category'];

export type CuratedRole = RoleTemplate & {
  selectable: true;
};

export type CustomRole = RoleTemplate & {
  selectable: false;
};

// API response types
export type RoleTemplateResponse = {
  success: boolean;
  data: RoleTemplate[];
};

export type CreateRoleTemplateRequest = Omit<RoleTemplate, 'id' | 'createdAt' | 'updatedAt'>;

// Validation schemas (for use with Zod)
export const SecurityContributionSchema = {
  title: 'string',
  bullets: 'string[]',
} as const;

export const RoleTemplateSchema = {
  id: 'string',
  title: 'string',
  focus: 'string',
  responsibilities: 'string[]',
  securityContributions: 'SecurityContribution[]',
  category: "'Product' | 'Design' | 'QA' | 'Architecture' | 'Solution Design'",
  selectable: 'boolean',
} as const; 