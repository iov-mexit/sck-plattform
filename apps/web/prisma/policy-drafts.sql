-- Policy Drafts Table Schema
-- This table stores policy drafts created from RAG search results for approval workflows

CREATE TABLE IF NOT EXISTS policy_drafts (
  id SERIAL PRIMARY KEY,
  framework TEXT NOT NULL,
  reference TEXT NOT NULL,
  source TEXT,
  highlights TEXT,
  query TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'draft')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_by TEXT,
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  organization_id TEXT,
  user_id TEXT
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_policy_drafts_status ON policy_drafts(status);
CREATE INDEX IF NOT EXISTS idx_policy_drafts_framework ON policy_drafts(framework);
CREATE INDEX IF NOT EXISTS idx_policy_drafts_created_at ON policy_drafts(created_at);
CREATE INDEX IF NOT EXISTS idx_policy_drafts_organization ON policy_drafts(organization_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_policy_drafts_updated_at 
    BEFORE UPDATE ON policy_drafts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE policy_drafts IS 'Stores policy drafts created from RAG search results for approval workflows';
COMMENT ON COLUMN policy_drafts.framework IS 'Regulatory framework (GDPR, EU AI Act, NIS2, NIST CSF, OWASP)';
COMMENT ON COLUMN policy_drafts.reference IS 'The actual policy content/reference text';
COMMENT ON COLUMN policy_drafts.source IS 'Source URL or document reference';
COMMENT ON COLUMN policy_drafts.highlights IS 'Relevant highlighted portions from the source';
COMMENT ON COLUMN policy_drafts.query IS 'Original search query that led to this draft';
COMMENT ON COLUMN policy_drafts.status IS 'Current status: pending, approved, rejected, or draft';
COMMENT ON COLUMN policy_drafts.approved_by IS 'User who approved the policy draft';
COMMENT ON COLUMN policy_drafts.rejection_reason IS 'Reason for rejection if status is rejected';
COMMENT ON COLUMN policy_drafts.organization_id IS 'Organization ID for multi-tenant support';
COMMENT ON COLUMN policy_drafts.user_id IS 'User ID who created the draft';
