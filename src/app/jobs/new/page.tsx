"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JobPostForm } from "@/components/JobPostForm";

export default function JobPostPage() {
  const router = useRouter();

  const handleSuccess = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <JobPostForm onSuccess={handleSuccess} />
    </div>
  );
}
