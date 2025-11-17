import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { PolarTriggerDialog } from "./dialog";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchPolarTriggerRealtimeToken } from "./actions";
import { POLAR_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/polar-trigger";

export const PolarTriggerNode = memo((props: NodeProps) => {
  const [open, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: POLAR_TRIGGER_CHANNEL_NAME,
    topic: "status",
    refreshToken: fetchPolarTriggerRealtimeToken,
  });

  const handleSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <PolarTriggerDialog open={open} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon="/logos/polar.svg"
        name="Polar"
        description="When a Polar event is received"
        status={nodeStatus}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
      />
    </>
  );
});

PolarTriggerNode.displayName = "PolarTriggerNode";
