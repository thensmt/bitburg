"use client";

interface StripeConnectBannerProps {
  stripeAccountId: string | null;
}

export default function StripeConnectBanner({ stripeAccountId }: StripeConnectBannerProps) {
  if (stripeAccountId) {
    return (
      <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 inline-block">
        Payments connected ✓
      </p>
    );
  }

  async function handleConnect() {
    const res = await fetch("/api/stripe/connect/onboard", { method: "POST" });
    if (!res.ok) return;
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3">
      <p className="text-sm font-medium text-yellow-800">
        Connect your bank account to receive payments
      </p>
      <button
        onClick={handleConnect}
        className="shrink-0 rounded bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600"
      >
        Connect with Stripe
      </button>
    </div>
  );
}
