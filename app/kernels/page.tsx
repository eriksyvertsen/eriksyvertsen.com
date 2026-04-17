import type { Metadata } from "next";
import { getKernelThemes } from "@/lib/content";
import KernelsList from "@/components/KernelsList";

export const metadata: Metadata = { title: "Kernels" };

export default function KernelsPage() {
  const themes = getKernelThemes();
  return <KernelsList themes={themes} />;
}
