import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, X, Phone, Mail } from "lucide-react";
import { insertVenueSchema, type Venue, type InsertVenue } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { saveVenue, updateVenue } from "@/lib/storage";

interface VenueFormProps {
  venue?: Venue | null;
  onSuccess?: () => void;
}

export default function EnhancedVenueForm({ venue, onSuccess }: VenueFormProps) {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>(venue?.photos || []);

  const form = useForm<InsertVenue>({
    resolver: zodResolver(insertVenueSchema),
    defaultValues: {
      name: venue?.name || "",
      address: venue?.address || "",
      phone: venue?.phone || "",
      email: venue?.email || "",
      website: venue?.website || "",
      capacity: venue?.capacity || undefined,
      price: venue?.price || "",
      status: venue?.status || "considering",
      photos: venue?.photos || [],
      notes: venue?.notes || "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotos(prev => [...prev, result]);
        form.setValue("photos", [...photos, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    form.setValue("photos", newPhotos);
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

  const onSubmit = (data: InsertVenue) => {
    try {
      const venueData = { ...data, photos };
      
      if (venue) {
        updateVenue(venue.id, venueData);
        toast({
          title: "Success",
          description: "Venue updated successfully",
        });
      } else {
        saveVenue(venueData);
        toast({
          title: "Success", 
          description: "Venue added successfully",
        });
      }
      
      form.reset();
      setPhotos([]);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save venue",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-96 overflow-y-auto">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter venue name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter full address" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} value={field.value || ""} />
                  </FormControl>
                  {field.value && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handlePhoneCall(field.value || "")}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="venue@example.com" type="email" {...field} value={field.value || ""} />
                  </FormControl>
                  {field.value && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEmail(field.value || "")}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://venue.com" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="150" 
                    type="number" 
                    {...field} 
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="$5,000" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="considering">Considering</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="visited">Visited</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Photos</FormLabel>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('venue-photo-upload')?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Add Photos
            </Button>
            <input
              id="venue-photo-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          
          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Venue photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes about the venue..."
                  className="min-h-[80px]"
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {venue ? "Update Venue" : "Add Venue"}
        </Button>
      </form>
    </Form>
  );
}