import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";

export default function SubmittedPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <AdSlot zone="apply-submitted-top" />
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="mb-6 text-5xl">🎉</div>
        <h1 className="text-3xl font-bold text-zinc-900">Application Submitted</h1>
        <p className="mt-4 text-zinc-500">
          Thanks for applying to Bitburg. Our team reviews every application and will notify you within 3–5 business days.
        </p>
        <p className="mt-2 text-zinc-500">
          Once approved, you&apos;ll be assigned a tier and your profile will go live on the platform.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-block rounded-xl bg-blue-500 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-600"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
