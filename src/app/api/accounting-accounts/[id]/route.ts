import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// UPDATE an accounting account
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const { name, number } = await request.json();

    if (!name || !number) {
      return NextResponse.json({ message: 'Name and number are required' }, { status: 400 });
    }

    const updatedAccount = await prisma.accountingAccount.update({
      where: { id },
      data: { name, number },
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'An account with this name or number already exists.' }, { status: 409 });
    }
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Error updating account' }, { status: 500 });
  }
}

// DELETE an accounting account
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    const contracts = await prisma.contract.findMany({
      where: { accountingAccountId: id },
    });

    if (contracts.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete. This account is associated with one or more contracts.' },
        { status: 409 }
      );
    }

    await prisma.accountingAccount.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
  } catch (error) {
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Error deleting account' }, { status: 500 });
  }
}
