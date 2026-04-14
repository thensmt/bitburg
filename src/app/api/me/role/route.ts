import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSessionUserByClerkId } from "@/lib/auth";

// Nav reads role from here so it always reflects the DB (source of truth),
// not Clerk publicMetadata (which can drift).
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await getSessionUserByClerkId(userId);
  if (!user) return NextResponse.json({ role: null, onboardingComplete: false });

  return NextResponse.json({
    role: user.role,
    onboardingComplete: user.onboardingComplete,
  });
}
