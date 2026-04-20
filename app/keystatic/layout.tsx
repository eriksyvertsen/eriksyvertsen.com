import KeystaticReorderLink from "@/components/KeystaticReorderLink";

export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <KeystaticReorderLink />
      </body>
    </html>
  );
}
