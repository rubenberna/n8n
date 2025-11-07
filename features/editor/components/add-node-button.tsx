"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const AddNodeButton = memo(() => {
  return (
    <Button
      onClick={() => {}}
      variant="outline"
      size="icon"
      className="bg-background"
    >
      <PlusIcon className="size-4" />
    </Button>
  );
});

AddNodeButton.displayName = "AddNodeButton";
