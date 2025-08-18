
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET all contracts
export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      include: {
        costCenter: true,
        accountingAccount: true,
      },
      orderBy: {
        endDate: 'asc',
      },
    });
    return NextResponse.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json({ message: 'Error fetching contracts' }, { status: 500 });
  }
}

// POST a new contract
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      supplier,
      startDate,
      endDate,
      totalValue,
      focalPointEmail,
      costCenterId,
      accountingAccountId,
    } = body;

    // Basic validation
    if (!name || !supplier || !startDate || !endDate || !totalValue || !focalPointEmail || !costCenterId || !accountingAccountId) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const newContract = await prisma.contract.create({
      data: {
        name,
        supplier,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalValue: parseFloat(totalValue),
        focalPointEmail,
        costCenterId: parseInt(costCenterId, 10),
        accountingAccountId: parseInt(accountingAccountId, 10),
      },
    });

    return NextResponse.json(newContract, { status: 201 });
  } catch (error) {
    console.error('Error creating contract:', error);
    // Prisma specific error for foreign key constraint
    if (error.code === 'P2003') {
         return NextResponse.json({ message: 'Invalid Cost Center or Accounting Account.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error creating contract' }, { status: 500 });
  }
}
