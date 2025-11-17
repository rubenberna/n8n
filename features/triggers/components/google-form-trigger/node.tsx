import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { GoogleFormTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";
import { GOOGLE_FORM_TRIGGER_NAME } from "@/inngest/channels/google-form-trigger";

export const GoogleFormTrigger = memo((props: NodeProps) => {
  const [open, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GOOGLE_FORM_TRIGGER_NAME,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });

  const handleSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <GoogleFormTriggerDialog open={open} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon="/logos/googleform.svg"
        name="Google Form"
        description="When a form is submitted"
        status={nodeStatus}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
      />
    </>
  );
});

GoogleFormTrigger.displayName = "GoogleFormTrigger";
