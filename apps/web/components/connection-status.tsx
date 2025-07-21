import { useAccount, useConnect } from 'wagmi';
import { Badge } from '@/components/ui/badge';

export function ConnectionStatus() {
  const { address, isConnected } = useAccount();
  const { connectors } = useConnect();

  const metaMaskConnector = connectors.find(connector =>
    connector.name.toLowerCase().includes('metamask') ||
    connector.name.toLowerCase().includes('injected')
  );

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-medium mb-2">Connection Debug Info</h3>
      <div className="space-y-1 text-sm">
        <div>Status: <Badge variant={isConnected ? 'default' : 'secondary'}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Badge></div>
        <div>Address: <span className="font-mono">{address || 'None'}</span></div>
        <div>MetaMask Available: <Badge variant={metaMaskConnector?.ready ? 'default' : 'secondary'}>
          {metaMaskConnector?.ready ? 'Yes' : 'No'}
        </Badge></div>
        <div>Connector Name: <span className="font-mono">{metaMaskConnector?.name || 'None'}</span></div>
      </div>
    </div>
  );
} 