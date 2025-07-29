import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../../generated/prisma';
import { BlockchainService } from '../../../../../lib/blockchain-service';
import { ethers } from 'ethers';

const prisma = new PrismaClient();

interface MintNFTRequest {
  digitalTwinId: string;
  organizationId: string;
  recipientAddress: string;
  contractAddress: string;
  achievementType?: string;
  // User provides signed transaction data
  signedTransaction?: string;
  transactionHash?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: MintNFTRequest = await request.json();

    // Validate required fields
    if (!body.digitalTwinId || !body.organizationId || !body.recipientAddress || !body.contractAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch the digital twin
    const digitalTwin = await prisma.digital_twins.findUnique({
      where: { id: body.digitalTwinId },
      include: {
        organizations: true,
        role_templates: true,
      },
    });

    if (!digitalTwin) {
      return NextResponse.json(
        { success: false, error: 'Digital twin not found' },
        { status: 404 }
      );
    }

    // Check if digital twin is eligible for NFT minting (trust score >= 750)
    if (!digitalTwin.isEligibleForMint) {
      return NextResponse.json(
        { success: false, error: 'Digital twin is not eligible for NFT minting (trust score < 750)' },
        { status: 400 }
      );
    }

    // Check if this specific achievement NFT already exists for this digital twin
    const achievementType = body.achievementType || 'Security Achievement';
    const existingNFT = await prisma.blockchain_transactions.findFirst({
      where: {
        digitalTwinId: body.digitalTwinId,
        status: 'confirmed',
      },
    });

    if (existingNFT) {
      return NextResponse.json(
        { success: false, error: 'Achievement NFT already minted for this digital twin' },
        { status: 400 }
      );
    }

    // Prepare NFT metadata for the achievement
    const nftMetadata = JSON.stringify({
      name: `${achievementType} - ${digitalTwin.name}`,
      description: `Achievement NFT for ${digitalTwin.assignedToDid}`,
      image: `https://api.example.com/achievements/${achievementType.toLowerCase()}.png`,
      attributes: [
        {
          trait_type: 'Achievement Type',
          value: achievementType,
        },
        {
          trait_type: 'Digital Twin',
          value: digitalTwin.name,
        },
        {
          trait_type: 'Role',
          value: digitalTwin.role_templates?.title || 'Unknown',
        },
        {
          trait_type: 'Organization',
          value: digitalTwin.organizations?.name || 'Unknown',
        },
        {
          trait_type: 'Trust Score',
          value: digitalTwin.trustScore || 0,
        },
        {
          trait_type: 'DID',
          value: digitalTwin.assignedToDid,
        },
        {
          trait_type: 'Transferable',
          value: true,
        },
      ],
    });

    // For now, we'll return the transaction data for the frontend to sign
    // The frontend will handle the actual blockchain transaction
    const transactionData = {
      to: body.contractAddress,
      data: '0x', // This will be the actual contract call data
      value: '0x0',
      gasLimit: '0x186A0', // 100,000 gas
      gasPrice: '0x4A817C800', // 20 gwei
      nonce: 0, // Will be set by the wallet
    };

    return NextResponse.json({
      success: true,
      data: {
        transactionData,
        digitalTwinId: body.digitalTwinId,
        achievementType: achievementType,
        metadata: JSON.parse(nftMetadata),
        message: 'Transaction data ready for wallet signing. Use your MetaMask to sign and submit the transaction.',
        nextSteps: [
          '1. Sign the transaction with your MetaMask wallet',
          '2. Submit the signed transaction to the blockchain',
          '3. Wait for confirmation',
          '4. The achievement NFT will be minted to your wallet'
        ]
      },
    });

  } catch (error) {
    console.error('Error preparing NFT minting:', error);
    return NextResponse.json(
      { success: false, error: `Failed to prepare NFT minting: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 