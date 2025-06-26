import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Heart, Menu, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getWeddingDetails } from "@/lib/storage";
import MobileNav from "./mobile-nav";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "Guests", href: "/guests" },
  { name: "Budget", href: "/budget" },
  { name: "Venues", href: "/venues" },
  { name: "Flowers", href: "/flowers" },
  { name: "Dresses", href: "/dresses" },
  { name: "Timeline", href: "/timeline" },
  { name: "Vendors", href: "/vendors" },
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-pastel-green-50">
      {/* Header */}
      <header className="bg-white shadow-gentle sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-3">
              <div className="bg-pastel-green-200 p-1.5 rounded-soft">
                <Heart className="w-5 h-5 text-pastel-green-600" />
              </div>
              <h1 className="text-lg font-inter font-medium text-gray-800">
                Blissful Planner
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`text-sm font-inter font-medium transition-colors ${
                      location === item.href
                        ? "text-pastel-green-600"
                        : "text-gray-600 hover:text-pastel-green-600"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <Button variant="secondary" className="bg-pastel-green-200 hover:bg-pastel-green-300 text-pastel-green-700 rounded-soft text-sm px-3 py-1.5 h-auto">
                {(() => {
                  const weddingDetails = getWeddingDetails();
                  if (weddingDetails) {
                    return `${weddingDetails.bride} & ${weddingDetails.groom}`;
                  }
                  return "Wedding Couple";
                })()}
              </Button>

              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span
                          className={`block px-3 py-2 rounded-soft text-base font-medium transition-colors ${
                            location === item.href
                              ? "bg-pastel-green-100 text-pastel-green-600"
                              : "text-gray-600 hover:bg-pastel-green-50 hover:text-pastel-green-600"
                          }`}
                        >
                          {item.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {children}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          className="bg-pastel-green-400 hover:bg-pastel-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover-lift"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      <MobileNav currentPath={location} />
    </div>
  );
}
