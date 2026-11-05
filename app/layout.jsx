import "./globals.css";

export const metadata = {
  title: "Abhinav Kumar Singh — AI Digital Twin & Portfolio",
  description: "Interactive AI agent trained on Abhinav Kumar Singh's technical projects, EasyInsights internship experience, and full-stack engineering background.",
  icons: {
    icon: "/profile.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
