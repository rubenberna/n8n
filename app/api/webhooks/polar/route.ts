import { sendWorkflowExecutionJob } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");
    if (!workflowId) {
      return NextResponse.json(
        { success: false, error: "Workflow ID is required" },
        { status: 400 }
      );
    }
    const body = await request.json();
    const polarData = {
      eventId: body.id,
      eventType: body.type,
      livemode: body.livemode,
      timestamp: body.created,
      raw: body?.data?.object,
    };

    // Trigger an Inngest job
    await sendWorkflowExecutionJob({
      workflowId,
      initialData: {
        polar: polarData,
      },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Polar webhook error: ", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Polar webhook" },
      { status: 500 }
    );
  }
}
