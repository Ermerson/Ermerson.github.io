export const metadata = {
  title: 'About'
}

export default function AboutPageEn() {
  return (
    <div className="not-prose mx-auto flex max-w-2xl flex-col gap-4 py-12">
      <h1 className="text-3xl font-bold">About</h1>
      <p>
        This blog collects notes and learnings about programming, written as
        I study new topics.
      </p>
    </div>
  )
}
