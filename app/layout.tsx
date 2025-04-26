import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TutorialProvider } from "@/contexts/tutorial-context"

const inter = Inter({ subsets: ["latin"] })

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
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem> */}
          <TutorialProvider>{children}</TutorialProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
