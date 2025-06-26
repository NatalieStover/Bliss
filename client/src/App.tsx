import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Guests from "@/pages/guests";
import Budget from "@/pages/budget";
import Venues from "@/pages/venues";
import Flowers from "@/pages/flowers";
import Dresses from "@/pages/dresses";
import Timeline from "@/pages/timeline";
import Vendors from "@/pages/vendors";
import Layout from "@/components/layout";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/guests" component={Guests} />
        <Route path="/budget" component={Budget} />
        <Route path="/venues" component={Venues} />
        <Route path="/flowers" component={Flowers} />
        <Route path="/dresses" component={Dresses} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/vendors" component={Vendors} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
