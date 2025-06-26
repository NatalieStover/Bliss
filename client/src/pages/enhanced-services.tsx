import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ServiceForm from "@/components/service-form";
import { getServices, deleteService } from "@/lib/storage";
import type { Flower as ServiceType } from "@shared/schema";

export default function Services() {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    setServices(getServices());
  };

  const handleDeleteService = (id: number) => {
    const success = deleteService(id);
    if (success) {
      loadServices();
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    } else {
      toast({
        title: "Error", 
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const handleEditService = (service: ServiceType) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedService(null);
    loadServices();
  };

  const handlePhoneCall = (phone: string) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleEmail = (email: string) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked": return "bg-green-100 text-green-800";
      case "paid": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-purple-100 text-purple-800";
      case "contacted": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceTypeDisplay = (type: string) => {
    const typeMap: { [key: string]: string } = {
      photography: "Photography",
      videography: "Videography", 
      hair: "Hair Styling",
      makeup: "Makeup",
      flowers: "Flowers & Florals",
      music: "Music & DJ",
      catering: "Catering",
      transportation: "Transportation",
      decoration: "Decoration",
      other: "Other"
    };
    return typeMap[type] || type;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wedding Services</h1>
          <p className="text-gray-600 mt-2">Manage your wedding service providers</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setSelectedService(null)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <ServiceForm 
              service={selectedService} 
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
              <p className="text-gray-500 mb-4">Add your first wedding service to get started</p>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => setSelectedService(null)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Service</DialogTitle>
                  </DialogHeader>
                  <ServiceForm onSuccess={handleFormSuccess} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {service.name}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {getServiceTypeDisplay(service.type)}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(service.status)}`}>
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditService(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {service.florist && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Provider</p>
                    <p className="text-sm text-gray-600">{service.florist}</p>
                  </div>
                )}
                
                {service.price && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Price</p>
                    <p className="text-sm text-gray-600">{service.price}</p>
                  </div>
                )}

                {service.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Description</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                  </div>
                )}

                {service.photos && service.photos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Photos</p>
                    <div className="grid grid-cols-3 gap-1">
                      {service.photos.slice(0, 3).map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Service photo ${index + 1}`}
                          className="w-full h-16 object-cover rounded border"
                        />
                      ))}
                      {service.photos.length > 3 && (
                        <div className="w-full h-16 bg-gray-100 rounded border flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            +{service.photos.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {service.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Notes</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{service.notes}</p>
                    
                    {/* Extract contact info from notes for phone/email buttons */}
                    <div className="flex gap-2 mt-2">
                      {service.notes.includes('@') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const emailMatch = service.notes?.match(/[\w.-]+@[\w.-]+\.\w+/);
                            if (emailMatch) handleEmail(emailMatch[0]);
                          }}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                      )}
                      {service.notes.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const phoneMatch = service.notes?.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
                            if (phoneMatch) handlePhoneCall(phoneMatch[0]);
                          }}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}