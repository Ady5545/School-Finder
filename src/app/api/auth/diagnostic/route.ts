import { NextResponse } from 'next/server';
import { verifySmtpConfig } from '../../../../lib/emailService';

export async function GET() {
  try {
    const result = await verifySmtpConfig();
    return NextResponse.json(result, { status: result.success ? 200 : 503 });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown diagnostic error';
    return NextResponse.json(
      {
        success: false,
        message: `Diagnostic check failed: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
}
