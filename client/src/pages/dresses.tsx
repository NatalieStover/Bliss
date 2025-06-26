import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shirt, Plus, Edit, Trash2, Search, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DressForm from "@/components/dress-form";
import type { Dress } from "@shared/schema";

export default function Dresses() {
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dresses = [], isLoading } = useQuery<Dress[]>({
    queryKey: ["/api/dresses"],
  });

  const deleteDressMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/dresses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dresses"] });
      toast({
        title: "Success",
        description: "Dress deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete dress",
        variant: "destructive",
      });
    },
  });

  const filteredDresses = dresses.filter(dress => {
    const matchesSearch = dress.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dress.designer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dress.style?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || dress.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selected":
        return <Badge className="bg-pastel-green-200 text-pastel-green-700">Selected</Badge>;
      case "trying-on":
        return <Badge className="bg-yellow-200 text-yellow-700">Trying On</Badge>;
      case "considered":
        return <Badge variant="secondary">Considered</Badge>;
      default:
        return <Badge className="bg-blue-200 text-blue-700">Considering</Badge>;
    }
  };

  const handleEditDress = (dress: Dress) => {
    setSelectedDress(dress);
    setIsFormOpen(true);
  };

  const handleAddDress = () => {
    setSelectedDress(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedDress(null);
  };

  const getNextFittingDate = () => {
    const selectedDress = dresses.find(d => d.status === "selected");
    if (selectedDress?.fittingDates && selectedDress.fittingDates.length > 0) {
      const futureDates = selectedDress.fittingDates
        .map(date => new Date(date))
        .filter(date => date > new Date())
        .sort((a, b) => a.getTime() - b.getTime());
      return futureDates.length > 0 ? futureDates[0] : null;
    }
    return null;
  };

  const nextFitting = getNextFittingDate();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold text-gray-800">Dress Collection</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-soft mb-4"></div>
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
        <h1 className="text-3xl font-heading font-bold text-gray-800">Dress Collection</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddDress}
              className="bg-indigo-400 hover:bg-indigo-500 text-white rounded-soft"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Dress
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedDress ? "Edit Dress" : "Add New Dress"}</DialogTitle>
            </DialogHeader>
            <DressForm dress={selectedDress} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Next Fitting Banner */}
      {nextFitting && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Next Fitting Appointment</p>
                <p className="text-indigo-600 font-semibold">
                  {nextFitting.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search dresses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-gentle"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="considering">Considering</SelectItem>
            <SelectItem value="trying-on">Trying On</SelectItem>
            <SelectItem value="selected">Selected</SelectItem>
            <SelectItem value="considered">Considered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dresses Grid */}
      {filteredDresses.length === 0 ? (
        <div className="text-center py-12">
          <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-heading text-gray-600 mb-2">
            {searchTerm || filterStatus !== "all"
              ? "No dresses match your filters"
              : "No Dresses Yet"}
          </h2>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filters"
              : "Start adding dresses you're considering for your wedding"}
          </p>
          {!searchTerm && filterStatus === "all" && (
            <Button
              onClick={handleAddDress}
              className="bg-indigo-400 hover:bg-indigo-500 text-white rounded-soft"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Dress
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDresses.map((dress) => (
            <Card key={dress.id} className="hover-lift overflow-hidden">
              <div className="relative">
                {dress.photos && dress.photos.length > 0 ? (
                  <img
                    src={dress.photos[0]}
                    alt={dress.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="w-full h-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <Shirt className="w-12 h-12 text-indigo-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(dress.status)}
                </div>
                <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-sm font-medium text-gray-800">
                  {dress.name}
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  {dress.designer && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Designer:</span> {dress.designer}
                    </div>
                  )}
                  
                  {dress.style && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Style:</span> {dress.style}
                    </div>
                  )}

                  {dress.size && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Size:</span> {dress.size}
                    </div>
                  )}
                  
                  {dress.price && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Price:</span> ${parseFloat(dress.price).toLocaleString()}
                    </div>
                  )}

                  {dress.store && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Store:</span> {dress.store}
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditDress(dress)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDressMutation.mutate(dress.id)}
                      disabled={deleteDressMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {dress.notes && (
                    <p className="text-xs text-gray-500 pt-2 border-t">
                      {dress.notes.length > 80 ? `${dress.notes.slice(0, 80)}...` : dress.notes}
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
