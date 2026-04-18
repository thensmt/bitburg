"use client";

import { useState, type FormEvent } from "react";

// Pre-launch email capture — visual only. Form submit does not hit the network
// yet. When a real waitlist backend ships, wire `handleSubmit` to it and keep
// the success state as-is.

type Role = "client" | "pro" | null;

type Variant = "light" | "dark";

type WaitlistFormProps = {
  variant?: Variant;
  defaultRole?: Role;
  submitLabel?: string;
  showRolePicker?: boolean;
  microcopy?: string;
};

export function WaitlistForm({
  variant = "light",
  defaultRole = null,
  submitLabel = "Request early access",
  showRolePicker = true,
  microcopy = "We'll email you when your role opens up. No spam, ever.",
}: WaitlistFormProps) {
  const [role, setRole] = useState<Role>(defaultRole);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  const isDark = variant === "dark";

  const inputClass = isDark
    ? "w-full border-b border-[#F8F7F3]/30 bg-transparent py-3 text-[#F8F7F3] placeholder:text-[#F8F7F3]/40 focus:border-[#C9A961] focus:outline-none"
    : "w-full border-b border-[#3D3C37]/25 bg-transparent py-3 text-[#3D3C37] placeholder:text-[#6B6559]/70 focus:border-[#1B4332] focus:outline-none";

  const labelClass = isDark
    ? "mb-1 block text-xs uppercase tracking-[0.18em] text-[#F8F7F3]/50"
    : "mb-1 block text-xs uppercase tracking-[0.18em] text-[#6B6559]";

  const submitClass = isDark
    ? "w-full rounded-sm bg-[#F8F7F3] px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] text-[#0F2D22] transition-colors hover:bg-[#C9A961]"
    : "w-full rounded-sm bg-[#1B4332] px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] text-[#F8F7F3] transition-colors hover:bg-[#0F2D22]";

  const microClass = isDark ? "text-xs text-[#F8F7F3]/50" : "text-xs text-[#6B6559]";

  if (submitted) {
    return (
      <div
        className={
          isDark
            ? "border-t border-[#F8F7F3]/15 pt-8"
            : "border-t border-[#D4CEBC] pt-8"
        }
        role="status"
        aria-live="polite"
      >
        <p
          className={
            isDark
              ? "font-serif text-2xl text-[#F8F7F3]"
              : "font-serif text-2xl text-[#3D3C37]"
          }
        >
          You&apos;re on the list.
        </p>
        <p
          className={
            isDark ? "mt-2 text-[#F8F7F3]/60" : "mt-2 text-[#6B6559]"
          }
        >
          We&apos;ll email you when
          {role === "pro"
            ? " pro applications open up."
            : role === "client"
            ? " client access opens up."
            : " your role opens up."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {showRolePicker && (
        <div>
          <span className={labelClass}>I&apos;m signing up as</span>
          <div className="mt-2 flex flex-wrap gap-3">
            <RolePill
              active={role === "client"}
              variant={variant}
              onClick={() => setRole("client")}
            >
              I need media
            </RolePill>
            <RolePill
              active={role === "pro"}
              variant={variant}
              onClick={() => setRole("pro")}
            >
              I&apos;m a pro
            </RolePill>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Name</span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@domain.com"
            className={inputClass}
          />
        </label>
      </div>

      <button type="submit" className={submitClass}>
        {submitLabel}
      </button>

      <p className={microClass}>{microcopy}</p>
    </form>
  );
}

function RolePill({
  active,
  variant,
  onClick,
  children,
}: {
  active: boolean;
  variant: Variant;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const isDark = variant === "dark";

  const activeClass = isDark
    ? "rounded-full bg-[#C9A961] px-5 py-2 text-sm text-[#0F2D22] transition-colors"
    : "rounded-full bg-[#1B4332] px-5 py-2 text-sm text-[#F8F7F3] transition-colors";

  const idleClass = isDark
    ? "rounded-full border border-[#F8F7F3]/30 px-5 py-2 text-sm text-[#F8F7F3]/70 transition-colors hover:border-[#C9A961] hover:text-[#F8F7F3]"
    : "rounded-full border border-[#3D3C37]/25 px-5 py-2 text-sm text-[#6B6559] transition-colors hover:border-[#1B4332] hover:text-[#1B4332]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? activeClass : idleClass}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
