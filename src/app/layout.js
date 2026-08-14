import "./globals.css";

export const metadata = {
  title: "Midnight Radio — Nostalgic Community Radio Station",
  description:
    "Tune into the vibe. Listen to curated music and drop your midnight thoughts. A cinematic, community-driven radio station.",
  keywords: [
    "midnight radio",
    "community radio",
    "shayari",
    "midnight thoughts",
    "nostalgic music",
    "lo-fi",
    "bollywood classics",
  ],
  openGraph: {
    title: "Midnight Radio",
    description: "Tune into the vibe. Listen to curated music and drop your midnight thoughts.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f0f1a" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
