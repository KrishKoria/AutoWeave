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
    const formData = {
      formId: body.formid,
      formTitle: body.formTitle,
      responseId: body.responseid,
      responses: body.responses,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      raw: body,
    };
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        googleFormData: formData,
      },
    });
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing Google Form webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to Process Submission",
      },
      { status: 500 }
    );
  }
}
