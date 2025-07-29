'use client';

import { useState } from 'react';
import { Building, Shield, Settings, AlertTriangle } from 'lucide-react';

interface OrganizationSetupStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function OrganizationSetupStep({ onNext, onBack }: OrganizationSetupStepProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domain: '',
    securityLevel: 'medium',
    complianceEnabled: true,
    auditLogging: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<{
    message: string;
    existingOrg: any;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDuplicateWarning(null);

    try {
      // Generate domain from organization name if not provided
      const domain = formData.domain || `${formData.name.toLowerCase().replace(/\s+/g, '')}.com`;

      const response = await fetch('/api/v1/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          domain: domain,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Organization created successfully:', result.data);
        onNext();
      } else if (result.error === 'DUPLICATE_ORGANIZATION') {
        // Show duplicate warning instead of error
        setDuplicateWarning({
          message: result.message,
          existingOrg: result.existingOrganization,
        });
      } else {
        setError(result.message || 'Failed to create organization');
      }
    } catch (error) {
      console.error('Error creating organization:', error);
      setError('Failed to create organization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDomainChange = (domain: string) => {
    setFormData({ ...formData, domain });
    // Clear duplicate warning when domain changes
    setDuplicateWarning(null);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Details */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Organization Details
          </h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter organization name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain
              </label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => handleDomainChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="yourcompany.com (optional)"
              />
              {!formData.domain && formData.name && (
                <p className="text-sm text-gray-500 mt-1">
                  Will use: {formData.name.toLowerCase().replace(/\s+/g, '')}.com
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe your organization"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Security Level
              </label>
              <select
                value={formData.securityLevel}
                onChange={(e) => setFormData({ ...formData, securityLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low - Basic security</option>
                <option value="medium">Medium - Standard security</option>
                <option value="high">High - Enhanced security</option>
                <option value="critical">Critical - Maximum security</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="complianceEnabled"
                  checked={formData.complianceEnabled}
                  onChange={(e) => setFormData({ ...formData, complianceEnabled: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="complianceEnabled" className="ml-2 text-sm text-gray-700">
                  Enable compliance monitoring
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auditLogging"
                  checked={formData.auditLogging}
                  onChange={(e) => setFormData({ ...formData, auditLogging: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="auditLogging" className="ml-2 text-sm text-gray-700">
                  Enable audit logging
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Duplicate Warning */}
        {duplicateWarning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-yellow-800 font-medium">Organization Already Exists</h4>
                <p className="text-yellow-700 text-sm mt-1">{duplicateWarning.message}</p>
                <div className="mt-2 text-sm text-yellow-600">
                  <p><strong>Existing Organization:</strong></p>
                  <p>Name: {duplicateWarning.existingOrg.name}</p>
                  <p>Domain: {duplicateWarning.existingOrg.domain}</p>
                </div>
                <p className="text-yellow-700 text-sm mt-2">
                  Please use a different domain or contact support if you need access to this organization.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading || !formData.name || !!duplicateWarning}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Organization'}
          </button>
        </div>
      </form>
    </div>
  );
} 