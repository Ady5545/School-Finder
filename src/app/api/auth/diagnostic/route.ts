import { NextRequest, NextResponse } from 'next/server';
import { verifySmtpConfig } from '../../../../lib/emailService';
import { requireAdminAuth } from '../../../../lib/adminAuth';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAdminAuth(req);
    if (!auth.authorized) {
      return auth.errorResponse || NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

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

