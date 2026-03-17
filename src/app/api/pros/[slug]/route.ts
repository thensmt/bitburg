import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { Category } from "@/generated/prisma";

interface RateInput {
  category: Category;
  hourlyRate?: number | null;
  flatRate?: number | null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;

  const [user, pro] = await Promise.all([
    db.user.findUnique({ where: { clerkId } }),
    db.proProfile.findUnique({ where: { slug } }),
  ]);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (!pro) return NextResponse.json({ error: "Pro not found" }, { status: 404 });
  if (pro.userId !== user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();

  const {
    bio,
    specialties,
    equipment,
    portfolioUrls,
    socialLinks,
    serviceArea,
    market,
    state,
    willingToTravel,
    instantHireEnabled,
    rates,
  } = body;

  // Update profile fields
  const updated = await db.proProfile.update({
    where: { slug },
    data: {
      ...(bio !== undefined ? { bio } : {}),
      ...(specialties !== undefined ? { specialties } : {}),
      ...(equipment !== undefined
        ? {
            equipment: Array.isArray(equipment)
              ? equipment
              : String(equipment)
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean),
          }
        : {}),
      ...(portfolioUrls !== undefined ? { portfolioUrls } : {}),
      ...(socialLinks !== undefined ? { socialLinks } : {}),
      ...(serviceArea !== undefined ? { serviceArea } : {}),
      ...(market !== undefined ? { market } : {}),
      ...(state !== undefined ? { state } : {}),
      ...(willingToTravel !== undefined ? { willingToTravel } : {}),
      ...(instantHireEnabled !== undefined ? { instantHireEnabled } : {}),
    },
  });

  // Upsert rates if provided
  if (Array.isArray(rates) && rates.length >= 0) {
    const incoming = rates as RateInput[];
    const incomingCategories = incoming.map((r) => r.category).filter(Boolean);

    // Delete rates not in the incoming list
    await db.proRate.deleteMany({
      where: {
        proProfileId: pro.id,
        NOT:
          incomingCategories.length > 0
            ? { category: { in: incomingCategories } }
            : undefined,
      },
    });

    // Fetch existing rates to decide create vs update
    const existingRates = await db.proRate.findMany({
      where: { proProfileId: pro.id },
    });
    const existingByCategory = new Map(existingRates.map((r) => [r.category, r]));

    await Promise.all(
      incoming.map((r) => {
        const existing = existingByCategory.get(r.category);
        if (existing) {
          return db.proRate.update({
            where: { id: existing.id },
            data: {
              hourlyRate: r.hourlyRate ?? null,
              flatRate: r.flatRate ?? null,
            },
          });
        }
        return db.proRate.create({
          data: {
            proProfileId: pro.id,
            category: r.category,
            hourlyRate: r.hourlyRate ?? null,
            flatRate: r.flatRate ?? null,
          },
        });
      })
    );
  }

  return NextResponse.json({ slug: updated.slug });
}
