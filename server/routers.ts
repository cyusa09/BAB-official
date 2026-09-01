import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { buildRecommendation } from "../shared/recommendations";
import { createAssessment, getAssessmentsByUser, upsertUser } from "./db";
import { getSessionCookieOptions as sessionOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const assessmentInput = z.object({
  location: z.string().min(2), parcelIdentity: z.string().max(180).optional(), hectares: z.number().positive().max(100000),
  terrain: z.enum(["flat", "rolling", "steep"]), soil: z.enum(["rich", "mixed", "sandy", "clay"]),
  infrastructure: z.enum(["high", "medium", "low"]), budget: z.enum(["premium", "standard", "lean"]),
  goal: z.enum(["balanced", "development", "agriculture"]),
  ownership: z.enum(["owned", "leased", "shared", "planning"]).optional(),
  currentUse: z.enum(["unused", "crops", "grazing", "residential"]).optional(),
  waterAccess: z.enum(["reliable", "seasonal", "none"]).optional(),
  powerAccess: z.enum(["connected", "nearby", "none"]).optional(),
  roadAccess: z.enum(["paved", "unpaved", "none"]).optional(),
  targetTimeline: z.enum(["now", "one-year", "exploring"]).optional(),
  notes: z.string().max(2000).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(COOKIE_NAME, { ...sessionOptions(ctx.req), maxAge: -1 }); return { success: true } as const; }),
  }),
  assessment: router({
    generate: publicProcedure.input(assessmentInput).mutation(({ input }) => ({ input, recommendation: buildRecommendation(input) })),
    save: protectedProcedure.input(assessmentInput.extend({ title: z.string().min(1).max(180), recommendation: z.unknown() })).mutation(async ({ ctx, input }) => {
      await upsertUser({ openId: ctx.user.openId, name: ctx.user.name, email: ctx.user.email });
      const id = await createAssessment({ userId: ctx.user.id, title: input.title, location: input.location, hectares: String(input.hectares), goal: input.goal, inputsJson: JSON.stringify(input), resultJson: JSON.stringify(input.recommendation) });
      return { id, success: true } as const;
    }),
    mine: protectedProcedure.query(({ ctx }) => getAssessmentsByUser(ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
