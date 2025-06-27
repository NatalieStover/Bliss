import { QueryClient } from "@tanstack/react-query";
import * as storage from "./storage";

// Create a query client that works with local storage
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Helper function to simulate API responses for React Query
export function createLocalMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData> | TData
) {
  return {
    mutationFn: async (variables: TVariables) => {
      try {
        const result = await mutationFn(variables);
        return result;
      } catch (error) {
        console.error('Local mutation error:', error);
        throw error;
      }
    }
  };
}

// Local storage query functions that return promises to work with React Query
export const localQueries = {
  // Guests
  getGuests: () => Promise.resolve(storage.getGuests()),
  
  // Budget Categories
  getBudgetCategories: () => Promise.resolve(storage.getBudgetCategories()),
  
  // Budget Expenses
  getBudgetExpenses: () => Promise.resolve(storage.getBudgetExpenses()),
  
  // Venues
  getVenues: () => Promise.resolve(storage.getVenues()),
  
  // Services (formerly Flowers)
  getServices: () => Promise.resolve(storage.getServices()),
  
  // Dresses
  getDresses: () => Promise.resolve(storage.getDresses()),
  
  // Vendors
  getVendors: () => Promise.resolve(storage.getVendors()),
  
  // Tasks
  getTasks: () => Promise.resolve(storage.getTasks()),
};

// Local storage mutations
export const localMutations = {
  // Guests
  createGuest: createLocalMutation(storage.saveGuest),
  updateGuest: createLocalMutation(({ id, ...updates }: { id: number } & any) => {
    const result = storage.updateGuest(id, updates);
    if (!result) throw new Error('Guest not found');
    return result;
  }),
  deleteGuest: createLocalMutation((id: number) => {
    const success = storage.deleteGuest(id);
    if (!success) throw new Error('Guest not found');
    return { success: true };
  }),
  
  // Budget Categories
  createBudgetCategory: createLocalMutation(storage.saveBudgetCategory),
  updateBudgetCategory: createLocalMutation(({ id, ...updates }: { id: number } & any) => {
    const result = storage.updateBudgetCategory(id, updates);
    if (!result) throw new Error('Budget category not found');
    return result;
  }),
  deleteBudgetCategory: createLocalMutation((id: number) => {
    const success = storage.deleteBudgetCategory(id);
    if (!success) throw new Error('Budget category not found');
    return { success: true };
  }),
  
  // Budget Expenses
  createBudgetExpense: createLocalMutation(storage.saveBudgetExpense),
  updateBudgetExpense: createLocalMutation(({ id, ...updates }: { id: number } & any) => {
    const result = storage.updateBudgetExpense(id, updates);
    if (!result) throw new Error('Budget expense not found');
    return result;
  }),
  deleteBudgetExpense: createLocalMutation((id: number) => {
    const success = storage.deleteBudgetExpense(id);
    if (!success) throw new Error('Budget expense not found');
    return { success: true };
  }),
  
  // Venues
  createVenue: createLocalMutation(storage.saveVenue),
  updateVenue: createLocalMutation(({ id, ...updates }: { id: number } & any) => {
    const result = storage.updateVenue(id, updates);
    if (!result) throw new Error('Venue not found');
    return result;
  }),
  deleteVenue: createLocalMutation((id: number) => {
    const success = storage.deleteVenue(id);
    if (!success) throw new Error('Venue not found');
    return { success: true };
  }),
  
  // Services
  createService: createLocalMutation(storage.saveService),
  updateService: createLocalMutation(({ id, ...updates }: { id: number } & any) => {
    const result = storage.updateService(id, updates);
    if (!result) throw new Error('Service not found');
    return result;
  }),
  deleteService: createLocalMutation((id: number) => {
    const success = storage.deleteService(id);
    if (!success) throw new Error('Service not found');
    return { success: true };
  }),
  
  // Dresses
  createDress: createLocalMutation(storage.saveDress),
  updateDress: createLocalMutation(({ id, ...updates }: { id: number } & any) => {
    const result = storage.updateDress(id, updates);
    if (!result) throw new Error('Dress not found');
    return result;
  }),
  deleteDress: createLocalMutation((id: number) => {
    const success = storage.deleteDress(id);
    if (!success) throw new Error('Dress not found');
    return { success: true };
  }),
  
  // Vendors
  createVendor: createLocalMutation(storage.saveVendor),
  updateVendor: createLocalMutation(({ id, ...updates }: { id: number } & any) => {
    const result = storage.updateVendor(id, updates);
    if (!result) throw new Error('Vendor not found');
    return result;
  }),
  deleteVendor: createLocalMutation((id: number) => {
    const success = storage.deleteVendor(id);
    if (!success) throw new Error('Vendor not found');
    return { success: true };
  }),
  
  // Tasks
  createTask: createLocalMutation(storage.saveTask),
  updateTask: createLocalMutation(({ id, ...updates }: { id: number } & any) => {
    const result = storage.updateTask(id, updates);
    if (!result) throw new Error('Task not found');
    return result;
  }),
  deleteTask: createLocalMutation((id: number) => {
    const success = storage.deleteTask(id);
    if (!success) throw new Error('Task not found');
    return { success: true };
  }),
};