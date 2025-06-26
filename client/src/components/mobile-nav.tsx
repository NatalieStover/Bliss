import { useState } from "react";
import { Link } from "wouter";
import { Home, Users, DollarSign, Building, Briefcase, Menu, Calendar, UserCheck, Shirt } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileNavProps {
  currentPath: string;
}

const primaryNavItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Guests", href: "/guests", icon: Users },
  { name: "Budget", href: "/budget", icon: DollarSign },
  { name: "Venues", href: "/venues", icon: Building },
];

const allNavItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Guests", href: "/guests", icon: Users },
  { name: "Budget", href: "/budget", icon: DollarSign },
  { name: "Venues", href: "/venues", icon: Building },
  { name: "Services", href: "/services", icon: Briefcase },
  { name: "Dresses", href: "/dresses", icon: Shirt },
  { name: "Timeline", href: "/timeline", icon: Calendar },
  { name: "Vendors", href: "/vendors", icon: UserCheck },
];

export default function MobileNav({ currentPath }: MobileNavProps) {
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-2">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex flex-col items-center space-y-1 px-3 py-2 transition-colors ${
                  isActive
                    ? "text-pastel-green-600"
                    : "text-gray-600 hover:text-pastel-green-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.name}</span>
              </div>
            </Link>
          );
        })}
        
        <Sheet open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
          <SheetTrigger asChild>
            <div className="flex flex-col items-center space-y-1 px-3 py-2 text-gray-600 hover:text-pastel-green-600 transition-colors cursor-pointer">
              <Menu className="w-5 h-5" />
              <span className="text-xs">More</span>
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto max-h-[80vh]">
            <div className="py-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">All Sections</h3>
              <div className="grid grid-cols-2 gap-4">
                {allNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.href;
                  
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      onClick={() => setMoreMenuOpen(false)}
                    >
                      <div
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-pastel-green-100 text-pastel-green-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-pastel-green-600"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
