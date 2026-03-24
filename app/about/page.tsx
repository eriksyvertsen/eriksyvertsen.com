import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div>
      <div style={{ padding: "calc(var(--unit) * 12) 0 calc(var(--unit) * 6)" }}>
        <h1>About</h1>
      </div>

      <div className="article-body">
        <p>
          I serve as Chief Legal Officer and head of Customer Relations at{" "}
          <a href="https://www.angellist.com" target="_blank" rel="noopener noreferrer">
            AngelList
          </a>
          , where we build infrastructure for private markets&mdash;over $170B
          in assets across 25,000+ funds and SPVs. My work sits at the intersection
          of law, finance, and technology: designing scalable legal frameworks,
          launching new capital products, and rethinking how operational and post-sales
          teams function.
        </p>

        <p>
          I sit on the Board of Directors of Belltower Fund Group and Republic,
          and lecture on entrepreneurial finance at Columbia Business School. Before
          AngelList, I was a partner at Olshan Frome Wolosky in New York, building
          the firm&apos;s Venture Capital and Emerging Company Practice.
        </p>

        <h2>Background</h2>
        <p>
          MBA from Columbia Business School. JD, cum laude, from Benjamin N. Cardozo
          School of Law. Before law, I worked as a software engineer building
          distributed systems&mdash;a foundation that shapes how I approach legal
          problems today.
        </p>

        <h2>Mountains</h2>
        <p>
          I ski mountaineer. The overlap between route-finding in variable
          conditions and navigating complex regulatory terrain is not a metaphor
          I force&mdash;it&apos;s just how my brain works. Both require reading
          systems, committing to a line, and staying alert for the moment when the
          line stops working.
        </p>

        <h2>This Site</h2>
        <p>
          A place to collect writing on legal engineering, apps I vibe code,
          foundational ideas I return to, and trip reports from the mountains.
          The{" "}
          <a href="/librarian">Librarian</a>{" "}
          is an AI interface to my knowledge graph&mdash;a Roam Research database
          spanning venture capital, regulation, psychology, philosophy, and
          organizational behavior.
        </p>
      </div>
    </div>
  );
}
