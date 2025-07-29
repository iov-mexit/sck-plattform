import { Organization } from '@/lib/auth/auth-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export interface OrganizationService {
  getByDomain(domain: string): Promise<Organization | undefined>;
  updateOnboarding(domain: string, onboardingComplete: boolean): Promise<Organization>;
}

class OrganizationServiceImpl implements OrganizationService {
  async getByDomain(domain: string): Promise<Organization | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/organizations?domain=${encodeURIComponent(domain)}`);
      if (!response.ok) {
        if (response.status === 404) {
          return undefined;
        }
        throw new Error(`Failed to fetch organization: ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch organization');
      }
      return result.data;
    } catch (error) {
      console.error('Error fetching organization:', error);
      return undefined;
    }
  }

  async updateOnboarding(domain: string, onboardingComplete: boolean): Promise<Organization> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/organizations`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          onboardingComplete,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update organization: ${response.statusText}`);
      }
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to update organization');
      }
      return result.data;
    } catch (error) {
      console.error('Error updating organization onboarding:', error);
      throw error;
    }
  }
}

export const organizationService = new OrganizationServiceImpl(); 