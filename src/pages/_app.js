// pages/_app.js
import "@/styles/globals.css";
import AppShell from "@/components/app-shell";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const inter = Inter({ subsets: ["latin"] });

export default function App({ session, Component, pageProps }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <AppShell>
            <main className={inter.className}>
              <Component {...pageProps} />
            </main>
            <Toaster richColors position="top-right" />
          </AppShell>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
