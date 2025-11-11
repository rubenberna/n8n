"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { HttpRequestDialog, HttpRequestFormValues } from "./dialog";

type HttpRequestNodeData = {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [open, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const handleSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (data: HttpRequestFormValues) => {
    setNodes((prev) => {
      return prev.map((node) => {
        if (node.id === props.id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      });
    });
  };

  const nodeStatus = "initial";
  const nodeData = props.data;
  const description = nodeData.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "Not configured";

  return (
    <>
      <HttpRequestDialog
        open={open}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />
      <BaseExecutionNode
        {...props}
        status={nodeStatus}
        icon={GlobeIcon}
        name="HTTP Request"
        description={description}
        onSettings={handleSettings}
        onDoubleClick={handleSettings}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
