import { Link } from "wouter";
import { Home, Users, DollarSign, Building, Briefcase, Shirt } from "lucide-react";

interface MobileNavProps {
  currentPath: string;
}

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Guests", href: "/guests", icon: Users },
  { name: "Budget", href: "/budget", icon: DollarSign },
  { name: "Venues", href: "/venues", icon: Building },
  { name: "Services", href: "/services", icon: Briefcase },
];

export default function MobileNav({ currentPath }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
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
      </div>
    </nav>
  );
}
