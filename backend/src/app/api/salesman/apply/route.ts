import { NextRequest, NextResponse } from 'next/server';
import { SalesmanService } from '@/services/salesmanService';
import { authenticateUser } from '@/utils/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json({ success: false, statusCode: 401, message: 'Unauthorized' }, { status: 401 });
    }

    const application = await SalesmanService.getApplicationStatus(user.id);
    return NextResponse.json({ 
      success: true, 
      statusCode: 200, 
      data: { 
        application,
        userRole: user.role 
      } 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to fetch status' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json({ success: false, statusCode: 401, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { businessName, phoneNumber, reason } = body;

    if (!businessName || !phoneNumber || !reason) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: 'Business Name, Phone Number, and Reason are required.' },
        { status: 400 }
      );
    }

    const application = await SalesmanService.applyForSalesman(user.id, { businessName, phoneNumber, reason });
    return NextResponse.json({ success: true, statusCode: 201, data: { application } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 400, message: error.message || 'Application failed' },
      { status: 400 }
    );
  }
}
