import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TutorialProvider } from "@/contexts/tutorial-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mystic Brews - Potion Making Game",
  description: "A magical potion crafting simulation game",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TutorialProvider>{children}</TutorialProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
