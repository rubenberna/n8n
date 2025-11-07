"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNode = memo((props: NodeProps) => {
  const [open, setOpen] = useState(false);
  return (
    <NodeSelector open={open} onOpenChange={setOpen}>
      <WorkflowNode>
        <PlaceholderNode {...props} onClick={() => setOpen(true)}>
          <div className="cursor-pointer flex items-center justify-center">
            <PlusIcon className="size-4" />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});

InitialNode.displayName = "InitialNode";
