"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  { value: "PHOTOGRAPHY", label: "Photography" },
  { value: "VIDEOGRAPHY", label: "Videography" },
  { value: "VIDEO_EDITING", label: "Video Editing" },
  { value: "PHOTO_EDITING", label: "Photo Editing" },
  { value: "GRAPHIC_DESIGN", label: "Graphic Design" },
  { value: "LIVE_STREAMING", label: "Live Streaming" },
];

const TIERS = [
  { value: "D", label: "D — Any pro" },
  { value: "C", label: "C — Developing" },
  { value: "B", label: "B — Solid" },
  { value: "A", label: "A — Advanced" },
  { value: "S", label: "S — Elite only" },
];

const jobPostSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(20),
  category: z.enum([
    "PHOTOGRAPHY",
    "VIDEOGRAPHY",
    "VIDEO_EDITING",
    "PHOTO_EDITING",
    "GRAPHIC_DESIGN",
    "LIVE_STREAMING",
  ]),
  jobType: z.enum(["ON_SITE", "REMOTE"]),
  eventDate: z.string().optional(),
  durationHours: z.coerce.number().min(0.5).optional(),
  location: z.string().optional(),
  eventType: z.string().optional(),
  deliveryDeadline: z.string().optional(),
  assetHandoffMethod: z.enum(["PLATFORM_UPLOAD", "EXTERNAL_LINK"]).optional(),
  assetHandoffUrl: z.string().url().optional(),
  budget: z.coerce.number().min(1),
  applicationDeadline: z.string(),
  minTierRequired: z.enum(["D", "C", "B", "A", "S"]),
});

type JobPostFormData = z.infer<typeof jobPostSchema>;

interface PaletteVariantProps {
  palette: {
    name: string;
    description: string;
    colors: { name: string; hex: string }[];
    primary: string;
    primaryText: string;
    background: string;
    text: string;
    border: string;
    label: string;
    error: string;
    errorBg: string;
    buttonHover: string;
  };
  onSuccess?: (jobId: string) => void;
}

function JobForm({ palette, onSuccess }: PaletteVariantProps) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<JobPostFormData>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      minTierRequired: "D",
      jobType: "ON_SITE",
      assetHandoffMethod: "PLATFORM_UPLOAD",
    },
    mode: "onBlur",
  });

  const jobType = watch("jobType");
  const assetHandoffMethod = watch("assetHandoffMethod");

  async function onSubmit(data: JobPostFormData) {
    setSubmitting(true);
    setServerError("");
    setShowErrorBanner(false);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const { id } = await res.json();
        onSuccess?.(id);
        reset();
      } else {
        const errorData = await res.json();
        setServerError(errorData.error || "Failed to post job");
        setShowErrorBanner(true);
      }
    } catch (err) {
      setServerError("Network error. Please try again.");
      setShowErrorBanner(true);
    } finally {
      setSubmitting(false);
    }
  }

  const isRequiredFilled =
    watch("title") &&
    watch("description") &&
    watch("category") &&
    watch("budget") &&
    watch("applicationDeadline") &&
    (jobType === "ON_SITE"
      ? watch("eventDate") && watch("durationHours") && watch("location")
      : watch("deliveryDeadline") &&
        watch("assetHandoffMethod") &&
        (watch("assetHandoffMethod") === "PLATFORM_UPLOAD" ||
          watch("assetHandoffUrl")));

  const submitButtonStyle = isRequiredFilled
    ? `${palette.primary} ${palette.primaryText} hover:${palette.buttonHover}`
    : "opacity-50 cursor-not-allowed bg-gray-300 text-gray-600";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: palette.background }}
    >
      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-3xl font-bold text-balance"
            style={{ color: palette.text }}
          >
            Post a Job
          </h1>
          <p
            className="mt-2"
            style={{ color: palette.label }}
          >
            Describe what you need. Approved pros will apply within your deadline.
          </p>
        </div>

        {/* Error Banner */}
        {showErrorBanner && serverError && (
          <div
            className="mb-6 rounded-lg p-4"
            style={{ backgroundColor: palette.errorBg, color: palette.error }}
          >
            <p className="text-sm font-medium">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basics Section */}
          <div>
            <h2
              className="mb-6 text-lg font-semibold"
              style={{ color: palette.text }}
            >
              Basics
            </h2>

            {/* Job Title */}
            <div className="mb-6">
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: palette.label }}
              >
                Job Title{" "}
                <span style={{ color: palette.error }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Photographer for youth basketball tournament"
                {...register("title")}
                style={{
                  borderColor: errors.title ? palette.error : palette.border,
                  color: palette.text,
                  backgroundColor: palette.background,
                }}
                className="w-full rounded-lg border px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0"
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "title-error" : undefined}
              />
              {errors.title && (
                <p
                  id="title-error"
                  className="mt-2 text-xs"
                  style={{ color: palette.error }}
                >
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: palette.label }}
              >
                Category{" "}
                <span style={{ color: palette.error }}>*</span>
              </label>
              <select
                {...register("category")}
                style={{
                  borderColor: errors.category ? palette.error : palette.border,
                  color: palette.text,
                  backgroundColor: palette.background,
                }}
                className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                aria-invalid={!!errors.category}
                aria-describedby={errors.category ? "category-error" : undefined}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p
                  id="category-error"
                  className="mt-2 text-xs"
                  style={{ color: palette.error }}
                >
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Event Type */}
            <div className="mb-6">
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: palette.label }}
              >
                Event Type / Sport
              </label>
              <input
                type="text"
                placeholder="e.g. Basketball, Football, Cheer, Wrestling, Concert"
                {...register("eventType")}
                style={{
                  borderColor: palette.border,
                  color: palette.text,
                  backgroundColor: palette.background,
                }}
                className="w-full rounded-lg border px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0"
              />
              <p
                className="mt-1 text-xs"
                style={{ color: palette.label }}
              >
                Helps pros find the right jobs
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: palette.label }}
              >
                Description{" "}
                <span style={{ color: palette.error }}>*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Describe the job, deliverables, and any specific requirements..."
                {...register("description")}
                style={{
                  borderColor: errors.description
                    ? palette.error
                    : palette.border,
                  color: palette.text,
                  backgroundColor: palette.background,
                }}
                className="w-full rounded-lg border px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0"
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
              />
              {errors.description && (
                <p
                  id="description-error"
                  className="mt-2 text-xs"
                  style={{ color: palette.error }}
                >
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Job Type Toggle */}
          <div>
            <label
              className="mb-4 block text-sm font-semibold"
              style={{ color: palette.label }}
            >
              Job Type{" "}
              <span style={{ color: palette.error }}>*</span>
            </label>
            <div className="flex gap-4">
              {[
                { value: "ON_SITE", label: "On-Site" },
                { value: "REMOTE", label: "Remote" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {}}
                  className="flex-1 rounded-lg border-2 px-4 py-4 font-semibold transition-all text-center"
                  style={{
                    borderColor:
                      jobType === option.value
                        ? palette.primary
                        : palette.border,
                    backgroundColor:
                      jobType === option.value ? palette.primary : palette.background,
                    color:
                      jobType === option.value
                        ? palette.primaryText
                        : palette.text,
                  }}
                  aria-pressed={jobType === option.value}
                  {...register("jobType")}
                  value={option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Event Details - ON_SITE */}
          {jobType === "ON_SITE" && (
            <div>
              <h2
                className="mb-6 text-lg font-semibold"
                style={{ color: palette.text }}
              >
                Event Details
              </h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{ color: palette.label }}
                  >
                    Event Date{" "}
                    <span style={{ color: palette.error }}>*</span>
                  </label>
                  <input
                    type="date"
                    {...register("eventDate")}
                    style={{
                      borderColor: errors.eventDate
                        ? palette.error
                        : palette.border,
                      color: palette.text,
                      backgroundColor: palette.background,
                    }}
                    className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                    aria-invalid={!!errors.eventDate}
                    aria-describedby={
                      errors.eventDate ? "eventDate-error" : undefined
                    }
                  />
                  {errors.eventDate && (
                    <p
                      id="eventDate-error"
                      className="mt-2 text-xs"
                      style={{ color: palette.error }}
                    >
                      {errors.eventDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{ color: palette.label }}
                  >
                    Duration (hours){" "}
                    <span style={{ color: palette.error }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    placeholder="e.g. 4"
                    {...register("durationHours")}
                    style={{
                      borderColor: errors.durationHours
                        ? palette.error
                        : palette.border,
                      color: palette.text,
                      backgroundColor: palette.background,
                    }}
                    className="w-full rounded-lg border px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0"
                    aria-invalid={!!errors.durationHours}
                    aria-describedby={
                      errors.durationHours ? "duration-error" : undefined
                    }
                  />
                  {errors.durationHours && (
                    <p
                      id="duration-error"
                      className="mt-2 text-xs"
                      style={{ color: palette.error }}
                    >
                      {errors.durationHours.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: palette.label }}
                >
                  Location{" "}
                  <span style={{ color: palette.error }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Springfield, VA"
                  {...register("location")}
                  style={{
                    borderColor: errors.location ? palette.error : palette.border,
                    color: palette.text,
                    backgroundColor: palette.background,
                  }}
                  className="w-full rounded-lg border px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0"
                  aria-invalid={!!errors.location}
                  aria-describedby={errors.location ? "location-error" : undefined}
                />
                {errors.location && (
                  <p
                    id="location-error"
                    className="mt-2 text-xs"
                    style={{ color: palette.error }}
                  >
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Delivery Details - REMOTE */}
          {jobType === "REMOTE" && (
            <div>
              <h2
                className="mb-6 text-lg font-semibold"
                style={{ color: palette.text }}
              >
                Delivery Details
              </h2>

              <div className="mb-6">
                <label
                  className="mb-2 block text-sm font-semibold"
                  style={{ color: palette.label }}
                >
                  Delivery Deadline{" "}
                  <span style={{ color: palette.error }}>*</span>
                </label>
                <input
                  type="date"
                  {...register("deliveryDeadline")}
                  style={{
                    borderColor: errors.deliveryDeadline
                      ? palette.error
                      : palette.border,
                    color: palette.text,
                    backgroundColor: palette.background,
                  }}
                  className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                  aria-invalid={!!errors.deliveryDeadline}
                  aria-describedby={
                    errors.deliveryDeadline ? "deliveryDeadline-error" : undefined
                  }
                />
                {errors.deliveryDeadline && (
                  <p
                    id="deliveryDeadline-error"
                    className="mt-2 text-xs"
                    style={{ color: palette.error }}
                  >
                    {errors.deliveryDeadline.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className="mb-3 block text-sm font-semibold"
                  style={{ color: palette.label }}
                >
                  Asset Handoff Method{" "}
                  <span style={{ color: palette.error }}>*</span>
                </label>
                <div className="flex gap-4">
                  {[
                    {
                      value: "PLATFORM_UPLOAD",
                      label: "Upload to Bitburg",
                    },
                    {
                      value: "EXTERNAL_LINK",
                      label: "External link",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {}}
                      className="flex-1 rounded-lg border-2 px-3 py-3 text-sm font-medium transition-all text-center"
                      style={{
                        borderColor:
                          assetHandoffMethod === option.value
                            ? palette.primary
                            : palette.border,
                        backgroundColor:
                          assetHandoffMethod === option.value
                            ? palette.primary
                            : palette.background,
                        color:
                          assetHandoffMethod === option.value
                            ? palette.primaryText
                            : palette.text,
                      }}
                      aria-pressed={assetHandoffMethod === option.value}
                      {...register("assetHandoffMethod")}
                      value={option.value}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {assetHandoffMethod === "EXTERNAL_LINK" && (
                <div>
                  <label
                    className="mb-2 block text-sm font-semibold"
                    style={{ color: palette.label }}
                  >
                    Asset Handoff URL{" "}
                    <span style={{ color: palette.error }}>*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... or similar"
                    {...register("assetHandoffUrl")}
                    style={{
                      borderColor: errors.assetHandoffUrl
                        ? palette.error
                        : palette.border,
                      color: palette.text,
                      backgroundColor: palette.background,
                    }}
                    className="w-full rounded-lg border px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0"
                    aria-invalid={!!errors.assetHandoffUrl}
                    aria-describedby={
                      errors.assetHandoffUrl ? "assetHandoffUrl-error" : undefined
                    }
                  />
                  {errors.assetHandoffUrl && (
                    <p
                      id="assetHandoffUrl-error"
                      className="mt-2 text-xs"
                      style={{ color: palette.error }}
                    >
                      {errors.assetHandoffUrl.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pricing & Timeline Section */}
          <div>
            <h2
              className="mb-6 text-lg font-semibold"
              style={{ color: palette.text }}
            >
              Pricing & Timeline
            </h2>

            <div className="mb-6">
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: palette.label }}
              >
                Budget (USD){" "}
                <span style={{ color: palette.error }}>*</span>
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-3 text-sm font-semibold"
                  style={{ color: palette.text }}
                >
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  placeholder="500"
                  {...register("budget")}
                  style={{
                    borderColor: errors.budget ? palette.error : palette.border,
                    color: palette.text,
                    backgroundColor: palette.background,
                    paddingLeft: "1.75rem",
                  }}
                  className="w-full rounded-lg border px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0"
                  aria-invalid={!!errors.budget}
                  aria-describedby={errors.budget ? "budget-error" : undefined}
                />
              </div>
              <p
                className="mt-1 text-xs"
                style={{ color: palette.label }}
              >
                Pros can accept or counter this rate.
              </p>
              {errors.budget && (
                <p
                  id="budget-error"
                  className="mt-2 text-xs"
                  style={{ color: palette.error }}
                >
                  {errors.budget.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold"
                style={{ color: palette.label }}
              >
                Application Deadline{" "}
                <span style={{ color: palette.error }}>*</span>
              </label>
              <input
                type="date"
                {...register("applicationDeadline")}
                style={{
                  borderColor: errors.applicationDeadline
                    ? palette.error
                    : palette.border,
                  color: palette.text,
                  backgroundColor: palette.background,
                }}
                className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                aria-invalid={!!errors.applicationDeadline}
                aria-describedby={
                  errors.applicationDeadline
                    ? "applicationDeadline-error"
                    : undefined
                }
              />
              {errors.applicationDeadline && (
                <p
                  id="applicationDeadline-error"
                  className="mt-2 text-xs"
                  style={{ color: palette.error }}
                >
                  {errors.applicationDeadline.message}
                </p>
              )}
            </div>
          </div>

          {/* Minimum Pro Tier */}
          <div>
            <label
              className="mb-2 block text-sm font-semibold"
              style={{ color: palette.label }}
            >
              Minimum Pro Tier{" "}
              <span style={{ color: palette.error }}>*</span>
            </label>
            <select
              {...register("minTierRequired")}
              style={{
                borderColor: errors.minTierRequired
                  ? palette.error
                  : palette.border,
                color: palette.text,
                backgroundColor: palette.background,
              }}
              className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
            >
              {TIERS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <p
              className="mt-1 text-xs"
              style={{ color: palette.label }}
            >
              Only pros at or above this tier can apply.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !isRequiredFilled}
            className={`w-full rounded-lg px-6 py-4 text-base font-semibold transition-all ${submitButtonStyle}`}
            style={{
              backgroundColor:
                isRequiredFilled && !submitting ? palette.primary : "#d1d5db",
              color:
                isRequiredFilled && !submitting
                  ? palette.primaryText
                  : "#6b7280",
            }}
          >
            {submitting ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Palette Definitions
const PALETTES = [
  {
    name: "Field",
    description:
      "Grounded, editorial, premium outdoor/sports aesthetic with natural earthy tones",
    colors: [
      { name: "Forest Green", hex: "#1B4332" },
      { name: "Natural Off-White", hex: "#F8F7F3" },
      { name: "Warm Charcoal", hex: "#3D3C37" },
      { name: "Muted Gold", hex: "#C9A876" },
    ],
    primary: "bg-[#1B4332]",
    primaryText: "text-white",
    background: "#F8F7F3",
    text: "#3D3C37",
    border: "#D4CEBC",
    label: "#6B6559",
    error: "#C41E3A",
    errorBg: "#FDE5E5",
    buttonHover: "hover:bg-[#0F2D22]",
  },
  {
    name: "Studio",
    description:
      "Bold and creative aesthetic with vibrant energy perfect for a creative marketplace",
    colors: [
      { name: "Electric Purple", hex: "#7C3AED" },
      { name: "Crisp White", hex: "#FAFAFA" },
      { name: "Deep Slate", hex: "#1F2937" },
      { name: "Vibrant Cyan", hex: "#06B6D4" },
    ],
    primary: "bg-[#7C3AED]",
    primaryText: "text-white",
    background: "#FAFAFA",
    text: "#1F2937",
    border: "#E5E7EB",
    label: "#6B7280",
    error: "#DC2626",
    errorBg: "#FEE2E2",
    buttonHover: "hover:bg-[#6D28D9]",
  },
  {
    name: "Warmth",
    description:
      "Inviting, approachable, high-end aesthetic that feels human and welcoming",
    colors: [
      { name: "Warm Terracotta", hex: "#D97706" },
      { name: "Soft Cream", hex: "#FFFBF0" },
      { name: "Rich Charcoal", hex: "#292524" },
      { name: "Soft Rose", hex: "#F59E0B" },
    ],
    primary: "bg-[#D97706]",
    primaryText: "text-white",
    background: "#FFFBF0",
    text: "#292524",
    border: "#FED7AA",
    label: "#78350F",
    error: "#B91C1C",
    errorBg: "#FEF2F2",
    buttonHover: "hover:bg-[#B45309]",
  },
];

export function JobPostForm({ onSuccess }: { onSuccess?: (jobId: string) => void }) {
  return (
    <div className="space-y-20">
      {PALETTES.map((palette, index) => (
        <div key={index}>
          {/* Palette Header with Color Strip */}
          <div className="mb-8 px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Palette {index + 1}: {palette.name}
            </h2>
            <p className="text-gray-600 mb-4">{palette.description}</p>
            <div className="flex gap-3">
              {palette.colors.map((color, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className="w-16 h-16 rounded-lg shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs text-gray-600 font-mono">
                    {color.hex}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Variant */}
          <div className="border-t-2 border-gray-200 pt-8">
            <JobForm palette={palette} onSuccess={onSuccess} />
          </div>
        </div>
      ))}
    </div>
  );
}
