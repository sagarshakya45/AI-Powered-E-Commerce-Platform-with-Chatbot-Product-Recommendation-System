import { NextRequest, NextResponse } from 'next/server';
import { SalesmanService } from '@/services/salesmanService';
import { authenticateUser } from '@/utils/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, statusCode: 403, message: 'Forbidden' }, { status: 403 });
    }

    const applications = await SalesmanService.getAllApplications();
    return NextResponse.json({ success: true, statusCode: 200, data: { applications } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, statusCode: 403, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { applicationId, status } = body;

    if (!applicationId || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ success: false, statusCode: 400, message: 'Valid applicationId and status are required' }, { status: 400 });
    }

    const updated = await SalesmanService.reviewApplication(applicationId, status);
    return NextResponse.json({ success: true, statusCode: 200, data: { application: updated } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 400, message: error.message || 'Failed to review application' },
      { status: 400 }
    );
  }
}
