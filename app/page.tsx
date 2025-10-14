import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b/0">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-red-600 drop-shadow-[0_0_15px_hsla(0,92%,62%,0.6)]">
            ViralitYT
          </h1>
          <Link href="/onboarding" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md hover:bg-primary/90 shadow-[0_0_20px_hsla(0,92%,62%,0.45)]">
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-[0_0_30px_hsla(0,92%,62%,0.35)]">
              Automate YouTube Shorts at Scale
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              ViralitYT programa y publica Shorts en múltiples canales con rotación inteligente de cuota.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/onboarding" className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-lg font-medium hover:bg-primary/90 shadow-[0_0_20px_hsla(0,92%,62%,0.45)]">
              Start Publishing
            </Link>
            <Link href="/dashboard" className="border border-input/50 bg-secondary/40 backdrop-blur px-6 py-3 rounded-md text-lg font-medium hover:bg-secondary/60">
              View Dashboard
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 border border-border/40 bg-card/40 backdrop-blur rounded-lg">
              <h3 className="text-xl font-bold mb-2">Multi-Account</h3>
              <p className="text-muted-foreground">
                Manage 30-50 YouTube channels from one dashboard
              </p>
            </div>

            <div className="p-6 border border-border/40 bg-card/40 backdrop-blur rounded-lg">
              <h3 className="text-xl font-bold mb-2">Smart Rotation</h3>
              <p className="text-muted-foreground">
                Never hit daily API quota limits
              </p>
            </div>

            <div className="p-6 border border-border/40 bg-card/40 backdrop-blur rounded-lg">
              <h3 className="text-xl font-bold mb-2">Automated</h3>
              <p className="text-muted-foreground">
                Set it and forget it - 2 posts per day
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t/0 py-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>ViralitYT © 2025. Built with Next.js, FastAPI, and YouTube Data API v3.</p>
        </div>
      </footer>
    </div>
  )
}

