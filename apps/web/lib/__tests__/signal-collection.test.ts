import { signalCollection, SignalSchema, MetadataSchema } from '../signal-collection';
import { prisma } from '../database';

// Mock Prisma for testing (Vitest compatible)
vi.mock('../database', () => {
  const mock = {
    prisma: {
      roleAgent: { findUnique: vi.fn() },
      signal: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
      },
      auditLog: { create: vi.fn() },
    },
  } as any;
  return { ...mock, default: mock.prisma };
});

describe('Signal Collection System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Signal Schema Validation', () => {
    it('should validate certification signal with proper metadata', () => {
      const certificationSignal = {
        type: 'certification' as const,
        title: 'CISSP Certification',
        description: 'Certified Information Systems Security Professional',
        value: 100,
        source: 'certification_provider' as const,
        verified: true,
        roleAgentId: 'ra-123',
        metadata: {
          type: 'certification' as const,
          credentialId: 'CISSP-12345',
          issuerUrl: 'https://www.isc2.org',
          expirationDate: '2025-12-31',
          credentialLevel: 'Professional'
        }
      };

      const result = SignalSchema.safeParse(certificationSignal);
      expect(result.success).toBe(true);
    });

    it('should validate activity signal with proper metadata', () => {
      const activitySignal = {
        type: 'activity' as const,
        title: 'Security Code Review',
        description: 'Reviewed authentication module for vulnerabilities',
        value: 50,
        source: 'manual' as const,
        verified: false,
        roleAgentId: 'ra-123',
        metadata: {
          type: 'activity' as const,
          duration: 120, // 2 hours
          complexity: 'high' as const,
          impact: 'medium' as const,
          tools: ['SonarQube', 'OWASP ZAP'],
          relatedIncidents: ['INC-2024-001']
        }
      };

      const result = SignalSchema.safeParse(activitySignal);
      expect(result.success).toBe(true);
    });

    it('should reject signal with invalid metadata type', () => {
      const invalidSignal = {
        type: 'certification' as const,
        title: 'Test Certification',
        source: 'manual' as const,
        roleAgentId: 'ra-123',
        metadata: {
          type: 'activity' as const, // Wrong type for certification
          duration: 60
        }
      };

      const result = SignalSchema.safeParse(invalidSignal);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
      }
    });

    it('should validate all signal types', () => {
      const signalTypes = [
        'certification',
        'activity',
        'achievement',
        'security_incident',
        'training',
        'audit',
        'compliance',
        'collaboration'
      ] as const;

      signalTypes.forEach(type => {
        const base: any = {
          type,
          title: `Test ${type} signal`,
          source: 'manual' as const,
          roleAgentId: 'ra-123',
        };
        const meta: any = { type };
        if (type === 'certification') meta.credentialId = 'ID-1';
        if (type === 'activity') meta.duration = 1;
        if (type === 'security_incident') meta.severity = 'low';
        if (type === 'audit') meta.auditType = 'internal';
        const signal = { ...base, metadata: meta };

        const result = SignalSchema.safeParse(signal);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('Metadata Schema Validation', () => {
    it('should validate certification metadata', () => {
      const metadata = {
        type: 'certification' as const,
        credentialId: 'AWS-SEC-12345',
        issuerUrl: 'https://aws.amazon.com',
        expirationDate: '2025-06-30',
        credentialLevel: 'Professional'
      };

      const result = MetadataSchema.safeParse(metadata);
      expect(result.success).toBe(true);
    });

    it('should validate security incident metadata', () => {
      const metadata = {
        type: 'security_incident' as const,
        severity: 'high' as const,
        incidentType: 'Data Breach',
        resolutionTime: 240, // 4 hours
        affectedSystems: ['user-database', 'auth-service']
      };

      const result = MetadataSchema.safeParse(metadata);
      expect(result.success).toBe(true);
    });

    it('should validate audit metadata', () => {
      const metadata = {
        type: 'audit' as const,
        auditType: 'Penetration Test',
        findings: 5,
        criticalIssues: 1,
        complianceScore: 85,
        auditor: 'Security Team'
      };

      const result = MetadataSchema.safeParse(metadata);
      expect(result.success).toBe(true);
    });
  });

  describe('Signal Collection Service', () => {
    const mockDigitalTwin = {
      id: 'ra-123',
      name: 'Test Twin',
      organizationId: 'org-123',
      roleTemplateId: 'role-123'
    };

    const mockSignal = {
      id: 'signal-123',
      type: 'certification',
      title: 'Test Certification',
      verified: true,
      createdAt: new Date(),
      metadata: JSON.stringify({
        type: 'certification',
        credentialId: 'TEST-123'
      })
    };

    beforeEach(() => {
      (prisma.roleAgent.findUnique as any).mockResolvedValue(mockDigitalTwin);
      (prisma.signal.create as any).mockResolvedValue(mockSignal);
      (prisma.signal.count as any).mockResolvedValue(0);
      (prisma.auditLog.create as any).mockResolvedValue({});
    });

    it('should create signal with proper metadata serialization', async () => {
      const signalData = {
        type: 'certification' as const,
        title: 'Test Certification',
        source: 'manual' as const,
        roleAgentId: 'ra-123',
        metadata: {
          type: 'certification' as const,
          credentialId: 'TEST-123'
        }
      };

      await signalCollection.createSignal(signalData);

      expect(prisma.signal.create).toHaveBeenCalledWith({
        data: {
          type: 'certification',
          title: 'Test Certification',
          description: undefined,
          value: undefined,
          source: 'manual',
          verified: false,
          metadata: JSON.stringify({
            type: 'certification',
            credentialId: 'TEST-123'
          }),
          roleAgentId: 'ra-123',
          externalId: undefined,
        },
        include: {
          roleAgent: {
            include: {
              organization: true,
              roleTemplate: true
            }
          }
        }
      });
    });

    it('should enforce rate limiting', async () => {
      (prisma.signal.count as any).mockResolvedValue(101); // Over limit

      const signalData = {
        type: 'certification' as const,
        title: 'Test Certification',
        source: 'manual' as const,
        roleAgentId: 'ra-123'
      };

      await expect(signalCollection.createSignal(signalData)).rejects.toThrow(
        'Rate limit exceeded: Too many signals created in the last minute'
      );
    });

    it('should skip rate limiting for bulk operations', async () => {
      (prisma.signal.count as any).mockResolvedValue(101); // Over limit

      const signalData = {
        type: 'certification' as const,
        title: 'Test Certification',
        source: 'manual' as const,
        roleAgentId: 'ra-123'
      };

      // Should not throw when skipRateLimit is true
      await expect((signalCollection.createSignal as any)(signalData, { skipRateLimit: true })).resolves.toBeDefined();
    });

    it('should verify signal with metadata preservation', async () => {
      (prisma.signal.findUnique as any).mockResolvedValue(mockSignal as any);
      (prisma.signal.update as any).mockResolvedValue({ ...mockSignal, verified: true } as any);

      const result = await signalCollection.verifySignal('signal-123', {
        verified: true,
        verificationNotes: 'Verified by team lead',
        verificationMethod: 'manual_review'
      });

      expect(result).toBeDefined();
      expect(result.verified).toBe(true);

      // Verify the update was called with correct data structure
      expect(prisma.signal.update).toHaveBeenCalledWith({
        where: { id: 'signal-123' },
        data: {
          verified: true,
          metadata: expect.stringContaining('"verificationNotes":"Verified by team lead"')
        },
        include: {
          roleAgent: {
            include: {
              organization: true,
              roleTemplate: true
            }
          }
        }
      });
    });

    it('should return structured errors in bulk import', async () => {
      const signals = [
        {
          type: 'certification' as const,
          title: 'Valid Signal',
          source: 'manual' as const,
          digitalTwinId: 'dt-123'
        },
        {
          type: 'certification' as const,
          title: 'Invalid Signal',
          source: 'manual' as const,
          digitalTwinId: 'invalid-id' // This will cause an error
        }
      ];

      (prisma.roleAgent.findUnique as any)
        .mockResolvedValueOnce(mockDigitalTwin) // First call succeeds
        .mockResolvedValueOnce(null); // Second call fails

      const result = await (signalCollection.bulkImportSignals as any)(signals);

      expect(result.success).toBe(1);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toEqual({
        signal: signals[1],
        message: 'Digital twin not found: invalid-id'
      });
    });
  });

  describe('Signal Retrieval with Metadata Parsing', () => {
    const mockSignals = [
      {
        id: 'signal-1',
        type: 'certification',
        title: 'Test Cert 1',
        metadata: JSON.stringify({
          type: 'certification',
          credentialId: 'CERT-1'
        })
      },
      {
        id: 'signal-2',
        type: 'activity',
        title: 'Test Activity',
        metadata: JSON.stringify({
          type: 'activity',
          duration: 60
        })
      }
    ];

    beforeEach(() => {
      (prisma.signal.findMany as any).mockResolvedValue(mockSignals);
    });

    it('should parse metadata when retrieving signals', async () => {
      const signals = await signalCollection.getSignalsByRoleAgent('ra-123');

      expect(signals).toHaveLength(2);
      expect(signals[0].metadata).toEqual({
        type: 'certification',
        credentialId: 'CERT-1'
      });
      expect(signals[1].metadata).toEqual({
        type: 'activity',
        duration: 60
      });
    });

    it('should handle signals without metadata', async () => {
      const signalsWithoutMetadata = [
        {
          id: 'signal-3',
          type: 'certification',
          title: 'Test Cert 3',
          metadata: null
        }
      ];

      (prisma.signal.findMany as any).mockResolvedValue(signalsWithoutMetadata);

      const signals = await signalCollection.getSignalsByRoleAgent('ra-123');

      expect(signals[0].metadata).toBeNull();
    });
  });
}); 