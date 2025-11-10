import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [open, setDialogOpen] = useState(false);
  const nodeStatus = "initial";

  const handleSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <ManualTriggerDialog open={open} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow''"
        status={nodeStatus}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
