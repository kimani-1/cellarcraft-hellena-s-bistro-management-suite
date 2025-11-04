export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type Product = {
  id: string;
  name: string;
  type: 'Wine' | 'Spirit' | 'Liqueur' | 'Beer';
  origin: string;
  vintage?: number;
  price: number;
  cost?: number;
  stockLevel: number;
  lowStockThreshold: number;
  imageUrl?: string;
  createdAt: number;
};
export type Sale = {
  id: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  customerId?: string;
  customerName?: string;
  paymentMethod: 'Mpesa' | 'Cash';
  timestamp: number;
};
export type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'VIP';
  purchaseHistory: string[]; // Array of Sale IDs
};
export type Kpi = {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
};
export type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: 'Wine' | 'Spirits' | 'International Imports' | 'Local Craft';
};
export type PurchaseOrder = {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: number;
  expectedDeliveryDate: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalValue: number;
  itemCount: number;
  notes?: string;
};
export type OnlineOrder = {
  id: string;
  customerName: string;
  orderDate: number;
  total: number;
  status: 'Pending Fulfillment' | 'Shipped' | 'Delivered';
  itemCount: number;
};
export type Event = {
  id: string;
  title: string;
  date: number;
  type: 'Wine Tasting' | 'Launch Party' | 'Private Event' | 'Class';
  attendees: number;
  maxCapacity: number;
};
export type StaffMember = {
  id: string;
  name: string;
  role: 'Owner' | 'Manager' | 'Clerk' | 'Sommelier';
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
};
export type StoreSettings = {
  storeName: string;
  taxRate: number;
  currency: string;
};