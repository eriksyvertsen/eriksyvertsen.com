import { notFound } from "next/navigation";
import { isSectionEnabled } from "@/lib/site-config";

export default function ReadingLayout({ children }: { children: React.ReactNode }) {
  if (!isSectionEnabled("reading")) notFound();
  return <>{children}</>;
}
