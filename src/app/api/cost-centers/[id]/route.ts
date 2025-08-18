import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// UPDATE a cost center
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    const updatedCostCenter = await prisma.costCenter.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updatedCostCenter);
  } catch (error) {
    // Handle potential errors, like unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'A cost center with this name already exists.' }, { status: 409 });
    }
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Cost center not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Error updating cost center' }, { status: 500 });
  }
}

// DELETE a cost center
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    // Check if any contracts are associated with this cost center
    const contracts = await prisma.contract.findMany({
      where: { costCenterId: id },
    });

    if (contracts.length > 0) {
      return NextResponse.json(
        { message: 'Cannot delete. This cost center is associated with one or more contracts.' },
        { status: 409 } // 409 Conflict
      );
    }

    await prisma.costCenter.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Cost center deleted successfully' }, { status: 200 });
  } catch (error) {
    if (error.code === 'P2025') {
        return NextResponse.json({ message: 'Cost center not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Error deleting cost center' }, { status: 500 });
  }
}
