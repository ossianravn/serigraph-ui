import { drawing } from "@/serigraph/follies"

// The Press's neighbouring seeds: the object drawn from the next four seeds, each a button that draws it large.
export function Neighbours(props: {
  object: string
  seed: string
  pick: (seed: string) => void
}) {
  const { object, seed, pick } = props
  const seeds = [1, 2, 3, 4].map((i) => `${seed}-${i}`)
  return (
    <section className="press-neighbours" aria-labelledby="press-near">
      <h2 className="caps press-near-title" id="press-near">
        Neighbouring seeds
      </h2>
      <ul className="press-near">
        {seeds.map((s) => (
          <li key={s}>
            <button
              type="button"
              className="press-near-button"
              onClick={() => pick(s)}
            >
              <span
                className="folly press-near-art"
                aria-hidden="true"
                dangerouslySetInnerHTML={{
                  __html: drawing({ object, seed: s }),
                }}
              />
              <span className="press-near-seed">{s}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
