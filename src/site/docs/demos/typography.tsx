import { Typography, TypographyKicker } from "@/serigraph/ui/typography"
import { DemoSection, type DemoMeta } from "../demo-kit"

export const meta: DemoMeta = {
  title: "Typography",
  description:
    "A prose container that typesets plain long-form content, such as an observatory's newsletter or a guide, without a class on every element.",
  item: "typography",
  group: "Data display",
}

const LOG = `2026-11-05  21:42  Saturn   Zeiss 150/2250  ×180  seeing 4/5
2026-11-05  22:10  Titan    Zeiss 150/2250  ×120  seeing 4/5`

export default function TypographyDemo() {
  return (
    <DemoSection title="A note from the dome">
      <Typography dropCap>
        <TypographyKicker>
          From the dome · Monday 2 November 2026
        </TypographyKicker>
        <h2>Saturn’s rings open wide for opposition</h2>
        <p>
          Saturn reaches opposition on Thursday, and for the first time in three
          years its rings tilt far enough toward us to show the Cassini Division
          in a small telescope. Henrietta Leavitt had the Zeiss refractor out on
          the deck on Saturday night; at 180 times the gap between the rings was
          a clean black line, and Titan sat just off the ring tips like a full
          stop.
        </p>
        <p>
          The talk on Thursday is nearly full, but the refractor takes ten
          people every half hour until the clouds come in.{" "}
          <a href="#book">Book a slot at the eyepiece</a>; bring a coat, the
          deck is cold by nine.
        </p>
        <h3>New on the deck this month</h3>
        <ul>
          <li>A 300 mm Dobsonian for galaxies and clusters</li>
          <li>
            Red torches at the door
            <ul>
              <li>Please keep phones on night mode once the shutter opens</li>
            </ul>
          </li>
          <li>A heated bench by the refractor, for the long waits</li>
        </ul>
        <blockquote>
          Look at the planet for a full minute before you decide what you see.
          The air steadies in moments, and the rings arrive all at once.
        </blockquote>
        <h3>Where to look on Thursday</h3>
        <table>
          <thead>
            <tr>
              <th>Object</th>
              <th>Where</th>
              <th data-figure>Best</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Saturn</td>
              <td>South-east</td>
              <td data-figure>19:00–23:30</td>
            </tr>
            <tr>
              <td>Andromeda</td>
              <td>Overhead</td>
              <td data-figure>20:00–</td>
            </tr>
            <tr>
              <td>Pleiades</td>
              <td>East</td>
              <td data-figure>21:00–</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <h4>Before the doors open on Thursday</h4>
        <ol>
          <li>Open the dome shutter at 17:45 so the mirror can cool.</li>
          <li>
            Mark seats held by phone with <code>hold:thu</code> in the booking
            sheet so they free up on Friday.
          </li>
          <li>Log each session at the refractor in the usual form:</li>
        </ol>
        <pre>
          <code>{LOG}</code>
        </pre>
      </Typography>
    </DemoSection>
  )
}
