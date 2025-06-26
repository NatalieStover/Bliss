import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertDressSchema, type Dress, type InsertDress } from "@shared/schema";

interface DressFormProps {
  dress?: Dress | null;
  onSuccess?: () => void;
}

export default function DressForm({ dress, onSuccess }: DressFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const mutation = useMutation({
    mutationFn: async (data: InsertDress) => {
      if (dress) {
        const response = await apiRequest("PUT", `/api/dresses/${dress.id}`, data);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/dresses", data);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dresses"] });
      toast({
        title: "Success",
        description: dress ? "Dress updated successfully" : "Dress created successfully",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save dress",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertDress) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-96 overflow-y-auto">
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
                    <SelectItem value="considered">Considered</SelectItem>
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
                  placeholder="Fitting notes, alterations needed, or other details"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-indigo-400 hover:bg-indigo-500 text-white"
          >
            {mutation.isPending ? "Saving..." : dress ? "Update Dress" : "Add Dress"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
