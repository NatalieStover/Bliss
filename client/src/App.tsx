import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
// Removed query client imports since we're using localStorage only
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Guests from "@/pages/guests";
import Budget from "@/pages/budget";
import Venues from "@/pages/venues";
import Services from "@/pages/enhanced-services";
import Dresses from "@/pages/dresses";
import Timeline from "@/pages/timeline";
import Vendors from "@/pages/vendors";
import Setup from "@/pages/setup";
import Layout from "@/components/layout";
import { getWeddingDetails, saveWeddingDetails, initializeDefaultData, type WeddingDetails } from "@/lib/storage";
import { InstallPrompt } from "./components/install-prompt";

function AppRouter() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/guests" component={Guests} />
        <Route path="/budget" component={Budget} />
        <Route path="/venues" component={Venues} />
        <Route path="/services" component={Services} />
        <Route path="/dresses" component={Dresses} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/vendors" component={Vendors} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const weddingDetails = getWeddingDetails();
    setIsSetupComplete(!!weddingDetails);

    // Initialize default data on first load
    initializeDefaultData();

    setIsLoading(false);
  }, []);

  const handleSetupComplete = (details: WeddingDetails) => {
    saveWeddingDetails(details);
    setIsSetupComplete(true);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-pastel-green-50 flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>;
  }

  return (
    <TooltipProvider>
      <Toaster />
      {!isSetupComplete ? (
        <Setup onComplete={handleSetupComplete} />
      ) : (
        <AppRouter />
      )}
      <InstallPrompt />
    </TooltipProvider>
  );
}

export default App;