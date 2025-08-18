
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        contract: true, // Include contract details
      },
    });
    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Alert ID is required' }, { status: 400 });
  }

  try {
    const updatedAlert = await prisma.alert.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        read: true,
      },
    });
    return NextResponse.json(updatedAlert);
  } catch (error) {
    console.error(`Error updating alert ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
