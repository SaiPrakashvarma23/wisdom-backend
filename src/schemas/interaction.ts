import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const interactions = pgTable('interactions', {
  id: serial('id').primaryKey().notNull(), // Auto-incrementing ID
  customer_id: integer('customer_id').notNull(), // Foreign key to customers
  user_id: integer('user_id').notNull(), // Foreign key to users
  notes: text('notes').notNull(), // Interaction notes
  follow_up_date: timestamp('follow_up_date'), // Optional follow-up date
  created_at: timestamp('created_at').defaultNow().notNull(), // Creation timestamp
  updated_at: timestamp('updated_at').defaultNow().notNull() // Last updated timestamp
});

export type Interaction = typeof interactions.$inferSelect;
export type NewInteraction = typeof interactions.$inferInsert;
export type InteractionTable = typeof interactions;
