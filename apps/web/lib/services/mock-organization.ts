import { Organization } from '@/lib/auth/auth-types';

// Mock organization data for testing
const mockOrganizations: Record<string, Organization> = {
  'securecorp.com': {
    id: 'org_1',
    name: 'SecureCorp',
    description: 'Cybersecurity consulting firm',
    domain: 'securecorp.com',
    isActive: true,
    onboardingComplete: false, // New organization - needs onboarding
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  'acme.com': {
    id: 'org_2',
    name: 'Acme Corporation',
    description: 'Technology company',
    domain: 'acme.com',
    isActive: true,
    onboardingComplete: true, // Existing organization - onboarding complete
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
};

export const mockOrganizationService = {
  async getByDomain(domain: string): Promise<Organization | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return mockOrganizations[domain] || null;
  },

  async updateOnboarding(domain: string, onboardingComplete: boolean): Promise<Organization> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!mockOrganizations[domain]) {
      throw new Error('Organization not found');
    }

    mockOrganizations[domain].onboardingComplete = onboardingComplete;
    mockOrganizations[domain].updatedAt = new Date();

    return mockOrganizations[domain];
  },
}; 