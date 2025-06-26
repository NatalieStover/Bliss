import { 
  guests, budgetCategories, budgetExpenses, venues, flowers, dresses, vendors, tasks,
  type Guest, type InsertGuest,
  type BudgetCategory, type InsertBudgetCategory,
  type BudgetExpense, type InsertBudgetExpense,
  type Venue, type InsertVenue,
  type Flower, type InsertFlower,
  type Dress, type InsertDress,
  type Vendor, type InsertVendor,
  type Task, type InsertTask
} from "@shared/schema";

export interface IStorage {
  // Guests
  getGuests(): Promise<Guest[]>;
  getGuest(id: number): Promise<Guest | undefined>;
  createGuest(guest: InsertGuest): Promise<Guest>;
  updateGuest(id: number, guest: Partial<InsertGuest>): Promise<Guest | undefined>;
  deleteGuest(id: number): Promise<boolean>;

  // Budget Categories
  getBudgetCategories(): Promise<BudgetCategory[]>;
  getBudgetCategory(id: number): Promise<BudgetCategory | undefined>;
  createBudgetCategory(category: InsertBudgetCategory): Promise<BudgetCategory>;
  updateBudgetCategory(id: number, category: Partial<InsertBudgetCategory>): Promise<BudgetCategory | undefined>;
  deleteBudgetCategory(id: number): Promise<boolean>;

  // Budget Expenses
  getBudgetExpenses(): Promise<BudgetExpense[]>;
  getBudgetExpense(id: number): Promise<BudgetExpense | undefined>;
  createBudgetExpense(expense: InsertBudgetExpense): Promise<BudgetExpense>;
  updateBudgetExpense(id: number, expense: Partial<InsertBudgetExpense>): Promise<BudgetExpense | undefined>;
  deleteBudgetExpense(id: number): Promise<boolean>;

  // Venues
  getVenues(): Promise<Venue[]>;
  getVenue(id: number): Promise<Venue | undefined>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: number, venue: Partial<InsertVenue>): Promise<Venue | undefined>;
  deleteVenue(id: number): Promise<boolean>;

  // Flowers
  getFlowers(): Promise<Flower[]>;
  getFlower(id: number): Promise<Flower | undefined>;
  createFlower(flower: InsertFlower): Promise<Flower>;
  updateFlower(id: number, flower: Partial<InsertFlower>): Promise<Flower | undefined>;
  deleteFlower(id: number): Promise<boolean>;

  // Dresses
  getDresses(): Promise<Dress[]>;
  getDress(id: number): Promise<Dress | undefined>;
  createDress(dress: InsertDress): Promise<Dress>;
  updateDress(id: number, dress: Partial<InsertDress>): Promise<Dress | undefined>;
  deleteDress(id: number): Promise<boolean>;

  // Vendors
  getVendors(): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor | undefined>;
  deleteVendor(id: number): Promise<boolean>;

  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private guests: Map<number, Guest> = new Map();
  private budgetCategories: Map<number, BudgetCategory> = new Map();
  private budgetExpenses: Map<number, BudgetExpense> = new Map();
  private venues: Map<number, Venue> = new Map();
  private flowers: Map<number, Flower> = new Map();
  private dresses: Map<number, Dress> = new Map();
  private vendors: Map<number, Vendor> = new Map();
  private tasks: Map<number, Task> = new Map();
  private currentId: number = 1;

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize with default budget categories
    const defaultCategories = [
      { name: "Venue", budgetAmount: "10000", spentAmount: "8500", color: "#66BB6A" },
      { name: "Catering", budgetAmount: "6000", spentAmount: "4200", color: "#FB8C00" },
      { name: "Photography", budgetAmount: "3500", spentAmount: "2800", color: "#9C27B0" },
      { name: "Flowers", budgetAmount: "2500", spentAmount: "1840", color: "#2196F3" },
      { name: "Music", budgetAmount: "1500", spentAmount: "0", color: "#4CAF50" },
      { name: "Dress", budgetAmount: "1500", spentAmount: "1200", color: "#FF4081" }
    ];

    defaultCategories.forEach(category => {
      const id = this.currentId++;
      this.budgetCategories.set(id, { id, ...category });
    });
  }

  // Guest methods
  async getGuests(): Promise<Guest[]> {
    return Array.from(this.guests.values());
  }

  async getGuest(id: number): Promise<Guest | undefined> {
    return this.guests.get(id);
  }

  async createGuest(guest: InsertGuest): Promise<Guest> {
    const id = this.currentId++;
    const newGuest: Guest = { id, ...guest };
    this.guests.set(id, newGuest);
    return newGuest;
  }

  async updateGuest(id: number, updates: Partial<InsertGuest>): Promise<Guest | undefined> {
    const guest = this.guests.get(id);
    if (!guest) return undefined;
    const updated = { ...guest, ...updates };
    this.guests.set(id, updated);
    return updated;
  }

  async deleteGuest(id: number): Promise<boolean> {
    return this.guests.delete(id);
  }

  // Budget Category methods
  async getBudgetCategories(): Promise<BudgetCategory[]> {
    return Array.from(this.budgetCategories.values());
  }

  async getBudgetCategory(id: number): Promise<BudgetCategory | undefined> {
    return this.budgetCategories.get(id);
  }

  async createBudgetCategory(category: InsertBudgetCategory): Promise<BudgetCategory> {
    const id = this.currentId++;
    const newCategory: BudgetCategory = { id, ...category };
    this.budgetCategories.set(id, newCategory);
    return newCategory;
  }

  async updateBudgetCategory(id: number, updates: Partial<InsertBudgetCategory>): Promise<BudgetCategory | undefined> {
    const category = this.budgetCategories.get(id);
    if (!category) return undefined;
    const updated = { ...category, ...updates };
    this.budgetCategories.set(id, updated);
    return updated;
  }

  async deleteBudgetCategory(id: number): Promise<boolean> {
    return this.budgetCategories.delete(id);
  }

  // Budget Expense methods
  async getBudgetExpenses(): Promise<BudgetExpense[]> {
    return Array.from(this.budgetExpenses.values());
  }

  async getBudgetExpense(id: number): Promise<BudgetExpense | undefined> {
    return this.budgetExpenses.get(id);
  }

  async createBudgetExpense(expense: InsertBudgetExpense): Promise<BudgetExpense> {
    const id = this.currentId++;
    const newExpense: BudgetExpense = { id, ...expense };
    this.budgetExpenses.set(id, newExpense);
    
    // Update category spent amount
    const category = this.budgetCategories.get(expense.categoryId);
    if (category) {
      const currentSpent = parseFloat(category.spentAmount);
      const expenseAmount = parseFloat(expense.amount);
      const newSpent = (currentSpent + expenseAmount).toString();
      this.budgetCategories.set(expense.categoryId, { ...category, spentAmount: newSpent });
    }
    
    return newExpense;
  }

  async updateBudgetExpense(id: number, updates: Partial<InsertBudgetExpense>): Promise<BudgetExpense | undefined> {
    const expense = this.budgetExpenses.get(id);
    if (!expense) return undefined;
    const updated = { ...expense, ...updates };
    this.budgetExpenses.set(id, updated);
    return updated;
  }

  async deleteBudgetExpense(id: number): Promise<boolean> {
    return this.budgetExpenses.delete(id);
  }

  // Venue methods
  async getVenues(): Promise<Venue[]> {
    return Array.from(this.venues.values());
  }

  async getVenue(id: number): Promise<Venue | undefined> {
    return this.venues.get(id);
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const id = this.currentId++;
    const newVenue: Venue = { id, ...venue };
    this.venues.set(id, newVenue);
    return newVenue;
  }

  async updateVenue(id: number, updates: Partial<InsertVenue>): Promise<Venue | undefined> {
    const venue = this.venues.get(id);
    if (!venue) return undefined;
    const updated = { ...venue, ...updates };
    this.venues.set(id, updated);
    return updated;
  }

  async deleteVenue(id: number): Promise<boolean> {
    return this.venues.delete(id);
  }

  // Flower methods
  async getFlowers(): Promise<Flower[]> {
    return Array.from(this.flowers.values());
  }

  async getFlower(id: number): Promise<Flower | undefined> {
    return this.flowers.get(id);
  }

  async createFlower(flower: InsertFlower): Promise<Flower> {
    const id = this.currentId++;
    const newFlower: Flower = { id, ...flower };
    this.flowers.set(id, newFlower);
    return newFlower;
  }

  async updateFlower(id: number, updates: Partial<InsertFlower>): Promise<Flower | undefined> {
    const flower = this.flowers.get(id);
    if (!flower) return undefined;
    const updated = { ...flower, ...updates };
    this.flowers.set(id, updated);
    return updated;
  }

  async deleteFlower(id: number): Promise<boolean> {
    return this.flowers.delete(id);
  }

  // Dress methods
  async getDresses(): Promise<Dress[]> {
    return Array.from(this.dresses.values());
  }

  async getDress(id: number): Promise<Dress | undefined> {
    return this.dresses.get(id);
  }

  async createDress(dress: InsertDress): Promise<Dress> {
    const id = this.currentId++;
    const newDress: Dress = { id, ...dress };
    this.dresses.set(id, newDress);
    return newDress;
  }

  async updateDress(id: number, updates: Partial<InsertDress>): Promise<Dress | undefined> {
    const dress = this.dresses.get(id);
    if (!dress) return undefined;
    const updated = { ...dress, ...updates };
    this.dresses.set(id, updated);
    return updated;
  }

  async deleteDress(id: number): Promise<boolean> {
    return this.dresses.delete(id);
  }

  // Vendor methods
  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(vendor: InsertVendor): Promise<Vendor> {
    const id = this.currentId++;
    const newVendor: Vendor = { id, ...vendor };
    this.vendors.set(id, newVendor);
    return newVendor;
  }

  async updateVendor(id: number, updates: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const vendor = this.vendors.get(id);
    if (!vendor) return undefined;
    const updated = { ...vendor, ...updates };
    this.vendors.set(id, updated);
    return updated;
  }

  async deleteVendor(id: number): Promise<boolean> {
    return this.vendors.delete(id);
  }

  // Task methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const newTask: Task = { id, ...task };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    const updated = { ...task, ...updates };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
}

export const storage = new MemStorage();
