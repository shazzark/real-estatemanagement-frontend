import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next"
import "./_styles/global.css";
import { ToastProvider } from "./_lib/toastProvider";
import { AuthProvider } from "./context/authContext";
import Providers from "./provider";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata = {
  title: "Luxe Estates - Premium Real Estate",
  description:
    "Discover your dream home with Luxe Estates. Browse premium properties and find your perfect match today.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </Providers>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
