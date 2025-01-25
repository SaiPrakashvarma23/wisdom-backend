// mapCustomerResponse.ts

export const mapCustomerResponse = (customer: any) => {
  return {
    id: customer.id, // Customer ID
    name: customer.name, // Customer's name
    email: customer.email, // Customer's email
    phone: customer.phone, // Customer's phone number
    company: customer.company || null, // Customer's company (null if not provided)
    user_id: customer.user_id, // User ID associated with the customer
    created_at: customer.created_at, // Timestamp of when the customer was created
    updated_at: customer.updated_at, // Timestamp of when the customer was last updated
  };
};
