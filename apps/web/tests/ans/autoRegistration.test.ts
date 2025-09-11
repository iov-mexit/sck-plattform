/**
 * ANS Auto-Registration Tests
 * 
 * Tests the automatic registration of role agents to the ANS Registry
 * with proper error handling, retry logic, and status tracking.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import { AnsService } from '@/lib/ans/service';
import prisma from '@/lib/database';
import * as Domains from '@/lib/domains';

// Mock the domain configuration for testing
vi.mock('@/lib/domains', async (orig) => {
  const actual = await (orig as any)();
  return {
    ...actual,
    getDomainConfig: vi.fn(() => ({
      autoRegisterANS: true,
      ansRegistry: 'https://knaight.site',
      isDevelopment: true
    })),
    buildANSRegistrationPayload: vi.fn((agent: any) => ({
      ansId: `l${agent.level}-${agent.roleTemplate.title.toLowerCase().replace(/\s+/g, '-')}.${agent.organization.domain}.knaight`,
      did: agent.assignedToDid,
      role: agent.roleTemplate.title,
      level: agent.level,
      qualificationLevel: 'Entry',
      organization: agent.organization.name,
      trustLevel: 'UNVERIFIED',
      verificationEndpoint: `https://localhost:3000/api/v1/verify/${agent.id}`,
      publicMetadata: {
        role: agent.roleTemplate.title,
        level: agent.level,
        qualificationLevel: 'Entry',
        organization: agent.organization.name,
        trustScore: agent.trustScore || 0,
        lastUpdated: new Date().toISOString()
      }
    })),
    registerToANS: vi.fn()
  };
});

const dbIt = process.env.DATABASE_URL ? it : it.skip;

describe('ANS Auto-Registration', () => {
  let testOrganization: any;
  let testRoleTemplate: any;

  beforeAll(async () => {
    // Clean up test data
    await prisma.roleAgent.deleteMany();
    await prisma.roleTemplate.deleteMany();
    await prisma.organization.deleteMany();

    // Create test organization
    testOrganization = await prisma.organization.create({
      data: {
        id: 'org-test-ans-123',
        name: 'Test Organization',
        domain: 'testorg',
        description: 'Test organization for ANS testing'
      }
    });

    // Create test role template
    testRoleTemplate = await prisma.roleTemplate.create({
      data: {
        id: 'role-test-ans-123',
        title: 'Security Engineer',
        focus: 'Security',
        category: 'Security',
        responsibilities: { items: ['Security analysis'] } as any,
        securityContributions: { items: [] } as any,
      }
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.roleAgent.deleteMany();
    await prisma.roleTemplate.deleteMany();
    await prisma.organization.deleteMany();
  });

  beforeEach(async () => {
    // Clean up role agents before each test
    await prisma.roleAgent.deleteMany();
  });

  dbIt('should register a new role agent with ANS successfully', async () => {
    // Mock successful ANS registration
    const mockRegisterToANS = vi.mocked(Domains).registerToANS as unknown as { mockResolvedValueOnce: (v: any) => void };
    mockRegisterToANS.mockResolvedValueOnce({
      success: true,
      ansId: 'l1-security-engineer.testorg.knaight',
      correlationId: 'test-correlation-123'
    });

    // Create role agent
    const roleAgent = await prisma.roleAgent.create({
      data: {
        id: 'agent-test-ans-123',
        name: 'L1 Security Engineer',
        organizationId: testOrganization.id,
        roleTemplateId: testRoleTemplate.id,
        assignedToDid: 'did:web:testorg:agent-test-ans-123',
        trustScore: 100,
        level: 1
      }
    });

    // Register with ANS
    const result = await AnsService.registerAgent(roleAgent.id);

    expect(result.success).toBe(true);
    expect(result.ansId).toBe('l1-security-engineer.testorg.knaight');
    expect(result.correlationId).toBe('test-correlation-123');

    // Verify database update
    const updatedAgent = await prisma.roleAgent.findUnique({
      where: { id: roleAgent.id }
    });

    expect(updatedAgent?.ansIdentifier).toBe('l1-security-engineer.testorg.knaight');
    expect(updatedAgent?.ansRegistrationStatus).toBe('SYNCED');
    expect(updatedAgent?.ansVerificationUrl).toBe('https://knaight.site/api/v1/verify/l1-security-engineer.testorg.knaight');
  });

  dbIt('should handle ANS registration failure gracefully', async () => {
    // Mock failed ANS registration
    const mockRegisterToANS = vi.mocked(Domains).registerToANS as unknown as { mockResolvedValueOnce: (v: any) => void };
    mockRegisterToANS.mockResolvedValueOnce({
      success: false,
      error: 'ANS Registry unavailable',
      correlationId: 'test-correlation-error-123'
    });

    // Create role agent
    const roleAgent = await prisma.roleAgent.create({
      data: {
        id: 'agent-test-ans-error-123',
        name: 'L2 Security Engineer',
        organizationId: testOrganization.id,
        roleTemplateId: testRoleTemplate.id,
        assignedToDid: 'did:web:testorg:agent-test-ans-error-123',
        trustScore: 300,
        level: 2
      }
    });

    // Attempt registration with ANS
    const result = await AnsService.registerAgent(roleAgent.id);

    expect(result.success).toBe(false);
    expect(result.error).toBe('ANS Registry unavailable');
    expect(result.correlationId).toBe('test-correlation-error-123');

    // Verify database update with error status
    const updatedAgent = await prisma.roleAgent.findUnique({
      where: { id: roleAgent.id }
    });

    expect(updatedAgent?.ansRegistrationStatus).toBe('ERROR');
    expect(updatedAgent?.ansRegistrationError).toBe('ANS Registry unavailable');
  });

  dbIt('should skip registration if ANS auto-registration is disabled', async () => {
    // Mock disabled ANS registration
    const mockGetDomainConfig = vi.mocked(Domains).getDomainConfig as unknown as { mockReturnValueOnce: (v: any) => void };
    mockGetDomainConfig.mockReturnValueOnce({
      autoRegisterANS: false,
      ansRegistry: 'https://knaight.site',
      isDevelopment: true
    });

    // Create role agent
    const roleAgent = await prisma.roleAgent.create({
      data: {
        id: 'agent-test-ans-disabled-123',
        name: 'L3 Security Engineer',
        organizationId: testOrganization.id,
        roleTemplateId: testRoleTemplate.id,
        assignedToDid: 'did:web:testorg:agent-test-ans-disabled-123',
        trustScore: 600,
        level: 3
      }
    });

    // Attempt registration with ANS
    const result = await AnsService.registerAgent(roleAgent.id);

    expect(result.success).toBe(false);
    expect(result.error).toBe('ANS auto-registration disabled for this domain');

    // Verify database remains unchanged
    const updatedAgent = await prisma.roleAgent.findUnique({
      where: { id: roleAgent.id }
    });

    expect(updatedAgent?.ansRegistrationStatus).toBe('PENDING'); // Default status
    expect(updatedAgent?.ansIdentifier).toBeNull();
  });

  dbIt('should skip registration if role agent is already synced', async () => {
    // Create role agent with existing ANS registration
    const roleAgent = await prisma.roleAgent.create({
      data: {
        id: 'agent-test-ans-already-synced-123',
        name: 'L4 Security Engineer',
        organizationId: testOrganization.id,
        roleTemplateId: testRoleTemplate.id,
        assignedToDid: 'did:web:testorg:agent-test-ans-already-synced-123',
        trustScore: 800,
        level: 4,
        ansIdentifier: 'l4-security-engineer.testorg.knaight',
        ansRegistrationStatus: 'SYNCED',
        ansVerificationUrl: 'https://knaight.site/api/v1/verify/l4-security-engineer.testorg.knaight'
      }
    });

    // Attempt registration with ANS
    const result = await AnsService.registerAgent(roleAgent.id);

    expect(result.success).toBe(true);
    expect(result.ansId).toBe('l4-security-engineer.testorg.knaight');
    expect(result.correlationId).toContain('already-synced');
  });

  dbIt('should get ANS registration statistics', async () => {
    // Create test role agents with different statuses
    await prisma.roleAgent.createMany({
      data: [
        {
          id: 'agent-stats-synced-1',
          name: 'L1 Agent 1',
          organizationId: testOrganization.id,
          roleTemplateId: testRoleTemplate.id,
          assignedToDid: 'did:web:testorg:agent-stats-synced-1',
          trustScore: 100,
          level: 1,
          ansRegistrationStatus: 'SYNCED'
        },
        {
          id: 'agent-stats-synced-2',
          name: 'L2 Agent 2',
          organizationId: testOrganization.id,
          roleTemplateId: testRoleTemplate.id,
          assignedToDid: 'did:web:testorg:agent-stats-synced-2',
          trustScore: 300,
          level: 2,
          ansRegistrationStatus: 'SYNCED'
        },
        {
          id: 'agent-stats-pending-1',
          name: 'L3 Agent 3',
          organizationId: testOrganization.id,
          roleTemplateId: testRoleTemplate.id,
          assignedToDid: 'did:web:testorg:agent-stats-pending-1',
          trustScore: 600,
          level: 3,
          ansRegistrationStatus: 'PENDING'
        },
        {
          id: 'agent-stats-error-1',
          name: 'L4 Agent 4',
          organizationId: testOrganization.id,
          roleTemplateId: testRoleTemplate.id,
          assignedToDid: 'did:web:testorg:agent-stats-error-1',
          trustScore: 800,
          level: 4,
          ansRegistrationStatus: 'ERROR'
        }
      ]
    });

    // Get statistics
    const stats = await AnsService.getRegistrationStats();

    expect(stats.total).toBe(4);
    expect(stats.synced).toBe(2);
    expect(stats.pending).toBe(1);
    expect(stats.error).toBe(1);
    expect(stats.syncRate).toBe(50); // 2/4 * 100
  });

  dbIt('should retry failed ANS registrations', async () => {
    // Create role agents with error status
    await prisma.roleAgent.createMany({
      data: [
        {
          id: 'agent-retry-error-1',
          name: 'L1 Retry Agent 1',
          organizationId: testOrganization.id,
          roleTemplateId: testRoleTemplate.id,
          assignedToDid: 'did:web:testorg:agent-retry-error-1',
          trustScore: 100,
          level: 1,
          ansRegistrationStatus: 'ERROR',
          ansRegistrationError: 'Network timeout'
        },
        {
          id: 'agent-retry-error-2',
          name: 'L2 Retry Agent 2',
          organizationId: testOrganization.id,
          roleTemplateId: testRoleTemplate.id,
          assignedToDid: 'did:web:testorg:agent-retry-error-2',
          trustScore: 300,
          level: 2,
          ansRegistrationStatus: 'ERROR',
          ansRegistrationError: 'Service unavailable'
        }
      ]
    });

    // Mock successful retry
    const mockRegisterToANS = vi.mocked(Domains).registerToANS as unknown as { mockResolvedValue: (v: any) => void };
    mockRegisterToANS.mockResolvedValue({
      success: true,
      ansId: 'retry-success',
      correlationId: 'retry-correlation'
    });

    // Retry failed registrations
    const retryCount = await AnsService.retryFailedRegistrations();

    expect(retryCount).toBe(2);
  });
});
