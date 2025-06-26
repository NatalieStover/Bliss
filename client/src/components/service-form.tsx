import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, X, Phone, Mail, Camera } from "lucide-react";
import { insertFlowerSchema, type Flower, type InsertFlower } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { saveService, updateService } from "@/lib/storage";

interface ServiceFormProps {
  service?: Flower | null;
  onSuccess?: () => void;
}

export default function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>(service?.photos || []);

  const form = useForm<InsertFlower>({
    resolver: zodResolver(insertFlowerSchema),
    defaultValues: {
      name: service?.name || "",
      type: service?.type || "photography",
      description: service?.description || "",
      florist: service?.florist || "", // Using this field for service provider
      price: service?.price || "",
      status: service?.status || "considering",
      photos: service?.photos || [],
      notes: service?.notes || "",
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

  const onSubmit = (data: InsertFlower) => {
    try {
      const serviceData = { ...data, photos };

      if (service) {
        updateService(service.id, serviceData);
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
      } else {
        saveService(serviceData);
        toast({
          title: "Success", 
          description: "Service added successfully",
        });
      }

      form.reset();
      setPhotos([]);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    }
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Wedding Photography, Hair & Makeup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="videography">Videography</SelectItem>
                  <SelectItem value="hair">Hair Styling</SelectItem>
                  <SelectItem value="makeup">Makeup</SelectItem>
                  <SelectItem value="flowers">Flowers & Florals</SelectItem>
                  <SelectItem value="music">Music & DJ</SelectItem>
                  <SelectItem value="catering">Catering</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="decoration">Decoration</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="florist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Provider</FormLabel>
              <FormControl>
                <Input placeholder="Company or provider name" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="$0.00" {...field} value={field.value || ""} />
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
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Service details, package information, etc."
                  className="min-h-[80px]"
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormLabel>Photos</FormLabel>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pastel-green-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              id="service-photo-upload"
              onChange={handleImageUpload}
            />
            <label htmlFor="service-photo-upload" className="cursor-pointer block">
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
                    alt={`Service photo ${index + 1}`}
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
                  placeholder="Additional notes, contact info, special requirements..."
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
          {service ? "Update Service" : "Add Service"}
        </Button>
      </form>
    </Form>
  );
}