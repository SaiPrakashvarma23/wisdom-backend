import { db } from "../lib/db"; 
import { customers } from "../schemas/customer"; 
import { Context } from 'hono';

const data=[
  { "name": "Eve Harper", "email": "eve.harper@example.com", "phone": "1234567894", "company": "Harper", "user_id": 1 },
  { "name": "Alice Johnson", "email": "alice.johnson@example.com", "phone": "1234567890", "company": "Tech Corp", "user_id": 1 },
  { "name": "Bob Brown", "email": "bob.brown@example.com", "phone": "1234567891", "company": "Blue Sky Inc", "user_id": 1 },
  { "name": "Cindy Blake", "email": "cindy.blake@example.com", "phone": "1234567892", "company": "Greenwood", "user_id": 1 },
  { "name": "David Stone", "email": "david.stone@example.com", "phone": "1234567893", "company": "Rockwell Ltd", "user_id": 1 },
  
  { "name": "Frank Lee", "email": "frank.lee@example.com", "phone": "2234567890", "company": "Visionary", "user_id": 2 },
  { "name": "Grace King", "email": "grace.king@example.com", "phone": "2234567891", "company": "Grand Enterprises", "user_id": 2 },
  { "name": "Hank Smith", "email": "hank.smith@example.com", "phone": "2234567892", "company": "Nexus Systems", "user_id": 2 },
  { "name": "Ivy Martin", "email": "ivy.martin@example.com", "phone": "2234567893", "company": "Ivy Innovations", "user_id": 2 },
  { "name": "Jake Williams", "email": "jake.williams@example.com", "phone": "2234567894", "company": "Swift Solutions", "user_id": 2 },
  
  { "name": "Leo Parker", "email": "leo.parker@example.com", "phone": "3234567890", "company": "Parker LLC", "user_id": 3 },
  { "name": "Mona Lee", "email": "mona.lee@example.com", "phone": "3234567891", "company": "DreamWorks", "user_id": 3 },
  { "name": "Nina Adams", "email": "nina.adams@example.com", "phone": "3234567892", "company": "Future Corp", "user_id": 3 },
  { "name": "Oscar Grant", "email": "oscar.grant@example.com", "phone": "3234567893", "company": "Omega Solutions", "user_id": 3 },
  { "name": "Paul White", "email": "paul.white@example.com", "phone": "3234567894", "company": "Infinity Systems", "user_id": 3 },
  
  { "name": "Quincy Harris", "email": "quincy.harris@example.com", "phone": "4234567890", "company": "Harris Technologies", "user_id": 4 },
  { "name": "Rita Scott", "email": "rita.scott@example.com", "phone": "4234567891", "company": "Redwood Enterprises", "user_id": 4 },
  { "name": "Steve Baker", "email": "steve.baker@example.com", "phone": "4234567892", "company": "Silicon Ventures", "user_id": 4 },
  { "name": "Tina Clark", "email": "tina.clark@example.com", "phone": "4234567893", "company": "Cloud Tech", "user_id": 4 },
  { "name": "Ursula Young", "email": "ursula.young@example.com", "phone": "4234567894", "company": "Xeno Systems", "user_id": 4 }
]

export class seedCustomers {
  public async insertCustomers(c: Context) {
    try {
      // Check the database connection before proceeding
      console.log("Checking database connection...");
      const isConnected = await db.select().from(customers).limit(1); // Example check to ensure connection works
      if (!isConnected) {
        return c.json({ message: 'Database connection failed' }, 500);
      }

      console.log("Inserting data into the database...");
      await db.insert(customers).values(data); // This is where insertion happens
      console.log("Data inserted successfully!");

      return c.json({ message: 'Products inserted successfully!', insertedProducts: data });

    } catch (error) {
      console.error('Error inserting products:', error);
      return c.json({ message: 'An error occurred while inserting products', error: (error as Error).message }, 500);
    }
  }
}
