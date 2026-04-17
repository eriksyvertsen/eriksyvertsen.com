import { notFound } from "next/navigation";
import { isSectionEnabled } from "@/lib/site-config";

export default function KernelsLayout({ children }: { children: React.ReactNode }) {
  if (!isSectionEnabled("kernels")) notFound();
  return <>{children}</>;
}
