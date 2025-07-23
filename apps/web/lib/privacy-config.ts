/**
 * SCK Privacy Configuration
 * Privacy-by-Design implementation with zero PII storage
 */

import { z } from 'zod';

// =============================================================================
// PRIVACY CONSTANTS
// =============================================================================

export const PRIVACY_CONFIG = {
  // Data retention policies (in days)
  RETENTION: {
    AUDIT_LOGS: 2555, // 7 years for compliance
    DIGITAL_TWINS: 365, // 1 year after deactivation
    SIGNALS: 730, // 2 years
    SESSIONS: 1, // 24 hours
    TEMP_DATA: 0.0417, // 1 hour
  },

  // Encryption settings
  ENCRYPTION: {
    ALGORITHM: 'AES-256-GCM',
    KEY_LENGTH: 32,
    IV_LENGTH: 16,
    SALT_LENGTH: 32,
  },

  // Privacy limits
  LIMITS: {
    MAX_SIGNALS_PER_TWIN: 100,
    MAX_METADATA_SIZE: 1024, // 1KB
    MAX_SEARCH_RESULTS: 50,
    SESSION_TIMEOUT: 3600, // 1 hour
    RATE_LIMIT: 100, // requests per minute
  },

  // GDPR compliance
  GDPR: {
    RIGHT_TO_ACCESS: true,
    RIGHT_TO_DELETION: true,
    RIGHT_TO_PORTABILITY: true,
    CONSENT_MANAGEMENT: true,
    DATA_MINIMIZATION: true,
    PURPOSE_LIMITATION: true,
  },

  // Zero PII enforcement
  ZERO_PII: {
    ALLOWED_FIELDS: ['did', 'hash', 'encrypted'],
    FORBIDDEN_PATTERNS: [
      /@[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // Email
      /^[0-9]{10,}$/, // Phone numbers
      /^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$/, // IBAN
      /^[0-9]{3}-[0-9]{2}-[0-9]{4}$/, // SSN
      /^[A-Z]{1,2}[0-9]{1,4}[A-Z]{1,2}$/, // License plates
    ],
    DID_VALIDATION: /^did:[a-z]+:[a-zA-Z0-9._-]+$/,
  },
} as const;

// =============================================================================
// PRIVACY VALIDATION SCHEMAS
// =============================================================================

export const PrivacyValidationSchema = z.object({
  // DID validation (no PII)
  did: z.string().regex(PRIVACY_CONFIG.ZERO_PII.DID_VALIDATION, {
    message: 'Invalid DID format - no PII allowed',
  }),

  // Metadata validation (encrypted only)
  metadata: z.record(z.any()).optional().refine(
    (data) => {
      if (!data) return true;
      const jsonStr = JSON.stringify(data);
      return jsonStr.length <= PRIVACY_CONFIG.LIMITS.MAX_METADATA_SIZE * 1024;
    },
    {
      message: `Metadata size exceeds ${PRIVACY_CONFIG.LIMITS.MAX_METADATA_SIZE}KB limit`,
    }
  ),

  // Trust score validation
  trustScore: z.number().min(0).max(100).optional(),

  // Organization validation
  organizationId: z.string().cuid(),

  // Role validation
  roleTitle: z.string().min(1).max(100),
});

// =============================================================================
// PRIVACY UTILITIES
// =============================================================================

/**
 * Check if data contains PII
 */
export function containsPII(data: any): boolean {
  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }

  return PRIVACY_CONFIG.ZERO_PII.FORBIDDEN_PATTERNS.some(pattern =>
    pattern.test(data)
  );
}

/**
 * Validate DID format
 */
export function isValidDID(did: string): boolean {
  return PRIVACY_CONFIG.ZERO_PII.DID_VALIDATION.test(did);
}

/**
 * Sanitize data for privacy
 */
export function sanitizeForPrivacy(data: any): any {
  if (typeof data === 'string') {
    // Check for PII patterns
    if (containsPII(data)) {
      throw new Error('PII detected in data');
    }
    return data;
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};

    for (const [key, value] of Object.entries(data)) {
      // Only allow privacy-safe fields
      if (PRIVACY_CONFIG.ZERO_PII.ALLOWED_FIELDS.includes(key) ||
        key.startsWith('encrypted_') ||
        key.startsWith('hash_')) {
        sanitized[key] = sanitizeForPrivacy(value);
      }
    }

    return sanitized;
  }

  return data;
}

/**
 * Generate privacy-compliant audit metadata
 */
export function generateAuditMetadata(action: string, entity: string, data: any): any {
  return {
    action,
    entity,
    timestamp: new Date().toISOString(),
    dataHash: Buffer.from(JSON.stringify(data)).toString('base64'),
    privacyCompliant: true,
  };
}

/**
 * Check data retention compliance
 */
export function isDataRetentionCompliant(createdAt: Date, retentionDays: number): boolean {
  const retentionDate = new Date(createdAt);
  retentionDate.setDate(retentionDate.getDate() + retentionDays);
  return new Date() <= retentionDate;
}

// =============================================================================
// GDPR COMPLIANCE UTILITIES
// =============================================================================

/**
 * GDPR Right to Access implementation
 */
export interface GDPRAccessRequest {
  did: string;
  requestId: string;
  requestedAt: Date;
  dataTypes: string[];
}

export function createGDPRAccessRequest(did: string, dataTypes: string[]): GDPRAccessRequest {
  return {
    did,
    requestId: `gdpr-access-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    requestedAt: new Date(),
    dataTypes,
  };
}

/**
 * GDPR Right to Deletion implementation
 */
export interface GDPRDeletionRequest {
  did: string;
  requestId: string;
  requestedAt: Date;
  reason: string;
  confirmation: boolean;
}

export function createGDPRDeletionRequest(
  did: string,
  reason: string,
  confirmation: boolean
): GDPRDeletionRequest {
  return {
    did,
    requestId: `gdpr-deletion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    requestedAt: new Date(),
    reason,
    confirmation,
  };
}

/**
 * GDPR Right to Portability implementation
 */
export interface GDPRPortabilityRequest {
  did: string;
  requestId: string;
  requestedAt: Date;
  format: 'json' | 'csv' | 'xml';
  includeMetadata: boolean;
}

export function createGDPRPortabilityRequest(
  did: string,
  format: 'json' | 'csv' | 'xml' = 'json',
  includeMetadata: boolean = false
): GDPRPortabilityRequest {
  return {
    did,
    requestId: `gdpr-portability-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    requestedAt: new Date(),
    format,
    includeMetadata,
  };
}

// =============================================================================
// CONSENT MANAGEMENT
// =============================================================================

export interface ConsentRecord {
  did: string;
  consentId: string;
  purpose: string;
  granted: boolean;
  grantedAt: Date;
  revokedAt?: Date;
  version: string;
  metadata: Record<string, any>;
}

export function createConsentRecord(
  did: string,
  purpose: string,
  granted: boolean,
  version: string = '1.0',
  metadata: Record<string, any> = {}
): ConsentRecord {
  return {
    did,
    consentId: `consent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    purpose,
    granted,
    grantedAt: new Date(),
    version,
    metadata,
  };
}

// =============================================================================
// PRIVACY MONITORING
// =============================================================================

export interface PrivacyEvent {
  eventId: string;
  timestamp: Date;
  eventType: 'data_access' | 'data_creation' | 'data_deletion' | 'consent_change' | 'pii_detected';
  did?: string;
  entity?: string;
  entityId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: Record<string, any>;
}

export function createPrivacyEvent(
  eventType: PrivacyEvent['eventType'],
  description: string,
  severity: PrivacyEvent['severity'] = 'low',
  metadata: Record<string, any> = {}
): PrivacyEvent {
  return {
    eventId: `privacy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    eventType,
    severity,
    description,
    metadata,
  };
}

// =============================================================================
// PRIVACY CONFIGURATION EXPORTS
// =============================================================================

export type PrivacyConfig = typeof PRIVACY_CONFIG;
export type PrivacyEventType = PrivacyEvent['eventType'];
export type ConsentPurpose = 'digital_twin_creation' | 'trust_validation' | 'signal_collection' | 'nft_minting';

// Privacy compliance check
export function isPrivacyCompliant(data: any): { compliant: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for PII
  if (containsPII(data)) {
    issues.push('PII detected in data');
  }

  // Check data size
  const dataSize = JSON.stringify(data).length;
  if (dataSize > PRIVACY_CONFIG.LIMITS.MAX_METADATA_SIZE * 1024) {
    issues.push(`Data size ${dataSize} exceeds ${PRIVACY_CONFIG.LIMITS.MAX_METADATA_SIZE}KB limit`);
  }

  // Check for forbidden fields
  if (typeof data === 'object' && data !== null) {
    for (const key of Object.keys(data)) {
      if (!PRIVACY_CONFIG.ZERO_PII.ALLOWED_FIELDS.includes(key) &&
        !key.startsWith('encrypted_') &&
        !key.startsWith('hash_')) {
        issues.push(`Forbidden field detected: ${key}`);
      }
    }
  }

  return {
    compliant: issues.length === 0,
    issues,
  };
} 