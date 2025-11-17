import {
  createTRPCRouter,
  protectedProcedure,
  premiumProcedure,
} from "@/trpc/init";
import prisma from "@/lib/db/db";
import { z } from "zod";
import { generateSlug } from "random-word-slugs";
import { PAGINATION } from "@/config/constants";
import type { Node, Edge } from "@xyflow/react";
import { NodeType } from "@/lib/generated/prisma/enums";
import { inngest } from "@/inngest/client";
import { sendWorkflowExecutionJob } from "@/inngest/utils";

export const workflowsRouter = createTRPCRouter({
  execute: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { userId: ctx.auth.user.id, id: input.id },
      });

      await sendWorkflowExecutionJob({ workflowId: input.id });
      return workflow;
    }),
  create: premiumProcedure.mutation(({ ctx }) => {
    return prisma.workflow.create({
      data: {
        userId: ctx.auth.user.id,
        name: generateSlug(3),
        nodes: {
          create: {
            name: NodeType.INITIAL,
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
          },
        },
      },
    });
  }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return prisma.workflow.delete({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
      });
    }),
  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      return prisma.workflow.update({
        where: { userId: ctx.auth.user.id, id: input.id },
        data: {
          name: input.name,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any()).optional(),
          })
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, nodes, edges } = input;

      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { userId: ctx.auth.user.id, id },
        include: {
          nodes: true,
          connections: true,
        },
      });

      return await prisma.$transaction(async (tx) => {
        await tx.node.deleteMany({
          where: { workflowId: id },
        });

        // Create new nodes
        await tx.node.createMany({
          data: nodes.map((node) => ({
            id: node.id,
            workflowId: id,
            name: node.type || "unknown",
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {},
          })),
        });

        // Create new connections
        await tx.connection.createMany({
          data: edges.map((edge) => ({
            workflowId: id,
            fromNodeId: edge.source,
            toNodeId: edge.target,
            fromOutput: edge.sourceHandle || "main",
            toInput: edge.targetHandle || "main",
          })),
        });

        // Update workflow's updatedAt timestamp
        await tx.workflow.update({
          where: { id },
          data: {
            updatedAt: new Date(),
          },
        });

        return workflow;
      });
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { userId: ctx.auth.user.id, id: input.id },
        include: {
          nodes: true,
          connections: true,
        },
      });

      // Transform server nodes to react-flow compatible nodes
      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        data: node.data as Record<string, unknown>,
        position: node.position as { x: number; y: number },
      }));

      // Transform server connections to react-flow compatible connections
      const edges: Edge[] = workflow.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));

      return {
        id: workflow.id,
        name: workflow.name,
        nodes,
        edges,
      };
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { pageSize, page, search } = input;
      const [items, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          where: {
            userId: ctx.auth.user.id,
            name: { contains: search, mode: "insensitive" },
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.workflow.count({
          where: {
            userId: ctx.auth.user.id,
            name: { contains: search, mode: "insensitive" },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
