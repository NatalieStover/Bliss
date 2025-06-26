import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, X, Phone, Mail, Camera } from "lucide-react";
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
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log(`Processing ${files.length} files`);

    Array.from(files).forEach(file => {
      console.log(`Processing file: ${file.name}, type: ${file.type}`);

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file",
          description: "Please select only image files.",
          variant: "destructive",
        });
        return;
      }

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select images smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('File read successfully, result length:', result?.length);

        if (result) {
          setPhotos(prev => {
            const newPhotos = [...prev, result];
            console.log('Photos updated, total count:', newPhotos.length);
            form.setValue("photos", newPhotos);
            return newPhotos;
          });
        }
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    });

    // Clear the input to allow re-uploading the same file
    event.target.value = '';
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

        <div className="space-y-3">
          <FormLabel>Photos</FormLabel>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pastel-green-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              id="venue-photo-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="venue-photo-upload" className="cursor-pointer block">
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 bg-pastel-green-100 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-pastel-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Click to add photos from your device</p>
                  <p className="text-xs text-gray-500">Select multiple images at once</p>
                </div>
              </div>
            </label>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Venue photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
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