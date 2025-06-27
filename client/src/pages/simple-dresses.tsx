import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Calendar, Edit, Trash2, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDresses, deleteDress } from "@/lib/storage";
import DressForm from "@/components/dress-form";
import type { Dress } from "@shared/schema";

export default function Dresses() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDresses();
  }, []);

  const loadDresses = () => {
    setIsLoading(true);
    const dressData = getDresses();
    setDresses(dressData);
    setIsLoading(false);
  };

  const handleDeleteDress = (id: number) => {
    const success = deleteDress(id);
    if (success) {
      loadDresses();
      toast({
        title: "Success",
        description: "Dress deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete dress",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    loadDresses();
    setIsFormOpen(false);
    setSelectedDress(null);
  };

  const handleEdit = (dress: Dress) => {
    setSelectedDress(dress);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedDress(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-gray-600">Loading dresses...</div>
    </div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ordered":
        return "bg-blue-100 text-blue-800";
      case "received":
        return "bg-green-100 text-green-800";
      case "fitted":
        return "bg-purple-100 text-purple-800";
      case "alterations":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wedding Dresses</h1>
          <p className="text-gray-600">Track your wedding dress journey</p>
        </div>
        <Button onClick={handleAddNew} className="bg-pink-600 hover:bg-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Dress
        </Button>
      </div>

      <div className="grid gap-6">
        {dresses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No dresses yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your dream wedding dress</p>
              <Button onClick={handleAddNew} className="bg-pink-600 hover:bg-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Dress
              </Button>
            </CardContent>
          </Card>
        ) : (
          dresses.map((dress) => (
            <Card key={dress.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4 flex-1">
                    {dress.photos && dress.photos.length > 0 && (
                      <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={dress.photos[0]}
                          alt={dress.designer || "Wedding dress"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {dress.designer || "Wedding Dress"}
                        </h3>
                        <Badge className={getStatusColor(dress.status)}>
                          {dress.status}
                        </Badge>
                      </div>
                      
                      {dress.style && (
                        <p className="text-gray-600">Style: {dress.style}</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        {dress.size && (
                          <span>Size: {dress.size}</span>
                        )}
                        {dress.price && (
                          <span>Price: ${parseFloat(dress.price).toLocaleString()}</span>
                        )}
                        {dress.store && (
                          <span>Store: {dress.store}</span>
                        )}
                        {dress.fittingDates && dress.fittingDates.length > 0 && (
                          <span>Fittings: {dress.fittingDates.length}</span>
                        )}
                      </div>
                      
                      {dress.notes && (
                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">
                          {dress.notes}
                        </p>
                      )}
                      
                      {dress.fittingDates && dress.fittingDates.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-700">Fitting Dates:</h4>
                          <div className="space-y-1">
                            {dress.fittingDates.map((date: string, index: number) => (
                              <p key={index} className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                {formatDate(date)}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(dress)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDress(dress.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDress ? "Edit Dress" : "Add New Dress"}
            </DialogTitle>
          </DialogHeader>
          <DressForm 
            dress={selectedDress} 
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}