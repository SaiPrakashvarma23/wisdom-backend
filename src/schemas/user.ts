import { pgTable, serial, varchar, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';

// Define the enum for user types (USER or ADMIN)
export const UserTypeEnum = pgEnum('UserTypeEnum', ['USER', 'ADMIN']);

export const users = pgTable('users', {
  id: serial('id').primaryKey().notNull(), // Auto-incrementing ID
  name: varchar('name', { length: 256 }).notNull(), // Name with max length 256
  mobile_number: varchar('mobile_number', { length: 15 }), // Unique mobile number
  email: varchar('email', { length: 256 }).notNull(), // Email
  usertype: UserTypeEnum('usertype').notNull(), // User type (USER or ADMIN)
  password: varchar('password', { length: 256 }).notNull(),
},
(table) => {
  return {
    mobileNumberIdx: uniqueIndex('mobile_number_idx').on(table.mobile_number), // Unique index on mobile number
  };
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserTable = typeof users;