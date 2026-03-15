import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ApproveRejectPanel } from "./ApproveRejectPanel";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await db.proProfile.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!profile) notFound();

  const socialLinks = profile.socialLinks as Record<string, string> | null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">{profile.user.name}</h1>
          <p className="text-sm text-zinc-400">{profile.user.email}</p>
          <p className="mt-1 text-xs text-zinc-500">
            Applied {new Date(profile.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            profile.applicationStatus === "PENDING"
              ? "bg-yellow-500/20 text-yellow-300"
              : profile.applicationStatus === "APPROVED"
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {profile.applicationStatus}
        </span>
      </div>

      <div className="space-y-6">
        {/* Specialties */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Specialties</h2>
          {profile.specialties.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((s) => (
                <span key={s} className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                  {s.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-600 italic">None provided</p>
          )}
        </section>

        {/* Bio */}
        {profile.bio && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Bio</h2>
            <p className="text-sm leading-relaxed text-zinc-300">{profile.bio}</p>
          </section>
        )}

        {/* Portfolio */}
        {profile.portfolioUrls.length > 0 && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Portfolio</h2>
            <ul className="space-y-1">
              {profile.portfolioUrls.map((url) => (
                <li key={url}>
                  <a
                    href={url.startsWith("http") ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Equipment */}
        {profile.equipment.length > 0 && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Equipment</h2>
            <ul className="space-y-1">
              {profile.equipment.map((item) => (
                <li key={item} className="text-sm text-zinc-300">• {item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Social Links */}
        {socialLinks && Object.values(socialLinks).some(Boolean) && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Social & Web</h2>
            <div className="space-y-1">
              {Object.entries(socialLinks).map(([key, val]) =>
                val ? (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <span className="w-20 capitalize text-zinc-500">{key}</span>
                    <a
                      href={val.startsWith("http") ? val : `https://${val}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {val}
                    </a>
                  </div>
                ) : null
              )}
            </div>
          </section>
        )}

        {/* Service Area */}
        {profile.serviceArea && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Service Area</h2>
            <p className="text-sm text-zinc-300">
              {profile.serviceArea}
              {profile.willingToTravel && (
                <span className="ml-2 text-zinc-500">(willing to travel)</span>
              )}
            </p>
          </section>
        )}

        {/* Action Panel */}
        <ApproveRejectPanel
          profileId={profile.id}
          currentStatus={profile.applicationStatus}
          currentTier={profile.tier}
        />
      </div>
    </div>
  );
}
