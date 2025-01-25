import { pgTable, serial, text, varchar, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './user';

export const customers = pgTable('customers', {
  id: serial('id').primaryKey().notNull(), // Auto-incrementing ID
  name: varchar('name', { length: 256 }).notNull(), // Name with max length 256
  email: varchar('email', { length: 256 }).notNull(), // Email address
  phone: varchar('phone', { length: 20 }).notNull(), // Phone number
  company: varchar('company', { length: 256 }), // Company name (optional)
  user_id: integer('user_id').notNull().references(() => users.id), 
  created_at: timestamp('created_at').defaultNow().notNull(), // Creation timestamp
  updated_at: timestamp('updated_at').defaultNow().notNull() // Last updated timestamp
},
(table) => {
  return {
    emailIdx: uniqueIndex('email_idx').on(table.email), // Unique index on email
  };
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type CustomerTable = typeof customers;
