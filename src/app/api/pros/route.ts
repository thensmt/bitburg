import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Category, Tier } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const category = searchParams.get("category") as Category | null;
  const tier = searchParams.get("tier") as Tier | null;
  const market = searchParams.get("market");
  const instantHireOnly = searchParams.get("instantHireOnly") === "true";

  const pros = await db.proProfile.findMany({
    where: {
      applicationStatus: "APPROVED",
      ...(category ? { specialties: { has: category } } : {}),
      ...(tier ? { tier } : {}),
      ...(market ? { market } : {}),
      ...(instantHireOnly ? { instantHireEnabled: true } : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      rates: true,
    },
    orderBy: [{ avgRating: "desc" }, { totalJobsCompleted: "desc" }],
  });

  return NextResponse.json(pros);
}
