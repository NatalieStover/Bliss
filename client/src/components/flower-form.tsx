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
import { insertFlowerSchema, type Flower, type InsertFlower } from "@shared/schema";

interface FlowerFormProps {
  flower?: Flower | null;
  onSuccess?: () => void;
}

export default function FlowerForm({ flower, onSuccess }: FlowerFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertFlower>({
    resolver: zodResolver(insertFlowerSchema),
    defaultValues: {
      name: flower?.name || "",
      type: flower?.type || "bouquet",
      description: flower?.description || "",
      florist: flower?.florist || "",
      price: flower?.price || "",
      status: flower?.status || "considering",
      photos: flower?.photos || [],
      notes: flower?.notes || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertFlower) => {
      if (flower) {
        const response = await apiRequest("PUT", `/api/flowers/${flower.id}`, data);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/flowers", data);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flowers"] });
      toast({
        title: "Success",
        description: flower ? "Flower arrangement updated successfully" : "Flower arrangement created successfully",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save flower arrangement",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertFlower) => {
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
              <FormLabel>Arrangement Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Bridal Bouquet, Centerpieces" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="bouquet">Bouquet</SelectItem>
                    <SelectItem value="centerpiece">Centerpiece</SelectItem>
                    <SelectItem value="ceremony">Ceremony</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="selected">Selected</SelectItem>
                    <SelectItem value="inspiration">Inspiration</SelectItem>
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
                  placeholder="Describe the flower arrangement..."
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="florist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Florist</FormLabel>
                <FormControl>
                  <Input placeholder="Florist name or shop" {...field} />
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
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes about this arrangement"
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
            className="bg-pink-400 hover:bg-pink-500 text-white"
          >
            {mutation.isPending ? "Saving..." : flower ? "Update Arrangement" : "Add Arrangement"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
