import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
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

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isClientOnlyRoute = createRouteMatcher(["/jobs/new"]);
const isProOnlyRoute = createRouteMatcher(["/apply(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const sessionUser = await getSessionUserByClerkId(userId);

  if (!sessionUser || !sessionUser.onboardingComplete) {
    if (isOnboardingRoute(req)) return NextResponse.next();
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (isOnboardingRoute(req) && req.nextUrl.pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isAdminRoute(req) && sessionUser.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (isClientOnlyRoute(req) && sessionUser.role !== "CLIENT") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (isProOnlyRoute(req) && sessionUser.role !== "PRO") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
