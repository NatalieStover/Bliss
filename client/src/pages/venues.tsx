import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building, Plus, Edit, Trash2, Phone, Mail, Globe, MapPin } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import VenueForm from "@/components/venue-form";
import type { Venue } from "@shared/schema";

export default function Venues() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: venues = [], isLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const deleteVenueMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/venues/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/venues"] });
      toast({
        title: "Success",
        description: "Venue deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete venue",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "booked":
        return <Badge className="bg-pastel-green-200 text-pastel-green-700">Booked</Badge>;
      case "visited":
        return <Badge variant="secondary">Visited</Badge>;
      case "not-available":
        return <Badge variant="destructive">Not Available</Badge>;
      default:
        return <Badge className="bg-yellow-200 text-yellow-700">Considering</Badge>;
    }
  };

  const handleEditVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsFormOpen(true);
  };

  const handleAddVenue = () => {
    setSelectedVenue(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedVenue(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold text-gray-800">Venues</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-soft mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-gray-800">Venues</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddVenue}
              className="bg-blue-400 hover:bg-blue-500 text-white rounded-soft"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Venue
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedVenue ? "Edit Venue" : "Add New Venue"}</DialogTitle>
            </DialogHeader>
            <VenueForm venue={selectedVenue} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Venues Grid */}
      {venues.length === 0 ? (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-heading text-gray-600 mb-2">No Venues Yet</h2>
          <p className="text-gray-500 mb-4">
            Start adding venues you're considering for your wedding
          </p>
          <Button
            onClick={handleAddVenue}
            className="bg-blue-400 hover:bg-blue-500 text-white rounded-soft"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Venue
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id} className="hover-lift overflow-hidden">
              <div className="relative">
                {venue.photos && venue.photos.length > 0 ? (
                  <img
                    src={venue.photos[0]}
                    alt={venue.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Building className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(venue.status)}
                </div>
                <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-sm font-medium text-gray-800">
                  {venue.name}
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  {venue.address && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">{venue.address}</span>
                    </div>
                  )}
                  
                  {venue.capacity && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Capacity:</span> {venue.capacity} guests
                    </div>
                  )}
                  
                  {venue.price && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Price:</span> ${parseFloat(venue.price).toLocaleString()}
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    {venue.phone && (
                      <Button variant="ghost" size="sm" className="p-1">
                        <Phone className="w-4 h-4" />
                      </Button>
                    )}
                    {venue.email && (
                      <Button variant="ghost" size="sm" className="p-1">
                        <Mail className="w-4 h-4" />
                      </Button>
                    )}
                    {venue.website && (
                      <Button variant="ghost" size="sm" className="p-1">
                        <Globe className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="flex-1"></div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditVenue(venue)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteVenueMutation.mutate(venue.id)}
                      disabled={deleteVenueMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {venue.notes && (
                    <p className="text-xs text-gray-500 pt-2 border-t">
                      {venue.notes.length > 100 ? `${venue.notes.slice(0, 100)}...` : venue.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
