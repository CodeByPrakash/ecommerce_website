import "./globals.css";
import NavRight from "@/components/NavRight";
import BottomBackButton from "@/components/BottomBackButton";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#F7F8FA] text-[#0E1116] selection:bg-blue-200">

        <AuthProvider>
        <CartProvider>

        {/* ░░ Modern Clean Navbar ░░ */}
          <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/80 border-b border-black/5 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

              {/* Logo */}
              <a 
                href="/" 
                className="text-xl font-bold tracking-tight flex items-center gap-1 hover:opacity-80 transition"
              >
                E-<span className="text-blue-500 font-extrabold">Commerce</span>
              </a>

              {/* Futuristic Navigation Bar */}
              <nav className="flex items-center gap-6 text-[15px] font-medium select-none">

                {/* Profile / Auth */}
                <NavRight />   {/* ← FIXED */}

                {/* Cart */}
                <a href="/cart" className="
                    relative px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                    shadow-lg hover:shadow-blue-300/40 hover:scale-[1.05] transition-all active:scale-95
                  ">
                  Cart 🛒
                  <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full 
                    bg-emerald-400 text-black text-xs font-bold flex items-center justify-center shadow-md">
                    {}
                  </span>
                </a>

              </nav>


            </div>
          </header>
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>

        <BottomBackButton />
        
        </CartProvider>
        </AuthProvider>

      </body>
    </html>
  );
}
