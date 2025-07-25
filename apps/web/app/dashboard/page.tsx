import { TrustConstellation } from '@/features/trust-constellation/components/trust-constellation';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Trust Fabric</h1>
      <TrustConstellation />
    </div>
  );
}
