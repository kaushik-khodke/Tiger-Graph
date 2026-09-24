import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sentinel AI — Autonomous Fraud Investigation & Next-Best-Action Platform',
  description: 'Enterprise AI Agent for Fraud Investigation powered by TigerGraph, GraphRAG, and LangGraph. Detects fraud patterns, assesses uncertainty, and executes policy-compliant next-best-actions.',
  keywords: ['TigerGraph', 'Fraud Investigation', 'GraphRAG', 'LangGraph', 'AI Agent', 'Next-Best-Action', 'FinTech', 'Cyber Security'],
  authors: [{ name: 'Sentinel AI Team' }],
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#080b11',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
