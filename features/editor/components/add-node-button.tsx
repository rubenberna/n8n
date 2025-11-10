"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NodeSelector } from "@/components/node-selector";

export const AddNodeButton = memo(() => {
  const [open, setOpen] = useState(false);
  return (
    <NodeSelector open={open} onOpenChange={setOpen}>
      <Button variant="outline" size="icon" className="bg-background">
        <PlusIcon className="size-4" />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
