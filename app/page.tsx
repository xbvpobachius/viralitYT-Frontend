import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Viralit-YT</h1>
          <Link href="/onboarding" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold tracking-tight">
              Multi-Account YouTube Shorts Publisher
            </h2>
            <p className="text-xl text-muted-foreground">
              Publish 2 Shorts/day per channel across 30-50 YouTube channels.
              Intelligent quota rotation. Fully automated.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/onboarding" className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-lg font-medium hover:bg-primary/90">
              Start Publishing
            </Link>
            <Link href="/dashboard" className="border border-input px-6 py-3 rounded-md text-lg font-medium hover:bg-accent">
              View Dashboard
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Multi-Account</h3>
              <p className="text-muted-foreground">
                Manage 30-50 YouTube channels from one dashboard
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Smart Rotation</h3>
              <p className="text-muted-foreground">
                Never hit daily API quota limits
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-bold mb-2">Automated</h3>
              <p className="text-muted-foreground">
                Set it and forget it - 2 posts per day
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Viralit-YT © 2025. Built with Next.js, FastAPI, and YouTube Data API v3.</p>
        </div>
      </footer>
    </div>
  )
}

