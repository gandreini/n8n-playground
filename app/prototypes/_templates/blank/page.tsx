"use client"

export default function BlankPrototype() {
  return (
    <div className="wrap">
      <h1>New Prototype</h1>
      <p>Start building here.</p>

      <style jsx>{`
        .wrap {
          padding: var(--spacing--xl);
        }
        h1 {
          font-size: var(--font-size--2xl);
          font-weight: var(--font-weight--bold);
          color: var(--color--text--shade-1);
        }
        p {
          margin-top: var(--spacing--2xs);
          color: var(--color--text);
        }
      `}</style>
    </div>
  )
}
