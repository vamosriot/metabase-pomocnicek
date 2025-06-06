// schema.js – pulled in via ES modules
export const tables = {
  orders: {
    name: 'orders',
    columns: {
      id: 'id',
      created_at: 'created_at',
      status: 'status',
      total_price: 'total_price',
      customer_id: 'customer_id',
      shipping_address: 'shipping_address',
    },
  },
  customers: {
    name: 'customers',
    columns: {
      id: 'id',
      email: 'email',
      first_name: 'first_name',
      last_name: 'last_name',
      created_at: 'created_at',
    },
  },
  order_items: {
    name: 'order_items',
    columns: {
      id: 'id',
      order_id: 'order_id',
      product_id: 'product_id',
      quantity: 'quantity',
      price: 'price',
    },
  },
  products: {
    name: 'products',
    columns: {
      id: 'id',
      name: 'name',
      description: 'description',
      price: 'price',
      stock: 'stock',
      category_id: 'category_id',
    },
  },
};

export async function getSchema() {
  return Object.values(tables);
}
