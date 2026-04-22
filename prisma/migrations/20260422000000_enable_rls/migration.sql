-- Enable Row Level Security on all public tables.
-- No policies are defined, which blocks all access via the Supabase
-- PostgREST endpoint for the `anon` and `authenticated` roles.
-- Prisma connects as the `postgres` role, which owns these tables and
-- therefore bypasses RLS under ENABLE (without FORCE) — so application
-- queries are unaffected.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProRate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Job" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Application" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Dispute" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
