import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Home'
}

export default function HomePageEn() {
  return (
    <div className="not-prose mx-auto flex max-w-2xl flex-col items-start gap-6 py-12">
      <h1 className="text-4xl font-bold">Personal Blog</h1>
      <p className="text-lg text-muted-foreground">
        Notes and learnings about programming, published as I learn.
      </p>
      <div className="flex gap-3">
        <Button render={<Link href="/en/posts/">View posts</Link>} />
        <Button
          variant="outline"
          render={<Link href="/en/about/">About</Link>}
        />
      </div>
    </div>
  )
}
