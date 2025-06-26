import type { 
  Guest, 
  BudgetCategory, 
  BudgetExpense, 
  Venue, 
  Flower, 
  Dress, 
  Vendor, 
  Task,
  InsertGuest,
  InsertBudgetCategory,
  InsertBudgetExpense,
  InsertVenue,
  InsertFlower,
  InsertDress,
  InsertVendor,
  InsertTask
} from "@shared/schema";

// Local storage utilities for all wedding planning data
export interface WeddingDetails {
  bride: string;
  groom: string;
  weddingDate: string;
}

// Storage keys
const STORAGE_KEYS = {
  weddingDetails: 'bliss-wedding-details',
  guests: 'bliss-guests',
  budgetCategories: 'bliss-budget-categories',
  budgetExpenses: 'bliss-budget-expenses',
  venues: 'bliss-venues',
  services: 'bliss-services', // Using services instead of flowers
  dresses: 'bliss-dresses',
  vendors: 'bliss-vendors',
  tasks: 'bliss-tasks',
  currentId: 'bliss-current-id'
};

// Helper functions for storage operations
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

function getNextId(): number {
  const currentId = getFromStorage(STORAGE_KEYS.currentId, 1);
  saveToStorage(STORAGE_KEYS.currentId, currentId + 1);
  return currentId;
}

// Wedding Details
export function saveWeddingDetails(details: WeddingDetails): void {
  saveToStorage(STORAGE_KEYS.weddingDetails, details);
}

export function getWeddingDetails(): WeddingDetails | null {
  return getFromStorage<WeddingDetails | null>(STORAGE_KEYS.weddingDetails, null);
}

export function clearWeddingDetails(): void {
  localStorage.removeItem(STORAGE_KEYS.weddingDetails);
}

// Guests
export function getGuests(): Guest[] {
  return getFromStorage<Guest[]>(STORAGE_KEYS.guests, []);
}

export function saveGuest(guest: InsertGuest): Guest {
  const guests = getGuests();
  const newGuest = normalizeGuest(guest);
  guests.push(newGuest);
  saveToStorage(STORAGE_KEYS.guests, guests);
  return newGuest;
}

export function updateGuest(id: number, updates: Partial<InsertGuest>): Guest | null {
  const guests = getGuests();
  const index = guests.findIndex(g => g.id === id);
  if (index === -1) return null;
  
  guests[index] = { ...guests[index], ...updates };
  saveToStorage(STORAGE_KEYS.guests, guests);
  return guests[index];
}

export function deleteGuest(id: number): boolean {
  const guests = getGuests();
  const filtered = guests.filter(g => g.id !== id);
  if (filtered.length === guests.length) return false;
  
  saveToStorage(STORAGE_KEYS.guests, filtered);
  return true;
}

// Budget Categories
export function getBudgetCategories(): BudgetCategory[] {
  return getFromStorage<BudgetCategory[]>(STORAGE_KEYS.budgetCategories, []);
}

export function saveBudgetCategory(category: InsertBudgetCategory): BudgetCategory {
  const categories = getBudgetCategories();
  const newCategory = normalizeBudgetCategory(category);
  categories.push(newCategory);
  saveToStorage(STORAGE_KEYS.budgetCategories, categories);
  return newCategory;
}

export function updateBudgetCategory(id: number, updates: Partial<InsertBudgetCategory>): BudgetCategory | null {
  const categories = getBudgetCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  categories[index] = { ...categories[index], ...updates };
  saveToStorage(STORAGE_KEYS.budgetCategories, categories);
  return categories[index];
}

export function deleteBudgetCategory(id: number): boolean {
  const categories = getBudgetCategories();
  const filtered = categories.filter(c => c.id !== id);
  if (filtered.length === categories.length) return false;
  
  saveToStorage(STORAGE_KEYS.budgetCategories, filtered);
  return true;
}

// Budget Expenses
export function getBudgetExpenses(): BudgetExpense[] {
  return getFromStorage<BudgetExpense[]>(STORAGE_KEYS.budgetExpenses, []);
}

export function saveBudgetExpense(expense: InsertBudgetExpense): BudgetExpense {
  const expenses = getBudgetExpenses();
  const newExpense = normalizeBudgetExpense(expense);
  expenses.push(newExpense);
  saveToStorage(STORAGE_KEYS.budgetExpenses, expenses);
  return newExpense;
}

export function updateBudgetExpense(id: number, updates: Partial<InsertBudgetExpense>): BudgetExpense | null {
  const expenses = getBudgetExpenses();
  const index = expenses.findIndex(e => e.id === id);
  if (index === -1) return null;
  
  expenses[index] = { ...expenses[index], ...updates };
  saveToStorage(STORAGE_KEYS.budgetExpenses, expenses);
  return expenses[index];
}

export function deleteBudgetExpense(id: number): boolean {
  const expenses = getBudgetExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  if (filtered.length === expenses.length) return false;
  
  saveToStorage(STORAGE_KEYS.budgetExpenses, filtered);
  return true;
}

// Venues
export function getVenues(): Venue[] {
  return getFromStorage<Venue[]>(STORAGE_KEYS.venues, []);
}

export function saveVenue(venue: InsertVenue): Venue {
  const venues = getVenues();
  const newVenue = normalizeVenue(venue);
  venues.push(newVenue);
  saveToStorage(STORAGE_KEYS.venues, venues);
  return newVenue;
}

export function updateVenue(id: number, updates: Partial<InsertVenue>): Venue | null {
  const venues = getVenues();
  const index = venues.findIndex(v => v.id === id);
  if (index === -1) return null;
  
  venues[index] = { ...venues[index], ...updates };
  saveToStorage(STORAGE_KEYS.venues, venues);
  return venues[index];
}

export function deleteVenue(id: number): boolean {
  const venues = getVenues();
  const filtered = venues.filter(v => v.id !== id);
  if (filtered.length === venues.length) return false;
  
  saveToStorage(STORAGE_KEYS.venues, filtered);
  return true;
}

// Services (formerly Flowers)
export function getServices(): Flower[] {
  return getFromStorage<Flower[]>(STORAGE_KEYS.services, []);
}

export function saveService(service: InsertFlower): Flower {
  const services = getServices();
  const newService = normalizeService(service);
  services.push(newService);
  saveToStorage(STORAGE_KEYS.services, services);
  return newService;
}

export function updateService(id: number, updates: Partial<InsertFlower>): Flower | null {
  const services = getServices();
  const index = services.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  services[index] = { ...services[index], ...updates };
  saveToStorage(STORAGE_KEYS.services, services);
  return services[index];
}

export function deleteService(id: number): boolean {
  const services = getServices();
  const filtered = services.filter(s => s.id !== id);
  if (filtered.length === services.length) return false;
  
  saveToStorage(STORAGE_KEYS.services, filtered);
  return true;
}

// Dresses
export function getDresses(): Dress[] {
  return getFromStorage<Dress[]>(STORAGE_KEYS.dresses, []);
}

export function saveDress(dress: InsertDress): Dress {
  const dresses = getDresses();
  const newDress = normalizeDress(dress);
  dresses.push(newDress);
  saveToStorage(STORAGE_KEYS.dresses, dresses);
  return newDress;
}

export function updateDress(id: number, updates: Partial<InsertDress>): Dress | null {
  const dresses = getDresses();
  const index = dresses.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  dresses[index] = { ...dresses[index], ...updates };
  saveToStorage(STORAGE_KEYS.dresses, dresses);
  return dresses[index];
}

export function deleteDress(id: number): boolean {
  const dresses = getDresses();
  const filtered = dresses.filter(d => d.id !== id);
  if (filtered.length === dresses.length) return false;
  
  saveToStorage(STORAGE_KEYS.dresses, filtered);
  return true;
}

// Vendors
export function getVendors(): Vendor[] {
  return getFromStorage<Vendor[]>(STORAGE_KEYS.vendors, []);
}

export function saveVendor(vendor: InsertVendor): Vendor {
  const vendors = getVendors();
  const newVendor = normalizeVendor(vendor);
  vendors.push(newVendor);
  saveToStorage(STORAGE_KEYS.vendors, vendors);
  return newVendor;
}

export function updateVendor(id: number, updates: Partial<InsertVendor>): Vendor | null {
  const vendors = getVendors();
  const index = vendors.findIndex(v => v.id === id);
  if (index === -1) return null;
  
  vendors[index] = { ...vendors[index], ...updates };
  saveToStorage(STORAGE_KEYS.vendors, vendors);
  return vendors[index];
}

export function deleteVendor(id: number): boolean {
  const vendors = getVendors();
  const filtered = vendors.filter(v => v.id !== id);
  if (filtered.length === vendors.length) return false;
  
  saveToStorage(STORAGE_KEYS.vendors, filtered);
  return true;
}

// Tasks
export function getTasks(): Task[] {
  return getFromStorage<Task[]>(STORAGE_KEYS.tasks, []);
}

export function saveTask(task: InsertTask): Task {
  const tasks = getTasks();
  const newTask = normalizeTask(task);
  tasks.push(newTask);
  saveToStorage(STORAGE_KEYS.tasks, tasks);
  return newTask;
}

export function updateTask(id: number, updates: Partial<InsertTask>): Task | null {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  tasks[index] = { ...tasks[index], ...updates };
  saveToStorage(STORAGE_KEYS.tasks, tasks);
  return tasks[index];
}

export function deleteTask(id: number): boolean {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== id);
  if (filtered.length === tasks.length) return false;
  
  saveToStorage(STORAGE_KEYS.tasks, filtered);
  return true;
}

// Venue storage functions
export function getVenues(): Venue[] {
  const data = localStorage.getItem('venues');
  return data ? JSON.parse(data) : [];
}

export function saveVenue(venue: InsertVenue): void {
  const venues = getVenues();
  const newVenue: Venue = {
    ...venue,
    id: Date.now(), // Simple ID generation
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  venues.push(newVenue);
  localStorage.setItem('venues', JSON.stringify(venues));
}

export function updateVenue(id: number, venueData: InsertVenue): boolean {
  const venues = getVenues();
  const index = venues.findIndex(v => v.id === id);
  if (index !== -1) {
    venues[index] = {
      ...venues[index],
      ...venueData,
      updatedAt: new Date(),
    };
    localStorage.setItem('venues', JSON.stringify(venues));
    return true;
  }
  return false;
}

export function deleteVenue(id: number): boolean {
  const venues = getVenues();
  const filteredVenues = venues.filter(v => v.id !== id);
  if (filteredVenues.length !== venues.length) {
    localStorage.setItem('venues', JSON.stringify(filteredVenues));
    return true;
  }
  return false;
}

// Initialize with some default data if storage is empty
export function initializeDefaultData(): void {
  // Budget categories start empty so users can customize from 0
  // No default budget categories are created
}

// Helper function to ensure proper default values for all fields
function normalizeGuest(guest: InsertGuest): Guest {
  return {
    id: getNextId(),
    name: guest.name,
    address: guest.address ?? null,
    email: guest.email ?? null,
    phone: guest.phone ?? null,
    rsvpStatus: guest.rsvpStatus ?? "pending",
    plusOne: guest.plusOne ?? null,
    dietaryRestrictions: guest.dietaryRestrictions ?? null,
    notes: guest.notes ?? null
  };
}

function normalizeBudgetCategory(category: InsertBudgetCategory): BudgetCategory {
  return {
    id: getNextId(),
    name: category.name,
    budgetAmount: category.budgetAmount,
    spentAmount: category.spentAmount ?? "0",
    color: category.color ?? "#10b981"
  };
}

function normalizeBudgetExpense(expense: InsertBudgetExpense): BudgetExpense {
  return {
    id: getNextId(),
    name: expense.name,
    date: expense.date,
    categoryId: expense.categoryId,
    amount: expense.amount,
    notes: expense.notes ?? null,
    vendor: expense.vendor ?? null
  };
}

function normalizeVenue(venue: InsertVenue): Venue {
  return {
    id: getNextId(),
    name: venue.name,
    address: venue.address ?? null,
    email: venue.email ?? null,
    phone: venue.phone ?? null,
    website: venue.website ?? null,
    capacity: venue.capacity ?? null,
    price: venue.price ?? null,
    status: venue.status ?? "considering",
    photos: venue.photos ?? null,
    notes: venue.notes ?? null
  };
}

function normalizeService(service: InsertFlower): Flower {
  return {
    id: getNextId(),
    name: service.name,
    type: service.type,
    description: service.description ?? null,
    florist: service.florist ?? null,
    price: service.price ?? null,
    status: service.status ?? "considering",
    photos: service.photos ?? null,
    notes: service.notes ?? null
  };
}

function normalizeDress(dress: InsertDress): Dress {
  return {
    id: getNextId(),
    name: dress.name,
    designer: dress.designer ?? null,
    store: dress.store ?? null,
    style: dress.style ?? null,
    size: dress.size ?? null,
    price: dress.price ?? null,
    status: dress.status ?? "considering",
    photos: dress.photos ?? null,
    fittingDates: dress.fittingDates ?? null,
    notes: dress.notes ?? null
  };
}

function normalizeVendor(vendor: InsertVendor): Vendor {
  return {
    id: getNextId(),
    name: vendor.name,
    category: vendor.category,
    email: vendor.email ?? null,
    phone: vendor.phone ?? null,
    website: vendor.website ?? null,
    price: vendor.price ?? null,
    status: vendor.status ?? "considering",
    notes: vendor.notes ?? null,
    contact: vendor.contact ?? null
  };
}

function normalizeTask(task: InsertTask): Task {
  return {
    id: getNextId(),
    title: task.title,
    description: task.description ?? null,
    category: task.category ?? null,
    dueDate: task.dueDate ?? null,
    priority: task.priority ?? "medium",
    status: task.status ?? "pending",
    assignedTo: task.assignedTo ?? null
  };
}