
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const costCenters = await prisma.costCenter.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(costCenters);
  } catch (error) {
    console.error('Error fetching cost centers:', error);
    return NextResponse.json({ message: 'Error fetching cost centers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;
    console.log('Received request to create cost center with name:', name);

    if (!name) {
      console.log('Validation failed: Name is required.');
      return NextResponse.json({ message: 'Name is required' }, { status: 400 });
    }

    console.log('Creating new cost center in the database...');
    const newCostCenter = await prisma.costCenter.create({
      data: {
        name,
      },
    });
    console.log('Successfully created new cost center:', newCostCenter);
    return NextResponse.json(newCostCenter, { status: 201 });
  } catch (error) {
    console.error('Error creating cost center:', error);
    return NextResponse.json({ message: 'Error creating cost center' }, { status: 500 });
  }
}
