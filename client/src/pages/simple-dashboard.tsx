import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, CheckCircle, Building, Calendar, CalendarDays, ArrowRight } from "lucide-react";
import { getWeddingDetails, getGuests, getBudgetCategories, getTasks, getVendors } from "@/lib/storage";
import type { Guest, BudgetCategory, Task, Vendor } from "@shared/schema";

function WelcomeBanner() {
  const weddingDetails = getWeddingDetails();
  
  const calculateDaysRemaining = () => {
    if (!weddingDetails?.weddingDate) return 0;
    const weddingDate = new Date(weddingDetails.weddingDate);
    const today = new Date();
    const timeDiff = weddingDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Math.max(0, daysRemaining);
  };

  const calculateProgress = () => {
    const tasks = getTasks();
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const daysRemaining = calculateDaysRemaining();
  const progress = calculateProgress();

  return (
    <div className="bg-gradient-to-r from-green-100 to-white rounded-lg p-8 mb-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {weddingDetails?.bride || 'Bride'} & {weddingDetails?.groom || 'Groom'}!
          </h2>
          <p className="text-gray-600 text-lg">
            {daysRemaining > 0 
              ? <>Your wedding is in <span className="font-semibold text-green-600">{daysRemaining} day{daysRemaining === 1 ? '' : 's'}</span></>
              : weddingDetails?.weddingDate 
                ? 'Congratulations on your wedding day!' 
                : 'Set your wedding date to see countdown!'
            }
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Planning Progress</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="w-64" />
            <Link href="/timeline">
              <Button className="mt-4 bg-green-600 hover:bg-green-700">
                View Timeline <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
            alt="Wedding planning materials"
            className="rounded-lg shadow-sm w-64 h-40 object-cover"
          />
        </div>
      </div>
    </div>
  );
}

function QuickStats() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    setGuests(getGuests());
    setBudgetCategories(getBudgetCategories());
    setTasks(getTasks());
    setVendors(getVendors());
  }, []);

  const confirmedGuests = guests.filter(g => g.rsvpStatus === "confirmed").length;
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + parseFloat(cat.budgetAmount), 0);
  const spentBudget = budgetCategories.reduce((sum, cat) => sum + parseFloat(cat.spentAmount), 0);
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const bookedVendors = vendors.filter(v => v.status === "booked").length;

  const stats = [
    {
      title: "Total Guests",
      value: guests.length.toString(),
      subtitle: `${confirmedGuests} confirmed`,
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Budget Used",
      value: `$${spentBudget.toLocaleString()}`,
      subtitle: `$${(totalBudget - spentBudget).toLocaleString()} remaining`,
      icon: DollarSign,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Tasks Complete",
      value: `${completedTasks}/${tasks.length}`,
      subtitle: `${Math.round((completedTasks / Math.max(tasks.length, 1)) * 100)}% complete`,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Vendors Booked",
      value: `${bookedVendors}/${vendors.length}`,
      subtitle: `${vendors.length - bookedVendors} pending`,
      icon: Building,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function QuickActions() {
  const actions = [
    { title: "Add Guest", href: "/guests", icon: Users, description: "Manage your guest list" },
    { title: "Plan Budget", href: "/budget", icon: DollarSign, description: "Track wedding expenses" },
    { title: "Find Venues", href: "/venues", icon: Building, description: "Browse wedding venues" },
    { title: "View Timeline", href: "/timeline", icon: Calendar, description: "Check your tasks" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {actions.map((action, index) => (
        <Link key={index} href={action.href}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <action.icon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <WelcomeBanner />
      <QuickStats />
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <QuickActions />
      </div>
    </div>
  );
}