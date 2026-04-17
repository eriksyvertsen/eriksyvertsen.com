import type { Metadata } from "next";
import { getBooksGrouped } from "@/lib/content";
import ReadingList from "@/components/ReadingList";

export const metadata: Metadata = { title: "Reading" };

export default function ReadingPage() {
  const groups = getBooksGrouped();
  return <ReadingList groups={groups} />;
}
