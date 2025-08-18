import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, amount, date, contractId } = body;

    if (!description || !amount || !date || !contractId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newExpense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        date: new Date(date),
        contractId: parseInt(contractId, 10),
      },
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    if (error.code === 'P2003') {
        return NextResponse.json({ message: 'Contract not found.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error creating expense' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contractId = searchParams.get('contractId');

    const whereClause = contractId ? { contractId: parseInt(contractId, 10) } : {};

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      include: {
        contract: {
          include: {
            costCenter: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ message: 'Error fetching expenses' }, { status: 500 });
  }
}