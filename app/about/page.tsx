import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div>
      <h1>About</h1>

      <div style={{ height: "calc(var(--unit) * 4)" }} />

      <p>
        I&apos;m Chief Legal Officer at a fintech company, focused on building
        scalable legal and compliance frameworks that enable rapid growth while
        managing regulatory risk.
      </p>

      <h2>Legal Engineering</h2>
      <p>
        My work sits at the intersection of law and technology. I build systems
        for contract automation, compliance monitoring, regulatory reporting, and
        risk assessment. The goal is to make legal operations as precise and
        scalable as software engineering.
      </p>

      <h2>Technical Background</h2>
      <p>
        Before law, I worked as a software engineer building distributed
        systems. This technical foundation informs how I approach legal
        problems&mdash;with systematic thinking, automation, and a focus on
        scalable solutions.
      </p>

      <h2>Mountains</h2>
      <p>
        Ski mountaineering provides perspective and teaches risk management
        skills that translate directly to legal practice. Both require careful
        assessment of complex systems, understanding interdependencies, and
        making decisions with incomplete information.
      </p>

      <h2>Writing</h2>
      <p>
        I write about legal engineering, technical explorations of low-level
        systems, personal reflections, and mountain adventures. The common thread
        is systematic thinking applied to complex problems.
      </p>
    </div>
  );
}
