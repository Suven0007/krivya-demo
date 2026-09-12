"use client";

import { useParams } from "next/navigation";
import { RequestSummary } from "@/components/RequestSummary";

export default function RequestPage() {
  const params = useParams<{ id: string }>();
  return <RequestSummary requestCode={decodeURIComponent(params.id)} />;
}
