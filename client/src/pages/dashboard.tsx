import { useQuery } from "@tanstack/react-query";
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
  
  // Calculate days remaining until wedding
  const calculateDaysRemaining = () => {
    if (!weddingDetails?.weddingDate) return 0;
    const weddingDate = new Date(weddingDetails.weddingDate);
    const today = new Date();
    const timeDiff = weddingDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return Math.max(0, daysRemaining);
  };

  // Calculate progress based on completed tasks and other factors
  const calculateProgress = () => {
    const daysRemaining = calculateDaysRemaining();
    if (daysRemaining <= 0) return 100;
    if (daysRemaining > 365) return 10;
    
    // Simple progress calculation: more progress as wedding date approaches
    const maxDays = 365;
    const progress = Math.min(90, ((maxDays - daysRemaining) / maxDays) * 100);
    return Math.max(10, progress);
  };

  const daysRemaining = calculateDaysRemaining();
  const progress = calculateProgress();

  return (
    <div className="bg-gradient-to-r from-pastel-green-100 to-white rounded-soft p-8 mb-8 shadow-gentle">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold text-gray-800 mb-2">
            Welcome back, {weddingDetails?.bride || 'Bride'} & {weddingDetails?.groom || 'Groom'}!
          </h2>
          <p className="text-gray-600 text-lg">
            {daysRemaining > 0 
              ? <>Your wedding is in <span className="font-semibold text-pastel-green-600">{daysRemaining} day{daysRemaining === 1 ? '' : 's'}</span></>
              : weddingDetails?.weddingDate 
                ? 'Congratulations on your wedding day!' 
                : 'Set your wedding date to see countdown!'
            }
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Overall Progress</span>
                <span className="text-sm font-semibold text-pastel-green-600">{Math.round(progress)}%</span>
              </div>
              <Link href="/timeline">
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>View Timeline</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
            <div className="w-64">
              <Progress value={progress} className="h-3" />
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
            alt="Wedding planning materials and notebooks"
            className="rounded-soft shadow-soft w-64 h-40 object-cover"
          />
        </div>
      </div>
    </div>
  );
}

function QuickStats() {
  const { data: guests = [] } = useQuery<Guest[]>({
    queryKey: ["/api/guests"],
  });

  const { data: budgetCategories = [] } = useQuery<BudgetCategory[]>({
    queryKey: ["/api/budget-categories"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: vendors = [] } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors"],
  });

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
      color: "bg-pastel-green-100 text-pastel-green-600",
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
      color: "bg-pastel-green-100 text-pastel-green-600",
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
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isTasksCard = stat.title === "Tasks Complete";
        
        if (isTasksCard) {
          return (
            <Link key={stat.title} href="/timeline">
              <Card className="hover-lift cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-heading font-bold text-gray-800">{stat.value}</p>
                      <p className="text-xs text-gray-600">{stat.subtitle}</p>
                    </div>
                    <div className={`p-3 rounded-gentle ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        }
        
        return (
          <Card key={stat.title} className="hover-lift cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-heading font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-gentle ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function RecentGuests() {
  const { data: guests = [] } = useQuery<Guest[]>({
    queryKey: ["/api/guests"],
  });

  const recentGuests = guests.slice(-5);

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-xl font-heading">Recent Guests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentGuests.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No guests added yet</p>
        ) : (
          recentGuests.map((guest) => (
            <div key={guest.id} className="flex items-center justify-between p-3 bg-pastel-green-50 rounded-gentle">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-pastel-green-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-pastel-green-700">
                    {guest.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{guest.name}</p>
                  <p className="text-xs text-gray-600">
                    {guest.rsvpStatus} {guest.plusOne ? "• +1" : ""}
                  </p>
                </div>
              </div>
              <Badge 
                variant={guest.rsvpStatus === "confirmed" ? "default" : "secondary"}
                className={guest.rsvpStatus === "confirmed" ? "bg-pastel-green-200 text-pastel-green-700" : ""}
              >
                {guest.rsvpStatus}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function UpcomingTasks() {
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const upcomingTasks = tasks
    .filter(t => t.status !== "completed")
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-pastel-green-400";
      case "in-progress": return "bg-yellow-400";
      default: return "bg-gray-300";
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-xl font-heading">Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No tasks scheduled</p>
        ) : (
          upcomingTasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-800">{task.title}</p>
                  <span className="text-xs text-gray-600 capitalize">{task.status}</span>
                </div>
                <p className="text-xs text-gray-600">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div>
      <WelcomeBanner />
      <QuickStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentGuests />
        <UpcomingTasks />
      </div>
    </div>
  );
}
