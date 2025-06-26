import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertBudgetCategorySchema, type BudgetCategory, type InsertBudgetCategory } from "@shared/schema";

interface BudgetFormProps {
  category?: BudgetCategory | null;
  onSuccess?: () => void;
}

const predefinedColors = [
  "#66BB6A", "#FB8C00", "#9C27B0", "#2196F3", "#4CAF50", "#FF4081",
  "#FF5722", "#795548", "#607D8B", "#E91E63", "#00BCD4", "#CDDC39"
];

export default function BudgetForm({ category, onSuccess }: BudgetFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertBudgetCategory>({
    resolver: zodResolver(insertBudgetCategorySchema),
    defaultValues: {
      name: category?.name || "",
      budgetAmount: category?.budgetAmount || "",
      spentAmount: category?.spentAmount || "0",
      color: category?.color || predefinedColors[0],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertBudgetCategory) => {
      if (category) {
        const response = await apiRequest("PUT", `/api/budget-categories/${category.id}`, data);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/budget-categories", data);
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budget-categories"] });
      toast({
        title: "Success",
        description: category ? "Category updated successfully" : "Category created successfully",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBudgetCategory) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Venue, Catering, Photography" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budgetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Amount *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
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
            name="spentAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Spent</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
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
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Color</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        field.value === color ? "border-gray-800" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => field.onChange(color)}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="bg-orange-400 hover:bg-orange-500 text-white"
          >
            {mutation.isPending ? "Saving..." : category ? "Update Category" : "Add Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
