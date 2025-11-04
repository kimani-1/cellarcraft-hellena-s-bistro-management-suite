import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound, isStr, Index } from './core-utils';
import { ProductEntity, CustomerEntity, SaleEntity, SupplierEntity, PurchaseOrderEntity, OnlineOrderEntity, EventEntity, StaffMemberEntity } from './entities';
import type { Product, Customer, Sale, StaffMember, Event as EventType, PurchaseOrder } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CellarCraft API' }}));
  // --- DANGER ZONE ---
  app.delete('/api/all-data', async (c) => {
    try {
      // Clearing one index is enough to trigger a full wipe of the DO storage.
      const index = new Index(c.env, ProductEntity.indexName);
      await index.clear();
      return ok(c, { message: 'All application data has been cleared.' });
    } catch (error) {
      console.error("Failed to clear all data:", error);
      return bad(c, "Failed to clear all data.");
    }
  });
  // --- Product Routes ---
  const products = new Hono<{ Bindings: Env }>();
  products.get('/', async (c) => {
    await ProductEntity.ensureSeed(c.env);
    const { items, next } = await ProductEntity.list(c.env);
    return ok(c, { items, next });
  });
  products.post('/', async (c) => {
    const body = await c.req.json<Partial<Product>>();
    if (!isStr(body.name) || !isStr(body.type) || !isStr(body.origin) || typeof body.price !== 'number' || typeof body.stockLevel !== 'number') {
      return bad(c, 'Missing required product fields');
    }
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: body.name,
      type: body.type as Product['type'],
      origin: body.origin,
      price: body.price,
      cost: body.cost || 0,
      stockLevel: body.stockLevel,
      lowStockThreshold: body.lowStockThreshold || 10,
      imageUrl: body.imageUrl || '',
      vintage: body.vintage
    };
    const product = await ProductEntity.create(c.env, newProduct);
    return ok(c, product);
  });
  products.get('/:id', async (c) => {
    const { id } = c.req.param();
    const product = new ProductEntity(c.env, id);
    if (!(await product.exists())) return notFound(c, 'Product not found');
    return ok(c, await product.getState());
  });
  products.delete('/:id', async (c) => {
    const { id } = c.req.param();
    const deleted = await ProductEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Product not found');
    return ok(c, { id });
  });
  app.route('/api/products', products);
  // --- Customer Routes ---
  const customers = new Hono<{ Bindings: Env }>();
  customers.get('/', async (c) => {
    await CustomerEntity.ensureSeed(c.env);
    const { items, next } = await CustomerEntity.list(c.env);
    return ok(c, { items, next });
  });
  customers.post('/', async (c) => {
    const body = await c.req.json<Partial<Customer>>();
    if (!isStr(body.name) || !isStr(body.phone) || !isStr(body.loyaltyTier)) {
      return bad(c, 'Missing required customer fields');
    }
    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      name: body.name,
      phone: body.phone,
      email: body.email,
      loyaltyTier: body.loyaltyTier as Customer['loyaltyTier'],
      purchaseHistory: [],
    };
    const customer = await CustomerEntity.create(c.env, newCustomer);
    return ok(c, customer);
  });
  app.route('/api/customers', customers);
  // --- Sale Routes ---
  const sales = new Hono<{ Bindings: Env }>();
  sales.get('/', async (c) => {
    await SaleEntity.ensureSeed(c.env);
    const { items, next } = await SaleEntity.list(c.env);
    return ok(c, { items, next });
  });
  sales.post('/', async (c) => {
    const body = await c.req.json<{ items: { productId: string; quantity: number; price: number }[]; total: number; customerId?: string; customerName?: string; paymentMethod: 'Mpesa' | 'Cash' }>();
    if (!body.items || body.items.length === 0 || typeof body.total !== 'number' || !body.paymentMethod) {
      return bad(c, 'Invalid sale data');
    }
    const newSale: Sale = {
      id: `sale_${crypto.randomUUID()}`,
      items: body.items,
      total: body.total,
      customerId: body.customerId,
      customerName: body.customerName || 'Walk-in',
      paymentMethod: body.paymentMethod,
      timestamp: Date.now(),
    };
    for (const item of body.items) {
      const product = new ProductEntity(c.env, item.productId);
      if (await product.exists()) {
        await product.mutate(p => ({ ...p, stockLevel: p.stockLevel - item.quantity }));
      }
    }
    const sale = await SaleEntity.create(c.env, newSale);
    return ok(c, sale);
  });
  app.route('/api/sales', sales);
  // --- Supplier Routes ---
  const suppliers = new Hono<{ Bindings: Env }>();
  suppliers.get('/', async (c) => {
    await SupplierEntity.ensureSeed(c.env);
    const { items, next } = await SupplierEntity.list(c.env);
    return ok(c, { items, next });
  });
  app.route('/api/suppliers', suppliers);
  // --- Purchase Order Routes ---
  const purchaseOrders = new Hono<{ Bindings: Env }>();
  purchaseOrders.get('/', async (c) => {
    await PurchaseOrderEntity.ensureSeed(c.env);
    const { items, next } = await PurchaseOrderEntity.list(c.env);
    return ok(c, { items, next });
  });
  purchaseOrders.post('/', async (c) => {
    const body = await c.req.json<Partial<PurchaseOrder>>();
    if (!isStr(body.supplierId) || !isStr(body.supplierName) || typeof body.expectedDeliveryDate !== 'number' || typeof body.itemCount !== 'number' || typeof body.totalValue !== 'number') {
      return bad(c, 'Missing required purchase order fields');
    }
    const newOrder: PurchaseOrder = {
      id: `PO-${String(Date.now()).slice(-6)}`,
      supplierId: body.supplierId,
      supplierName: body.supplierName,
      orderDate: Date.now(),
      expectedDeliveryDate: body.expectedDeliveryDate,
      status: 'Pending',
      itemCount: body.itemCount,
      totalValue: body.totalValue,
    };
    const order = await PurchaseOrderEntity.create(c.env, newOrder);
    return ok(c, order);
  });
  app.route('/api/purchase-orders', purchaseOrders);
  // --- Online Order Routes ---
  const onlineOrders = new Hono<{ Bindings: Env }>();
  onlineOrders.get('/', async (c) => {
    await OnlineOrderEntity.ensureSeed(c.env);
    const { items, next } = await OnlineOrderEntity.list(c.env);
    return ok(c, { items, next });
  });
  app.route('/api/online-orders', onlineOrders);
  // --- Event Routes ---
  const events = new Hono<{ Bindings: Env }>();
  events.get('/', async (c) => {
    await EventEntity.ensureSeed(c.env);
    const { items, next } = await EventEntity.list(c.env);
    return ok(c, { items, next });
  });
  events.post('/', async (c) => {
    const body = await c.req.json<Partial<EventType>>();
    if (!isStr(body.title) || !isStr(body.type) || typeof body.date !== 'number' || typeof body.maxCapacity !== 'number') {
      return bad(c, 'Missing required event fields');
    }
    const newEvent: EventType = {
      id: `evt_${crypto.randomUUID()}`,
      title: body.title,
      type: body.type as EventType['type'],
      date: body.date,
      maxCapacity: body.maxCapacity,
      attendees: 0,
    };
    const event = await EventEntity.create(c.env, newEvent);
    return ok(c, event);
  });
  app.route('/api/events', events);
  // --- Staff Member Routes ---
  const staff = new Hono<{ Bindings: Env }>();
  staff.get('/', async (c) => {
    await StaffMemberEntity.ensureSeed(c.env);
    const { items, next } = await StaffMemberEntity.list(c.env);
    return ok(c, { items, next });
  });
  staff.post('/', async (c) => {
    const body = await c.req.json<Partial<StaffMember>>();
    if (!isStr(body.name) || !isStr(body.email) || !isStr(body.phone) || !isStr(body.role)) {
      return bad(c, 'Missing required staff fields');
    }
    const newStaffMember: StaffMember = {
      id: `staff_${crypto.randomUUID()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      role: body.role as StaffMember['role'],
      status: 'Active',
    };
    const staffMember = await StaffMemberEntity.create(c.env, newStaffMember);
    return ok(c, staffMember);
  });
  app.route('/api/staff', staff);
}