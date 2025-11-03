import Link from 'next/link'
import type { Metadata } from 'next'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: '404 - Page Not Found | SnapAsset AI',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="space-y-6">
          {/* 404 Illustration */}
          <div className="relative">
            <h1 className="text-[150px] md:text-[200px] font-bold text-primary/10 leading-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/80 backdrop-blur-sm px-8 py-4 rounded-lg">
                <p className="text-2xl md:text-3xl font-semibold text-foreground">
                  Page Not Found
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">
              Sorry, we couldn't find the page you're looking for.
            </p>
            <p className="text-sm text-muted-foreground">
              The page may have been moved, deleted, or never existed.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-w-[200px]">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>

          {/* Help Text */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground">
              If you think this is a mistake, please{' '}
              <Link href="/contact" className="text-primary hover:underline">
                contact support
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
