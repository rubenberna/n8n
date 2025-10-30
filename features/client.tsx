"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function Client() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.getUsers.queryOptions());

  return (
    <div>
      {data.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
