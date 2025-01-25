import { NewCustomer, Customer, customers } from '../schemas/customer';
import {
  addSingleRecord,
  deleteSingleRecord,
  getRecordByColumn,
  updateSingleRecord,
  updateRecordByField,
} from '../dbClient/dbClient';
import { NewDBRecord } from '../utils/types';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

export class CustomerServiceProvider {
  
  // Create a new customer
  public async create(customerData: NewCustomer) {
    return await addSingleRecord<Customer>(customers, customerData);
  }

  // Find a customer by email
  public async findCustomerByEmail(email: string) {
    return await getRecordByColumn<Customer>(customers, 'email', email);
  }

  // Find a customer by ID
  public async findCustomerById(id: number) {
    return await getRecordByColumn<Customer>(customers, 'id', id);
  }

  // Update a customer by ID
  public async updateCustomerById(customerData: NewDBRecord, id: number) {
    return await updateSingleRecord(customers, customerData, id);
  }

  // Update a customer by email
  public async updateCustomerByEmail(customerData: NewDBRecord, email: string) {
    return await updateRecordByField(customers, customerData, email, 'email');
  }

  // Delete a customer by ID
  public async deleteCustomerById(id: number) {
    return await deleteSingleRecord(customers, id);
  }

  // customerService.ts

public async findAll({
  offset,
  limit,
  filters,
  sort
}: { 
  offset: number; 
  limit: number; 
  filters?: string; 
  sort?: string 
}) {
  const query = db.select().from(customers);  // Assuming `customers` is the table name

  // If filters are provided, add them to the query
  if (filters) {
    query.where(sql`${sql.raw(filters)}`);
  }

  // If sort is provided, add sorting to the query
  if (sort) {
    query.orderBy(sql`${sql.raw(sort)}`);
  }

  // Apply pagination (limit and offset)
  query.limit(limit).offset(offset);

  // Execute the query and return the data
  const data = await query.execute();
  return data;
}

public async getCount(filters?: string) {
  const query = db.select({ count: sql<number>`COUNT(*)` }).from(customers);  // Assuming `customers` is the table name

  // If filters are provided, add them to the query
  if (filters) {
    query.where(sql`${sql.raw(filters)}`);
  }

  // Execute the query and return the count
  const data = await query.execute();
  return data[0].count;
}

}
