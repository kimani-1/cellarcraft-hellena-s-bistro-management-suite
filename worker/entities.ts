import { IndexedEntity, Entity } from "./core-utils";
import type { Product, Customer, Sale, Supplier, PurchaseOrder, OnlineOrder, Event, StaffMember, StoreSettings } from "@shared/types";
import { MOCK_PRODUCTS, MOCK_CUSTOMERS, MOCK_SALES, MOCK_SUPPLIERS, MOCK_PURCHASE_ORDERS, MOCK_ONLINE_ORDERS, MOCK_EVENTS, MOCK_STAFF_MEMBERS } from "@shared/mock-data";
// PRODUCT ENTITY
export class ProductEntity extends IndexedEntity<Product> {
  static readonly entityName = "product";
  static readonly indexName = "products";
  static readonly initialState: Product = {
    id: "",
    name: "",
    type: 'Wine',
    origin: "",
    price: 0,
    cost: 0,
    stockLevel: 0,
    lowStockThreshold: 0,
    imageUrl: ""
  };
  static seedData = MOCK_PRODUCTS;
}
// CUSTOMER ENTITY
export class CustomerEntity extends IndexedEntity<Customer> {
  static readonly entityName = "customer";
  static readonly indexName = "customers";
  static readonly initialState: Customer = {
    id: "",
    name: "",
    phone: "",
    loyaltyTier: 'Bronze',
    purchaseHistory: []
  };
  static seedData = MOCK_CUSTOMERS;
}
// SALE ENTITY
export class SaleEntity extends IndexedEntity<Sale> {
  static readonly entityName = "sale";
  static readonly indexName = "sales";
  static readonly initialState: Sale = {
    id: "",
    items: [],
    total: 0,
    paymentMethod: 'Cash',
    timestamp: 0
  };
  static seedData = MOCK_SALES;
}
// SUPPLIER ENTITY
export class SupplierEntity extends IndexedEntity<Supplier> {
  static readonly entityName = "supplier";
  static readonly indexName = "suppliers";
  static readonly initialState: Supplier = {
    id: "",
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    category: 'Wine',
  };
  static seedData = MOCK_SUPPLIERS;
}
// PURCHASE ORDER ENTITY
export class PurchaseOrderEntity extends IndexedEntity<PurchaseOrder> {
  static readonly entityName = "purchaseOrder";
  static readonly indexName = "purchaseOrders";
  static readonly initialState: PurchaseOrder = {
    id: "",
    supplierId: "",
    supplierName: "",
    orderDate: 0,
    expectedDeliveryDate: 0,
    status: 'Pending',
    totalValue: 0,
    itemCount: 0,
  };
  static seedData = MOCK_PURCHASE_ORDERS;
}
// ONLINE ORDER ENTITY
export class OnlineOrderEntity extends IndexedEntity<OnlineOrder> {
  static readonly entityName = "onlineOrder";
  static readonly indexName = "onlineOrders";
  static readonly initialState: OnlineOrder = {
    id: "",
    customerName: "",
    orderDate: 0,
    total: 0,
    status: 'Pending Fulfillment',
    itemCount: 0,
  };
  static seedData = MOCK_ONLINE_ORDERS;
}
// EVENT ENTITY
export class EventEntity extends IndexedEntity<Event> {
  static readonly entityName = "event";
  static readonly indexName = "events";
  static readonly initialState: Event = {
    id: "",
    title: "",
    date: 0,
    type: 'Wine Tasting',
    attendees: 0,
    maxCapacity: 0,
  };
  static seedData = MOCK_EVENTS;
}
// STAFF MEMBER ENTITY
export class StaffMemberEntity extends IndexedEntity<StaffMember> {
  static readonly entityName = "staffMember";
  static readonly indexName = "staffMembers";
  static readonly initialState: StaffMember = {
    id: "",
    name: "",
    role: 'Clerk',
    email: "",
    phone: "",
    status: 'Active',
  };
  static seedData = MOCK_STAFF_MEMBERS;
}
// SETTINGS ENTITY (SINGLETON)
export class SettingsEntity extends Entity<StoreSettings> {
  static readonly entityName = "settings";
  static readonly initialState: StoreSettings = {
    storeName: "Hellena's Bistro",
    taxRate: 16,
    currency: "KSH",
  };
}