import type { HandoffMethod, JobType } from "@prisma/client";

export type JobTypeInput = {
  jobType: JobType | string | undefined;
  eventDate?: string | Date | null;
  durationHours?: number | null;
  location?: string | null;
  deliveryDeadline?: string | Date | null;
  assetHandoffMethod?: HandoffMethod | string | null;
  assetHandoffUrl?: string | null;
};

export function validateJobByType(input: JobTypeInput): string | null {
  if (input.jobType !== "ON_SITE" && input.jobType !== "REMOTE") {
    return "jobType must be ON_SITE or REMOTE";
  }

  if (input.jobType === "ON_SITE") {
    if (!input.eventDate) return "eventDate is required for on-site jobs";
    if (!input.durationHours || input.durationHours <= 0) {
      return "durationHours must be greater than 0 for on-site jobs";
    }
    if (!input.location || !String(input.location).trim()) {
      return "location is required for on-site jobs";
    }
    return null;
  }

  if (!input.deliveryDeadline) {
    return "deliveryDeadline is required for remote jobs";
  }
  if (
    input.assetHandoffMethod &&
    input.assetHandoffMethod !== "PLATFORM_UPLOAD" &&
    input.assetHandoffMethod !== "EXTERNAL_LINK"
  ) {
    return "assetHandoffMethod must be PLATFORM_UPLOAD or EXTERNAL_LINK";
  }
  if (input.assetHandoffMethod === "EXTERNAL_LINK" && !input.assetHandoffUrl) {
    return "assetHandoffUrl is required when assetHandoffMethod is EXTERNAL_LINK";
  }
  return null;
}
