
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET a single contract by ID
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        costCenter: true,
        accountingAccount: true,
        expenses: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json({ message: 'Contract not found' }, { status: 404 });
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error(`Error fetching contract ${params.id}:`, error);
    return NextResponse.json({ message: 'Error fetching contract' }, { status: 500 });
  }
}

// UPDATE a contract by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

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

    const updatedContract = await prisma.contract.update({
      where: { id },
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

    return NextResponse.json(updatedContract);
  } catch (error) {
    console.error(`Error updating contract ${params.id}:`, error);
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Contract not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Error updating contract' }, { status: 500 });
  }
}


// DELETE a contract by ID
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction([
      // First, delete all expenses related to the contract
      prisma.expense.deleteMany({
        where: { contractId: id },
      }),
      // Then, delete the contract itself
      prisma.contract.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ message: 'Contract deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting contract ${params.id}:`, error);
    // P2025 is the Prisma error code for "record to delete does not exist"
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Contract not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Error deleting contract' }, { status: 500 });
  }
}
