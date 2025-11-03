import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SnapAsset AI - AI-Powered Home Inventory',
    template: '%s | SnapAsset AI',
  },
  description: 'Never lose money on insurance claims. HomeGuard uses AI to scan, document, and value your belongings. Get instant valuations and insurance-ready reports.',
  keywords: ['home inventory', 'insurance claims', 'AI valuation', 'asset management', 'HomeGuard'],
  authors: [{ name: 'SnapAsset AI' }],
  creator: 'SnapAsset AI',
  publisher: 'SnapAsset AI',
  metadataBase: new URL('https://snapassetai.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://snapassetai.com',
    siteName: 'HomeGuard',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SnapAsset AI - AI-Powered Home Inventory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
