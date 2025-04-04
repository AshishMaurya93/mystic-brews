import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🌱Mystic Brews🧪',
  description: 'Created by Ashish',
  keywords: 'Potion, Game, Mystic, Brews',
  generator: 'Ashish',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
