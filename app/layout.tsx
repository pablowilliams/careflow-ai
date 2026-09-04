import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareFlow AI | Governed referral coordination",
  description: "A portfolio-grade AWS agentic architecture demonstration using synthetic NHS referral data.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
