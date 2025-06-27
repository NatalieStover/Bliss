import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Wrench } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import FlowerForm from "@/components/flower-form";
import type { Flower as ServiceType } from "@shared/schema";

export default function Services() {
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services = [], isLoading } = useQuery<ServiceType[]>({
    queryKey: ["/api/flowers"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/flowers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flowers"] });
      toast({
        title: "Success",
        description: "Service deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to delete service",
        variant: "destructive",
      });
    },
  });

  const handleEditService = (service: ServiceType) => {
    setSelectedService(service);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedService(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Wedding Services</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Wedding Services</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedService(null);
                setIsFormOpen(true);
              }}
              className="bg-pastel-green-400 hover:bg-pastel-green-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedService ? "Edit Wedding Service" : "Add New Wedding Service"}
              </DialogTitle>
            </DialogHeader>
            <FlowerForm flower={selectedService} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Wrench className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No wedding services yet</h3>
            <p className="text-gray-600 mb-4">Start organizing your wedding services like flowers, decorations, music, and more.</p>
            <Button
              onClick={() => {
                setSelectedService(null);
                setIsFormOpen(true);
              }}
              className="bg-pastel-green-400 hover:bg-pastel-green-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <p className="text-sm text-gray-600">{service.type}</p>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {service.description && (
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                )}
                
                {service.florist && (
                  <div className="text-sm mb-2">
                    <span className="font-medium">Provider:</span> {service.florist}
                  </div>
                )}
                
                {service.price && (
                  <div className="text-sm mb-3">
                    <span className="font-medium">Price:</span> ${service.price}
                  </div>
                )}

                {service.photos && service.photos.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Photos:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {service.photos.slice(0, 4).map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`${service.name} photo ${index + 1}`}
                          className="w-full h-16 object-cover rounded border"
                          onError={(e) => {
                            console.error('Image failed to load:', photo);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                    {service.photos.length > 4 && (
                      <p className="text-xs text-gray-500 mt-1">
                        +{service.photos.length - 4} more photos
                      </p>
                    )}
                  </div>
                )}

                {service.notes && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {service.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditService(service)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(service.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}