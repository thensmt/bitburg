import { db } from "./db";
import type { Role } from "@prisma/client";

export type SessionUser = {
  id: string;
  role: Role;
  onboardingComplete: boolean;
};

export async function getSessionUserByClerkId(
  clerkId: string
): Promise<SessionUser | null> {
  return db.user.findUnique({
    where: { clerkId },
    select: { id: true, role: true, onboardingComplete: true },
  });
}
