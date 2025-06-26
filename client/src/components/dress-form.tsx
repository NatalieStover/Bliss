import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Camera } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { insertDressSchema, type Dress, type InsertDress } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { saveDress, updateDress } from "@/lib/storage";

interface DressFormProps {
  dress?: Dress | null;
  onSuccess?: () => void;
}

export default function DressForm({ dress, onSuccess }: DressFormProps) {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>(dress?.photos || []);
  const [fittingDates, setFittingDates] = useState<string[]>(dress?.fittingDates || []);

  const form = useForm<InsertDress>({
    resolver: zodResolver(insertDressSchema),
    defaultValues: {
      name: dress?.name || "",
      designer: dress?.designer || "",
      style: dress?.style || "",
      size: dress?.size || "",
      price: dress?.price || "",
      store: dress?.store || "",
      status: dress?.status || "considering",
      fittingDates: dress?.fittingDates || [],
      photos: dress?.photos || [],
      notes: dress?.notes || "",
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

  const addFittingDate = () => {
    setFittingDates([...fittingDates, ""]);
  };

  const updateFittingDate = (index: number, date: string) => {
    const newDates = [...fittingDates];
    newDates[index] = date;
    setFittingDates(newDates);
    form.setValue("fittingDates", newDates);
  };

  const removeFittingDate = (index: number) => {
    const newDates = fittingDates.filter((_, i) => i !== index);
    setFittingDates(newDates);
    form.setValue("fittingDates", newDates);
  };

  const onSubmit = (data: InsertDress) => {
    try {
      const dressData = { ...data, photos, fittingDates };

      if (dress) {
        updateDress(dress.id, dressData)
          .then(() => {
            toast({
              title: "Success",
              description: "Dress updated successfully",
            });
            onSuccess?.();
          })
          .catch(() => {
            toast({
              title: "Error",
              description: "Failed to update dress",
              variant: "destructive",
            });
          });
      } else {
        saveDress(dressData)
          .then(() => {
            toast({
              title: "Success",
              description: "Dress created successfully",
            });
            onSuccess?.();
          })
          .catch(() => {
            toast({
              title: "Error",
              description: "Failed to create dress",
              variant: "destructive",
            });
          });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save dress",
        variant: "destructive",
      });
    }
  };

  const onReset = () => {
    form.reset();
    setPhotos([]);
    setFittingDates([]);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dress Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Classic A-Line, Princess Gown" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="designer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designer</FormLabel>
                <FormControl>
                  <Input placeholder="Designer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Style</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., A-Line, Ballgown, Mermaid" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 8, 10, 12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
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
                    <SelectItem value="trying-on">Trying On</SelectItem>
                    <SelectItem value="selected">Selected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="store"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store/Boutique</FormLabel>
              <FormControl>
                <Input placeholder="Where you found or tried this dress" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes about the dress..."
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
              id="dress-photo-upload-regular"
              onChange={handleImageUpload}
            />
            <label htmlFor="dress-photo-upload-regular" className="cursor-pointer block">
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
                    alt={`Dress photo ${index + 1}`}
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

        <div className="space-y-2">
          <FormLabel>Fitting Dates</FormLabel>

          {fittingDates.map((date, index) => (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <div className="grid gap-2">
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(new Date(date), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </FormControl>
                  <FormMessage />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={date ? new Date(date) : undefined}
                  onSelect={(newDate) => {
                    if (newDate) {
                      updateFittingDate(index, newDate.toISOString());
                    }
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ))}
          <Button type="button" onClick={addFittingDate} variant="secondary">
            Add Fitting Date
          </Button>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="ghost" onClick={onReset}>
            Reset
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-indigo-400 hover:bg-indigo-500 text-white"
          >
            {form.formState.isSubmitting ? "Saving..." : dress ? "Update Dress" : "Add Dress"}
          </Button>
        </div>
      </form>
    </Form>
  );
}