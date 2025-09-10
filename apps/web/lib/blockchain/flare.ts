import { ethers } from "ethers";

export type FlareNetwork = "coston" | "coston2" | "songbird" | "flare";

type NetworkConfig = {
  name: FlareNetwork;
  chainId: number;
  rpcUrl: string;
  explorer: string;
};

const DEFAULTS: Record<FlareNetwork, NetworkConfig> = {
  // Coston Testnet (legacy)
  coston: {
    name: "coston",
    chainId: 16,
    rpcUrl: process.env.FLARE_RPC_URL || "https://coston-api.flare.network/ext/C/rpc",
    explorer: "https://coston-explorer.flare.network/tx/",
  },
  // Coston2 Testnet
  coston2: {
    name: "coston2",
    chainId: 114,
    rpcUrl: process.env.FLARE_RPC_URL || "https://coston2-api.flare.network/ext/C/rpc",
    explorer: "https://coston2-explorer.flare.network/tx/",
  },
  // Songbird Canary
  songbird: {
    name: "songbird",
    chainId: 19,
    rpcUrl: process.env.FLARE_RPC_URL || "https://songbird-api.flare.network/ext/C/rpc",
    explorer: "https://songbird-explorer.flare.network/tx/",
  },
  // Flare Mainnet
  flare: {
    name: "flare",
    chainId: 14,
    rpcUrl: process.env.FLARE_RPC_URL || "https://flare-api.flare.network/ext/C/rpc",
    explorer: "https://flare-explorer.flare.network/tx/",
  },
};

export function getFlareConfig(): NetworkConfig {
  const env = (process.env.FLARE_NETWORK || "coston2").toLowerCase() as FlareNetwork;
  return DEFAULTS[env] || DEFAULTS.coston2;
}

export function getFlareProvider(): ethers.JsonRpcProvider {
  const cfg = getFlareConfig();
  return new ethers.JsonRpcProvider(cfg.rpcUrl, {
    name: cfg.name,
    chainId: cfg.chainId,
  });
}

export function getFlareSigner(): ethers.Wallet | null {
  const pk = process.env.FLARE_PRIVATE_KEY;
  if (!pk || pk === "0x...") return null;
  const provider = getFlareProvider();
  return new ethers.Wallet(pk, provider);
}

export async function getFlareStatus(): Promise<{
  network: { name: string; chainId: number };
  rpcUrl: string;
  hasSigner: boolean;
  signerAddress?: string;
  balanceWei?: string;
}> {
  const cfg = getFlareConfig();
  const provider = getFlareProvider();
  const network = await provider.getNetwork();
  const signer = getFlareSigner();

  const status: {
    network: { name: string; chainId: number };
    rpcUrl: string;
    hasSigner: boolean;
    signerAddress?: string;
    balanceWei?: string;
  } = {
    network: { name: String(network.name), chainId: Number(network.chainId) },
    rpcUrl: cfg.rpcUrl,
    hasSigner: !!signer,
  };

  if (signer) {
    status.signerAddress = signer.address;
    try {
      const bal = await provider.getBalance(signer.address);
      status.balanceWei = bal.toString();
    } catch (_) {
      // ignore balance errors
    }
  }

  return status;
}


