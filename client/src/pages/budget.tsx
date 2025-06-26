import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, DollarSign, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BudgetForm from "@/components/budget-form";
import type { BudgetCategory, BudgetExpense } from "@shared/schema";

export default function Budget() {
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery<BudgetCategory[]>({
    queryKey: ["/api/budget-categories"],
  });

  const { data: expenses = [] } = useQuery<BudgetExpense[]>({
    queryKey: ["/api/budget-expenses"],
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/budget-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budget-categories"] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const totalBudget = categories.reduce((sum, cat) => sum + parseFloat(cat.budgetAmount), 0);
  const totalSpent = categories.reduce((sum, cat) => sum + parseFloat(cat.spentAmount), 0);
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const handleEditCategory = (category: BudgetCategory) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold text-gray-800">Budget Tracker</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-soft"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-soft"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-gray-800">Budget Tracker</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddCategory}
              className="bg-orange-400 hover:bg-orange-500 text-white rounded-soft"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCategory ? "Edit Budget Category" : "Add Budget Category"}
              </DialogTitle>
            </DialogHeader>
            <BudgetForm category={selectedCategory} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-gentle">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-heading font-semibold text-gray-800">Total Budget</h2>
              </div>
              <span className="text-2xl font-bold text-gray-800">
                ${totalBudget.toLocaleString()}
              </span>
            </div>
            <Progress value={percentageUsed} className="h-3 mb-4" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{percentageUsed.toFixed(1)}% used</span>
              <span>${(totalBudget - totalSpent).toLocaleString()} remaining</span>
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-gray-800">
                Spent: ${totalSpent.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const budget = parseFloat(category.budgetAmount);
          const spent = parseFloat(category.spentAmount);
          const percentage = budget > 0 ? (spent / budget) * 100 : 0;
          const isOverBudget = spent > budget;

          return (
            <Card key={category.id} className="hover-lift">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-heading">{category.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCategoryMutation.mutate(category.id)}
                      disabled={deleteCategoryMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Budget</span>
                        <span className="font-medium">${budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Spent</span>
                        <span className={`font-medium ${isOverBudget ? "text-red-600" : "text-gray-800"}`}>
                          ${spent.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Progress
                    value={Math.min(percentage, 100)}
                    className="h-2"
                    style={{
                      backgroundColor: isOverBudget ? "#fee2e2" : undefined,
                    }}
                  />
                  
                  <div className="text-xs text-gray-600">
                    {isOverBudget ? (
                      <span className="text-red-600">
                        Over budget by ${(spent - budget).toLocaleString()}
                      </span>
                    ) : (
                      <span>
                        ${(budget - spent).toLocaleString()} remaining ({percentage.toFixed(1)}% used)
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-heading text-gray-600 mb-2">No Budget Categories Yet</h2>
          <p className="text-gray-500 mb-4">
            Start by adding budget categories to track your wedding expenses
          </p>
          <Button
            onClick={handleAddCategory}
            className="bg-orange-400 hover:bg-orange-500 text-white rounded-soft"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Category
          </Button>
        </div>
      )}
    </div>
  );
}
