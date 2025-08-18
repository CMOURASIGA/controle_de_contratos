
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const accountingAccounts = await prisma.accountingAccount.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(accountingAccounts);
  } catch (error) {
    console.error('Error fetching accounting accounts:', error);
    return NextResponse.json({ message: 'Error fetching accounting accounts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, number } = await request.json();

    if (!name || !number) {
      return NextResponse.json({ message: 'Name and number are required' }, { status: 400 });
    }

    const newAccountingAccount = await prisma.accountingAccount.create({
      data: {
        name,
        number,
      },
    });
    return NextResponse.json(newAccountingAccount, { status: 201 });
  } catch (error) {
    console.error('Error creating accounting account:', error);
    return NextResponse.json({ message: 'Error creating accounting account' }, { status: 500 });
  }
}
