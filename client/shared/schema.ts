import { pgTable, text, serial, integer, boolean, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  rsvpStatus: text("rsvp_status").notNull().default("pending"), // pending, confirmed, declined
  plusOne: boolean("plus_one").default(false),
  dietaryRestrictions: text("dietary_restrictions"),
  notes: text("notes"),
});

export const budgetCategories = pgTable("budget_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  budgetAmount: decimal("budget_amount", { precision: 10, scale: 2 }).notNull(),
  spentAmount: decimal("spent_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  color: text("color").notNull().default("#66BB6A"),
});

export const budgetExpenses = pgTable("budget_expenses", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  name: text("name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  vendor: text("vendor"),
  notes: text("notes"),
});

export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  capacity: integer("capacity"),
  price: decimal("price", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("considering"), // considering, visited, booked, not-available
  photos: text("photos").array(), // Array of photo URLs
  notes: text("notes"),
});

export const flowers = pgTable("flowers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // bouquet, centerpiece, ceremony, other
  description: text("description"),
  florist: text("florist"),
  price: decimal("price", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("considering"), // considering, selected, inspiration
  photos: text("photos").array(),
  notes: text("notes"),
});

export const dresses = pgTable("dresses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  designer: text("designer"),
  style: text("style"),
  size: text("size"),
  price: decimal("price", { precision: 10, scale: 2 }),
  store: text("store"),
  status: text("status").notNull().default("considering"), // considering, trying-on, selected, considered
  fittingDates: text("fitting_dates").array(),
  photos: text("photos").array(),
  notes: text("notes"),
});

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // photography, catering, music, florist, etc.
  contact: text("contact"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  price: decimal("price", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("pending"), // pending, negotiating, booked, declined
  notes: text("notes"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: date("due_date"),
  priority: text("priority").notNull().default("medium"), // low, medium, high
  status: text("status").notNull().default("pending"), // pending, in-progress, completed
  category: text("category"),
  assignedTo: text("assigned_to"),
});

// Insert schemas
export const insertGuestSchema = createInsertSchema(guests).omit({ id: true });
export const insertBudgetCategorySchema = createInsertSchema(budgetCategories).omit({ id: true });
export const insertBudgetExpenseSchema = createInsertSchema(budgetExpenses).omit({ id: true });
export const insertVenueSchema = createInsertSchema(venues).omit({ id: true });
export const insertFlowerSchema = createInsertSchema(flowers).omit({ id: true });
export const insertDressSchema = createInsertSchema(dresses).omit({ id: true });
export const insertVendorSchema = createInsertSchema(vendors).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });

// Types
export type Guest = typeof guests.$inferSelect;
export type InsertGuest = z.infer<typeof insertGuestSchema>;

export type BudgetCategory = typeof budgetCategories.$inferSelect;
export type InsertBudgetCategory = z.infer<typeof insertBudgetCategorySchema>;

export type BudgetExpense = typeof budgetExpenses.$inferSelect;
export type InsertBudgetExpense = z.infer<typeof insertBudgetExpenseSchema>;

export type Venue = typeof venues.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;

export type Flower = typeof flowers.$inferSelect;
export type InsertFlower = z.infer<typeof insertFlowerSchema>;

export type Dress = typeof dresses.$inferSelect;
export type InsertDress = z.infer<typeof insertDressSchema>;

export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
