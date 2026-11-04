import type { ReactNode } from "react";

export function InfoPage({
  title,
  draft,
  children,
}: {
  title: string;
  draft?: boolean;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
      {draft && (
        <p className="mt-6 rounded-2xl border border-honey bg-accent p-4 text-sm">
          Draft — the business owner must review and finalise this page before launch.
        </p>
      )}
      <div className="mt-8 space-y-4 leading-relaxed text-muted-foreground [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:text-chocolate">
        {children}
      </div>
    </article>
  );
}
