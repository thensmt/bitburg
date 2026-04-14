import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { getSessionUserByClerkId } from "@/lib/auth";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

const isOnboardingRoute = createRouteMatcher([
  "/onboarding",
  "/api/onboarding",
]);

const isApiRoute = createRouteMatcher(["/api/(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isClientOnlyRoute = createRouteMatcher(["/jobs/new"]);
const isProOnlyRoute = createRouteMatcher(["/apply(.*)"]);

function deny(req: NextRequest, redirectTo: string, status: number, message: string) {
  if (isApiRoute(req)) {
    return NextResponse.json({ error: message }, { status });
  }
  return NextResponse.redirect(new URL(redirectTo, req.url));
}

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    if (isApiRoute(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return redirectToSignIn();
  }

  const sessionUser = await getSessionUserByClerkId(userId);

  if (!sessionUser || !sessionUser.onboardingComplete) {
    if (isOnboardingRoute(req)) return NextResponse.next();
    return deny(req, "/onboarding", 403, "Onboarding required");
  }

  if (isOnboardingRoute(req) && req.nextUrl.pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAdminRoute(req) && sessionUser.role !== "ADMIN") {
    return deny(req, "/dashboard", 403, "Admin role required");
  }
  if (isClientOnlyRoute(req) && sessionUser.role !== "CLIENT") {
    return deny(req, "/dashboard", 403, "Client role required");
  }
  if (isProOnlyRoute(req) && sessionUser.role !== "PRO") {
    return deny(req, "/dashboard", 403, "Pro role required");
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
