import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GuestForm from "@/components/guest-form";
import { getGuests, deleteGuest } from "@/lib/storage";
import type { Guest } from "@shared/schema";

export default function Guests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = () => {
    setIsLoading(true);
    const guestData = getGuests();
    setGuests(guestData);
    setIsLoading(false);
  };

  const handleDeleteGuest = (id: number) => {
    const success = deleteGuest(id);
    if (success) {
      loadGuests();
      toast({
        title: "Success",
        description: "Guest deleted successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete guest",
        variant: "destructive",
      });
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone?.includes(searchTerm)
  );

  const confirmedCount = guests.filter(g => g.rsvpStatus === "confirmed").length;
  const pendingCount = guests.filter(g => g.rsvpStatus === "pending").length;
  const declinedCount = guests.filter(g => g.rsvpStatus === "declined").length;

  const handleFormSuccess = () => {
    loadGuests();
    setIsFormOpen(false);
    setSelectedGuest(null);
  };

  const handleEdit = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedGuest(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-gray-600">Loading guests...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guest List</h1>
          <p className="text-gray-600">Manage your wedding guests and RSVPs</p>
        </div>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Guest
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Guests</p>
                <p className="text-2xl font-bold text-gray-900">{guests.length}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">?</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Declined</p>
                <p className="text-2xl font-bold text-red-600">{declinedCount}</p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold">✗</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredGuests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No guests found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Start by adding your first guest"}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Guest
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredGuests.map((guest) => (
            <Card key={guest.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-medium">
                        {guest.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{guest.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {guest.email && <span>{guest.email}</span>}
                        {guest.phone && <span>{guest.phone}</span>}
                      </div>
                      {guest.plusOne && (
                        <p className="text-sm text-gray-600 mt-1">Plus one included</p>
                      )}
                      {guest.dietaryRestrictions && (
                        <p className="text-sm text-gray-600 mt-1">
                          Dietary: {guest.dietaryRestrictions}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={guest.rsvpStatus === "confirmed" ? "default" : 
                              guest.rsvpStatus === "declined" ? "destructive" : "secondary"}
                    >
                      {guest.rsvpStatus}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(guest)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteGuest(guest.id)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedGuest ? "Edit Guest" : "Add New Guest"}
            </DialogTitle>
          </DialogHeader>
          <GuestForm 
            guest={selectedGuest} 
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}