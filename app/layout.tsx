import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DM Blacklist — Report Toxic Dungeon Masters',
  description:
    'A community-driven platform for tabletop RPG players to report and search for toxic Dungeon Masters. Protect your party from bad DMs.',
  keywords: [
    'D&D',
    'Dungeon Master',
    'blacklist',
    'tabletop RPG',
    'toxic DM',
    'TTRPG',
    'player safety',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
