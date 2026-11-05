import "./globals.css";

export const metadata = {
  title: "Abhinav Kumar Singh — AI Digital Twin & Portfolio",
  description:
    "Interactive AI agent trained on Abhinav Kumar Singh's technical projects, EasyInsights internship experience, and full-stack engineering background.",
  icons: {
    icon: "/profile.jpg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0d1117",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
        />
        <meta name="theme-color" content="#0d1117" />
      </head>
      <body>{children}</body>
    </html>
  );
}
