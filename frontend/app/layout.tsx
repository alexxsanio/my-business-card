import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <Script
          src="/opencv.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}