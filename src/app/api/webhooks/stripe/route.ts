import { sendWorkflowExecution } from "@/inngest/utils";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");
    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Required Parameter: workflowId",
        },
        { status: 400 }
      );
    }
    const body = await request.json();
    const stripeData = {
      eventId: body.id,
      eventType: body.type,
      livemode: body.livemode,
      timestamp: body.created,
      raw: body.data?.object,
    };
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        stripe: stripeData,
      },
    });
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to Process Stripe Event",
      },
      { status: 500 }
    );
  }
}
