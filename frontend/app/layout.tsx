import "./globals.css";

import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Business Card Scanner",
  description:
    "Capture and upload your business card",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">

      <body>
        {children}
      </body>

    </html>
  );
}