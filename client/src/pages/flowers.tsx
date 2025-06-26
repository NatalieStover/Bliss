import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Flower, Plus, Edit, Trash2, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import FlowerForm from "@/components/flower-form";
import type { Flower as FlowerType } from "@shared/schema";

export default function Flowers() {
  const [selectedFlower, setSelectedFlower] = useState<FlowerType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: flowers = [], isLoading } = useQuery<FlowerType[]>({
    queryKey: ["/api/flowers"],
  });

  const deleteFlowerMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/flowers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flowers"] });
      toast({
        title: "Success",
        description: "Flower arrangement deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete flower arrangement",
        variant: "destructive",
      });
    },
  });

  const filteredFlowers = flowers.filter(flower => {
    const matchesSearch = flower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flower.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flower.florist?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || flower.type === filterType;
    const matchesStatus = filterStatus === "all" || flower.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selected":
        return <Badge className="bg-pastel-green-200 text-pastel-green-700">Selected</Badge>;
      case "inspiration":
        return <Badge variant="secondary">Inspiration</Badge>;
      default:
        return <Badge className="bg-yellow-200 text-yellow-700">Considering</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      bouquet: "bg-pink-100 text-pink-700",
      centerpiece: "bg-purple-100 text-purple-700", 
      ceremony: "bg-blue-100 text-blue-700",
      other: "bg-gray-100 text-gray-700"
    };
    return <Badge className={colors[type] || colors.other}>{type}</Badge>;
  };

  const handleEditFlower = (flower: FlowerType) => {
    setSelectedFlower(flower);
    setIsFormOpen(true);
  };

  const handleAddFlower = () => {
    setSelectedFlower(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedFlower(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold text-gray-800">Flower Arrangements</h1>
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
        <h1 className="text-3xl font-heading font-bold text-gray-800">Flower Arrangements</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddFlower}
              className="bg-pink-400 hover:bg-pink-500 text-white rounded-soft"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Arrangement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedFlower ? "Edit Flower Arrangement" : "Add New Flower Arrangement"}</DialogTitle>
            </DialogHeader>
            <FlowerForm flower={selectedFlower} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search arrangements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-gentle"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="bouquet">Bouquet</SelectItem>
            <SelectItem value="centerpiece">Centerpiece</SelectItem>
            <SelectItem value="ceremony">Ceremony</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="considering">Considering</SelectItem>
            <SelectItem value="selected">Selected</SelectItem>
            <SelectItem value="inspiration">Inspiration</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Flowers Grid */}
      {filteredFlowers.length === 0 ? (
        <div className="text-center py-12">
          <Flower className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-heading text-gray-600 mb-2">
            {searchTerm || filterType !== "all" || filterStatus !== "all" 
              ? "No arrangements match your filters" 
              : "No Flower Arrangements Yet"}
          </h2>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== "all" || filterStatus !== "all"
              ? "Try adjusting your search or filters"
              : "Start adding flower arrangements for your wedding"}
          </p>
          {!searchTerm && filterType === "all" && filterStatus === "all" && (
            <Button
              onClick={handleAddFlower}
              className="bg-pink-400 hover:bg-pink-500 text-white rounded-soft"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Arrangement
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlowers.map((flower) => (
            <Card key={flower.id} className="hover-lift overflow-hidden">
              <div className="relative">
                {flower.photos && flower.photos.length > 0 ? (
                  <img
                    src={flower.photos[0]}
                    alt={flower.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <Flower className="w-12 h-12 text-pink-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {getTypeBadge(flower.type)}
                  {getStatusBadge(flower.status)}
                </div>
                <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-sm font-medium text-gray-800">
                  {flower.name}
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  {flower.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{flower.description}</p>
                  )}
                  
                  {flower.florist && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Florist:</span> {flower.florist}
                    </div>
                  )}
                  
                  {flower.price && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Price:</span> ${parseFloat(flower.price).toLocaleString()}
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditFlower(flower)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFlowerMutation.mutate(flower.id)}
                      disabled={deleteFlowerMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {flower.notes && (
                    <p className="text-xs text-gray-500 pt-2 border-t">
                      {flower.notes.length > 100 ? `${flower.notes.slice(0, 100)}...` : flower.notes}
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
