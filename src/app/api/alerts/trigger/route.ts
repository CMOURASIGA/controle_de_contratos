import { NextResponse } from 'next/server';
import { checkContractsAndSendAlerts } from '@/lib/alertService';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const cronSecret = searchParams.get('cron_secret');

  if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await checkContractsAndSendAlerts();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in trigger alerts route:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}