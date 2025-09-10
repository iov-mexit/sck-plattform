import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { ethers } from 'ethers';
import { getFlareConfig, getFlareProvider, getFlareSigner } from '@/lib/blockchain/flare';

interface MintNFTRequest {
  roleAgentId: string;
  organizationId: string;
  recipientAddress: string;
  contractAddress: string;
  achievementType?: string;
  tokenId?: string;
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: string;
}

// SCK Dynamic NFT Contract ABI
const NFT_CONTRACT_ABI = [
  "function mintRoleAgent(address to, string memory did, string memory name, string memory role, string memory organization, uint256 initialTrustScore) external returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)"
];

export async function POST(request: NextRequest) {
  try {
    const body: MintNFTRequest = await request.json();

    // Validate required fields
    if (!body.roleAgentId || !body.organizationId || !body.recipientAddress || !body.contractAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch the role agent
    const role_agent = await prisma.roleAgent.findUnique({
      where: { id: body.roleAgentId },
      include: {
        roleTemplate: true,
        organization: true,
      },
    });

    if (!role_agent) {
      return NextResponse.json(
        { success: false, error: 'Role agent not found' },
        { status: 404 }
      );
    }

    // Check if already minted
    if (role_agent.soulboundTokenId) {
      return NextResponse.json(
        { success: false, error: 'NFT already minted for this role agent' },
        { status: 400 }
      );
    }

    // If no FLARE private key is available, return dry-run data (no writes)
    if (!process.env.FLARE_PRIVATE_KEY || process.env.FLARE_PRIVATE_KEY === '0x...') {
      const cfg = getFlareConfig();
      return NextResponse.json({
        success: true,
        data: {
          dryRun: true,
          network: cfg.name,
          contractAddress: body.contractAddress,
          recipientAddress: body.recipientAddress,
          message: 'Dry-run: provide FLARE_PRIVATE_KEY to enable on-chain minting.'
        }
      });
    }

    // Backend minting on Flare with private key
    try {
      console.log('🚀 Starting backend NFT minting on Flare...');

      const cfg = getFlareConfig();
      const provider = getFlareProvider();
      const wallet = getFlareSigner();

      // Basic balance check
      const balance = await provider.getBalance(wallet!.address);
      if (balance === 0n) {
        throw new Error(`Wallet ${wallet!.address} has no native balance for gas fees on ${cfg.name}`);
      }

      // Create contract instance
      const contract = new ethers.Contract(body.contractAddress, NFT_CONTRACT_ABI, wallet!);

      console.log('📋 Minting parameters:', {
        contract: body.contractAddress,
        wallet: wallet!.address,
        to: body.recipientAddress,
        did: role_agent.assignedToDid,
        name: role_agent.name,
        role: role_agent.roleTemplate?.title || 'Role Agent',
        organization: role_agent.organization?.name || 'Unknown Organization',
        trustScore: Math.floor(role_agent.trustScore || 750)
      });

      // Mint the NFT (mintRoleAgent returns the token ID)
      const tx = await contract.mintRoleAgent(
        body.recipientAddress,
        role_agent.assignedToDid,
        role_agent.name,
        role_agent.roleTemplate?.title || 'Role Agent',
        role_agent.organization?.name || 'Unknown Organization',
        Math.floor(role_agent.trustScore || 750)
      );

      console.log('📝 Transaction submitted:', tx.hash);
      console.log('⏳ Waiting for confirmation...');

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmed:', receipt);

      // Get token ID from transaction logs
      let tokenId = '0';

      // Parse the Transfer event to get the token ID
      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === 'Transfer' && parsedLog.args.from === ethers.ZeroAddress) {
            tokenId = parsedLog.args.tokenId.toString();
            break;
          }
        } catch (e) {
          // Skip unparseable logs
        }
      }

      console.log('🎯 NFT minted! Token ID:', tokenId);

      // Update database
      await prisma.roleAgent.update({
        where: { id: body.roleAgentId },
        data: {
          soulboundTokenId: tokenId,
          blockchainAddress: body.contractAddress,
          blockchainNetwork: cfg.name,
        },
      });

      // Create blockchain transaction record
      try {
        await prisma.blockchainTransaction.create({
          data: {
            id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            roleAgentId: body.roleAgentId,
            transactionHash: tx.hash,
            network: cfg.name,
            status: 'confirmed',
            gasUsed: receipt.gasUsed.toString(),
            gasPrice: receipt.gasPrice?.toString() || '20000000000',
            blockNumber: receipt.blockNumber,
            updatedAt: new Date(),
          },
        });
        console.log('✅ Blockchain transaction record created successfully');
      } catch (txError) {
        console.log('❌ Transaction record creation failed:', txError);
      }

      return NextResponse.json({
        success: true,
        data: {
          tokenId,
          transactionHash: tx.hash,
          contractAddress: body.contractAddress,
          network: cfg.name,
          explorerUrl: `${cfg.explorer}${tx.hash}`,
          roleAgentId: body.roleAgentId,
          achievementType: body.achievementType || 'Achievement',
          realBlockchain: true,
          walletUsed: wallet!.address,
          gasUsed: receipt.gasUsed.toString(),
          gasPrice: receipt.gasPrice?.toString(),
          message: `NFT successfully minted on ${cfg.name}!`,
          status: 'completed'
        }
      });

    } catch (mintError: any) {
      console.error('❌ Backend minting failed:', mintError);
      return NextResponse.json({
        success: false,
        error: `Backend minting failed: ${mintError.message}`,
        details: mintError.reason || 'Unknown error',
        troubleshooting: {
          privateKey: process.env.FLARE_PRIVATE_KEY ? 'Configured' : 'Missing',
          rpcUrl: getFlareConfig().rpcUrl,
          contractAddress: body.contractAddress
        }
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ NFT minting API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}