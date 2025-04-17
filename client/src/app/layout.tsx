import type { Metadata } from "next";
import "./globals.css";

import StoreProvider from "@/lib/scripts/store/store-provider";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Toaster } from "react-hot-toast";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Todo List",
  description: "Todo List",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Toaster position="top-center" reverseOrder={false} gutter={8} />
          <main className="p-4 min-h-screen">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
