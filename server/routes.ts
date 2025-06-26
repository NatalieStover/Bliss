import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertGuestSchema, insertBudgetCategorySchema, insertBudgetExpenseSchema,
  insertVenueSchema, insertFlowerSchema, insertDressSchema, insertVendorSchema, insertTaskSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Guest routes
  app.get("/api/guests", async (req, res) => {
    try {
      const guests = await storage.getGuests();
      res.json(guests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch guests" });
    }
  });

  app.get("/api/guests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const guest = await storage.getGuest(id);
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }
      res.json(guest);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch guest" });
    }
  });

  app.post("/api/guests", async (req, res) => {
    try {
      const guestData = insertGuestSchema.parse(req.body);
      const guest = await storage.createGuest(guestData);
      res.status(201).json(guest);
    } catch (error) {
      res.status(400).json({ message: "Invalid guest data" });
    }
  });

  app.put("/api/guests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertGuestSchema.partial().parse(req.body);
      const guest = await storage.updateGuest(id, updates);
      if (!guest) {
        return res.status(404).json({ message: "Guest not found" });
      }
      res.json(guest);
    } catch (error) {
      res.status(400).json({ message: "Invalid guest data" });
    }
  });

  app.delete("/api/guests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteGuest(id);
      if (!deleted) {
        return res.status(404).json({ message: "Guest not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete guest" });
    }
  });

  // Budget Category routes
  app.get("/api/budget-categories", async (req, res) => {
    try {
      const categories = await storage.getBudgetCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budget categories" });
    }
  });

  app.post("/api/budget-categories", async (req, res) => {
    try {
      const categoryData = insertBudgetCategorySchema.parse(req.body);
      const category = await storage.createBudgetCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid budget category data" });
    }
  });

  app.put("/api/budget-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertBudgetCategorySchema.partial().parse(req.body);
      const category = await storage.updateBudgetCategory(id, updates);
      if (!category) {
        return res.status(404).json({ message: "Budget category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid budget category data" });
    }
  });

  app.delete("/api/budget-categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBudgetCategory(id);
      if (!deleted) {
        return res.status(404).json({ message: "Budget category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete budget category" });
    }
  });

  // Budget Expense routes
  app.get("/api/budget-expenses", async (req, res) => {
    try {
      const expenses = await storage.getBudgetExpenses();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budget expenses" });
    }
  });

  app.post("/api/budget-expenses", async (req, res) => {
    try {
      const expenseData = insertBudgetExpenseSchema.parse(req.body);
      const expense = await storage.createBudgetExpense(expenseData);
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ message: "Invalid budget expense data" });
    }
  });

  app.put("/api/budget-expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertBudgetExpenseSchema.partial().parse(req.body);
      const expense = await storage.updateBudgetExpense(id, updates);
      if (!expense) {
        return res.status(404).json({ message: "Budget expense not found" });
      }
      res.json(expense);
    } catch (error) {
      res.status(400).json({ message: "Invalid budget expense data" });
    }
  });

  app.delete("/api/budget-expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBudgetExpense(id);
      if (!deleted) {
        return res.status(404).json({ message: "Budget expense not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete budget expense" });
    }
  });

  // Venue routes
  app.get("/api/venues", async (req, res) => {
    try {
      const venues = await storage.getVenues();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch venues" });
    }
  });

  app.post("/api/venues", async (req, res) => {
    try {
      const venueData = insertVenueSchema.parse(req.body);
      const venue = await storage.createVenue(venueData);
      res.status(201).json(venue);
    } catch (error) {
      res.status(400).json({ message: "Invalid venue data" });
    }
  });

  app.put("/api/venues/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertVenueSchema.partial().parse(req.body);
      const venue = await storage.updateVenue(id, updates);
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      res.json(venue);
    } catch (error) {
      res.status(400).json({ message: "Invalid venue data" });
    }
  });

  app.delete("/api/venues/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteVenue(id);
      if (!deleted) {
        return res.status(404).json({ message: "Venue not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete venue" });
    }
  });

  // Flower routes
  app.get("/api/flowers", async (req, res) => {
    try {
      const flowers = await storage.getFlowers();
      res.json(flowers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch flowers" });
    }
  });

  app.post("/api/flowers", async (req, res) => {
    try {
      const flowerData = insertFlowerSchema.parse(req.body);
      const flower = await storage.createFlower(flowerData);
      res.status(201).json(flower);
    } catch (error) {
      res.status(400).json({ message: "Invalid flower data" });
    }
  });

  app.put("/api/flowers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertFlowerSchema.partial().parse(req.body);
      const flower = await storage.updateFlower(id, updates);
      if (!flower) {
        return res.status(404).json({ message: "Flower not found" });
      }
      res.json(flower);
    } catch (error) {
      res.status(400).json({ message: "Invalid flower data" });
    }
  });

  app.delete("/api/flowers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteFlower(id);
      if (!deleted) {
        return res.status(404).json({ message: "Flower not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete flower" });
    }
  });

  // Dress routes
  app.get("/api/dresses", async (req, res) => {
    try {
      const dresses = await storage.getDresses();
      res.json(dresses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dresses" });
    }
  });

  app.post("/api/dresses", async (req, res) => {
    try {
      const dressData = insertDressSchema.parse(req.body);
      const dress = await storage.createDress(dressData);
      res.status(201).json(dress);
    } catch (error) {
      res.status(400).json({ message: "Invalid dress data" });
    }
  });

  app.put("/api/dresses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertDressSchema.partial().parse(req.body);
      const dress = await storage.updateDress(id, updates);
      if (!dress) {
        return res.status(404).json({ message: "Dress not found" });
      }
      res.json(dress);
    } catch (error) {
      res.status(400).json({ message: "Invalid dress data" });
    }
  });

  app.delete("/api/dresses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteDress(id);
      if (!deleted) {
        return res.status(404).json({ message: "Dress not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete dress" });
    }
  });

  // Vendor routes
  app.get("/api/vendors", async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.post("/api/vendors", async (req, res) => {
    try {
      const vendorData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(vendorData);
      res.status(201).json(vendor);
    } catch (error) {
      res.status(400).json({ message: "Invalid vendor data" });
    }
  });

  app.put("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertVendorSchema.partial().parse(req.body);
      const vendor = await storage.updateVendor(id, updates);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      res.status(400).json({ message: "Invalid vendor data" });
    }
  });

  app.delete("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteVendor(id);
      if (!deleted) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vendor" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, updates);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
