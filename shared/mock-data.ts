import type { Product, Kpi, Customer, Sale, Supplier, PurchaseOrder, OnlineOrder, Event, StaffMember } from './types';
export const MOCK_KPIS: Kpi[] = [
  {
    title: "Today's Sales",
    value: 'KSH 156,250',
    change: '+12.5%',
    changeType: 'increase',
  },
  {
    title: 'Weekly Sales',
    value: 'KSH 988,750',
    change: '+8.2%',
    changeType: 'increase',
  },
  {
    title: 'Inventory Level',
    value: '1,428 Units',
    change: '-1.5%',
    changeType: 'decrease',
  },
  {
    title: 'Low Stock Alerts',
    value: '12 Items',
    change: '+2',
    changeType: 'increase',
  },
];
export const MOCK_PRODUCTS: Product[] = [
  // Beers
  { id: 'prod_beer_001', name: 'Tusker Lager', type: 'Beer', origin: 'Kenya', price: 250, cost: 150, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-01-15T10:00:00Z').getTime() },
  { id: 'prod_beer_002', name: 'Tusker Can', type: 'Beer', origin: 'Kenya', price: 300, cost: 180, stockLevel: 120, lowStockThreshold: 24, createdAt: new Date('2023-02-20T10:00:00Z').getTime() },
  { id: 'prod_beer_003', name: 'Tusker Cider', type: 'Beer', origin: 'Kenya', price: 300, cost: 180, stockLevel: 80, lowStockThreshold: 24, createdAt: new Date('2023-09-01T10:00:00Z').getTime() },
  { id: 'prod_beer_004', name: 'Tusker Lite', type: 'Beer', origin: 'Kenya', price: 250, cost: 150, stockLevel: 90, lowStockThreshold: 24, createdAt: new Date('2022-12-10T10:00:00Z').getTime() },
  { id: 'prod_beer_005', name: 'Tusker Malt', type: 'Beer', origin: 'Kenya', price: 260, cost: 160, stockLevel: 70, lowStockThreshold: 24, createdAt: new Date('2023-08-15T10:00:00Z').getTime() },
  { id: 'prod_beer_006', name: 'Pilsner', type: 'Beer', origin: 'Kenya', price: 240, cost: 140, stockLevel: 150, lowStockThreshold: 36, createdAt: new Date('2023-03-05T10:00:00Z').getTime() },
  { id: 'prod_beer_007', name: 'Guinness', type: 'Beer', origin: 'Ireland', price: 350, cost: 220, stockLevel: 60, lowStockThreshold: 24, createdAt: new Date('2023-09-10T10:00:00Z').getTime() },
  { id: 'prod_beer_008', name: 'White Cap Can', type: 'Beer', origin: 'Kenya', price: 280, cost: 170, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-05-25T10:00:00Z').getTime() },
  { id: 'prod_beer_009', name: 'Heineken', type: 'Beer', origin: 'Netherlands', price: 320, cost: 200, stockLevel: 50, lowStockThreshold: 12, createdAt: new Date('2023-10-01T10:00:00Z').getTime() },
  { id: 'prod_beer_010', name: 'Savannah Dry 330ml', type: 'Beer', origin: 'South Africa', price: 350, cost: 230, stockLevel: 40, lowStockThreshold: 12, createdAt: new Date('2023-06-18T10:00:00Z').getTime() },
  { id: 'prod_beer_011', name: 'Balozi', type: 'Beer', origin: 'Kenya', price: 220, cost: 130, stockLevel: 200, lowStockThreshold: 48, createdAt: new Date('2022-11-22T10:00:00Z').getTime() },
  // Spirits - Gin
  { id: 'prod_gin_001', name: 'Gilbeys 250ml', type: 'Spirit', origin: 'England', price: 450, cost: 300, stockLevel: 50, lowStockThreshold: 10, createdAt: new Date('2023-07-01T10:00:00Z').getTime() },
  { id: 'prod_gin_002', name: 'Gilbeys 350ml', type: 'Spirit', origin: 'England', price: 650, cost: 450, stockLevel: 40, lowStockThreshold: 10, createdAt: new Date('2023-08-02T10:00:00Z').getTime() },
  { id: 'prod_gin_003', name: 'Gilbeys 750ml', type: 'Spirit', origin: 'England', price: 1300, cost: 900, stockLevel: 30, lowStockThreshold: 5, createdAt: new Date('2023-09-03T10:00:00Z').getTime() },
  { id: 'prod_gin_004', name: 'Gordons Gin 1L', type: 'Spirit', origin: 'England', price: 2200, cost: 1600, stockLevel: 20, lowStockThreshold: 5, createdAt: new Date('2023-04-11T10:00:00Z').getTime() },
  { id: 'prod_gin_005', name: 'Gordons Pink Gin', type: 'Spirit', origin: 'England', price: 2400, cost: 1750, stockLevel: 15, lowStockThreshold: 5, createdAt: new Date('2023-09-15T10:00:00Z').getTime() },
  { id: 'prod_gin_006', name: 'Tanqueray London Gin 750ml', type: 'Spirit', origin: 'England', price: 3000, cost: 2200, stockLevel: 18, lowStockThreshold: 5, createdAt: new Date('2023-05-16T10:00:00Z').getTime() },
  { id: 'prod_gin_007', name: 'Tanqueray Sevilla Gin', type: 'Spirit', origin: 'England', price: 3200, cost: 2350, stockLevel: 12, lowStockThreshold: 5, createdAt: new Date('2023-10-02T10:00:00Z').getTime() },
  { id: 'prod_gin_008', name: 'Bombay 750ml', type: 'Spirit', origin: 'England', price: 3100, cost: 2300, stockLevel: 15, lowStockThreshold: 5, createdAt: new Date('2023-02-18T10:00:00Z').getTime() },
  { id: 'prod_gin_009', name: 'Best Gin 250ml', type: 'Spirit', origin: 'Kenya', price: 300, cost: 200, stockLevel: 80, lowStockThreshold: 20, createdAt: new Date('2023-08-20T10:00:00Z').getTime() },
  { id: 'prod_gin_010', name: 'Best Gin 750ml', type: 'Spirit', origin: 'Kenya', price: 800, cost: 550, stockLevel: 60, lowStockThreshold: 15, createdAt: new Date('2023-08-21T10:00:00Z').getTime() },
  { id: 'prod_gin_011', name: 'Gordons Can', type: 'Spirit', origin: 'England', price: 350, cost: 250, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-09-25T10:00:00Z').getTime() },
  // Spirits - Vodka
  { id: 'prod_vodka_001', name: 'Smirnoff Red 250ml', type: 'Spirit', origin: 'Russia', price: 500, cost: 350, stockLevel: 60, lowStockThreshold: 12, createdAt: new Date('2023-01-20T10:00:00Z').getTime() },
  { id: 'prod_vodka_002', name: 'Smirnoff 350ml', type: 'Spirit', origin: 'Russia', price: 700, cost: 500, stockLevel: 50, lowStockThreshold: 12, createdAt: new Date('2023-03-22T10:00:00Z').getTime() },
  { id: 'prod_vodka_003', name: 'Smirnoff 750ml', type: 'Spirit', origin: 'Russia', price: 1400, cost: 1000, stockLevel: 40, lowStockThreshold: 8, createdAt: new Date('2023-09-05T10:00:00Z').getTime() },
  { id: 'prod_vodka_004', name: 'Chrome Vodka 250ml', type: 'Spirit', origin: 'Kenya', price: 320, cost: 220, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-06-30T10:00:00Z').getTime() },
  { id: 'prod_vodka_005', name: 'Chrome Vodka 750ml', type: 'Spirit', origin: 'Kenya', price: 850, cost: 600, stockLevel: 70, lowStockThreshold: 18, createdAt: new Date('2023-08-10T10:00:00Z').getTime() },
  // Spirits - Whiskey
  { id: 'prod_whiskey_001', name: 'Jack Daniels 750ml', type: 'Spirit', origin: 'USA', price: 3500, cost: 2500, stockLevel: 25, lowStockThreshold: 6, createdAt: new Date('2022-10-15T10:00:00Z').getTime() },
  { id: 'prod_whiskey_002', name: 'Jameson 750ml', type: 'Spirit', origin: 'Ireland', price: 2800, cost: 2000, stockLevel: 30, lowStockThreshold: 8, createdAt: new Date('2023-09-12T10:00:00Z').getTime() },
  { id: 'prod_whiskey_003', name: 'Johnnie Walker Black Label 750ml', type: 'Spirit', origin: 'Scotland', price: 4000, cost: 2900, stockLevel: 20, lowStockThreshold: 5, createdAt: new Date('2023-04-01T10:00:00Z').getTime() },
  { id: 'prod_whiskey_004', name: 'Johnnie Walker Black Label 1L', type: 'Spirit', origin: 'Scotland', price: 5200, cost: 3800, stockLevel: 15, lowStockThreshold: 5, createdAt: new Date('2023-08-18T10:00:00Z').getTime() },
  { id: 'prod_whiskey_005', name: 'Johnnie Walker Red Label 250ml', type: 'Spirit', origin: 'Scotland', price: 600, cost: 400, stockLevel: 50, lowStockThreshold: 12, createdAt: new Date('2023-02-05T10:00:00Z').getTime() },
  { id: 'prod_whiskey_006', name: 'Johnnie Walker Red Label 750ml', type: 'Spirit', origin: 'Scotland', price: 1600, cost: 1100, stockLevel: 40, lowStockThreshold: 10, createdAt: new Date('2023-09-20T10:00:00Z').getTime() },
  { id: 'prod_whiskey_007', name: 'Grants 750ml', type: 'Spirit', origin: 'Scotland', price: 1800, cost: 1300, stockLevel: 35, lowStockThreshold: 10, createdAt: new Date('2023-05-10T10:00:00Z').getTime() },
  { id: 'prod_whiskey_008', name: 'William Lawsons 750ml', type: 'Spirit', origin: 'Scotland', price: 1700, cost: 1200, stockLevel: 40, lowStockThreshold: 10, createdAt: new Date('2023-08-25T10:00:00Z').getTime() },
  { id: 'prod_whiskey_009', name: 'Singleton Dufftown 12yrs 750ml', type: 'Spirit', origin: 'Scotland', price: 5500, cost: 4000, stockLevel: 10, lowStockThreshold: 3, createdAt: new Date('2023-01-30T10:00:00Z').getTime() },
  { id: 'prod_whiskey_010', name: 'Best Whiskey 250ml', type: 'Spirit', origin: 'Kenya', price: 350, cost: 240, stockLevel: 70, lowStockThreshold: 20, createdAt: new Date('2023-09-28T10:00:00Z').getTime() },
  { id: 'prod_whiskey_011', name: 'Best Whiskey 750ml', type: 'Spirit', origin: 'Kenya', price: 900, cost: 650, stockLevel: 50, lowStockThreshold: 15, createdAt: new Date('2023-09-29T10:00:00Z').getTime() },
  { id: 'prod_whiskey_012', name: 'Black and White 375ml', type: 'Spirit', origin: 'Scotland', price: 800, cost: 550, stockLevel: 40, lowStockThreshold: 10, createdAt: new Date('2023-03-15T10:00:00Z').getTime() },
  { id: 'prod_whiskey_013', name: 'Black and White 1L', type: 'Spirit', origin: 'Scotland', price: 2000, cost: 1400, stockLevel: 30, lowStockThreshold: 8, createdAt: new Date('2023-08-01T10:00:00Z').getTime() },
  { id: 'prod_whiskey_014', name: 'VAT 69 375ml', type: 'Spirit', origin: 'Scotland', price: 750, cost: 500, stockLevel: 30, lowStockThreshold: 10, createdAt: new Date('2023-04-20T10:00:00Z').getTime() },
  { id: 'prod_whiskey_015', name: 'VAT 69 750ml', type: 'Spirit', origin: 'Scotland', price: 1500, cost: 1050, stockLevel: 25, lowStockThreshold: 8, createdAt: new Date('2023-09-02T10:00:00Z').getTime() },
  // Spirits - Rum
  { id: 'prod_rum_001', name: 'Captain Morgan 750ml', type: 'Spirit', origin: 'Jamaica', price: 1500, cost: 1050, stockLevel: 40, lowStockThreshold: 10, createdAt: new Date('2023-06-01T10:00:00Z').getTime() },
  { id: 'prod_rum_002', name: 'Kenya Cane 250ml', type: 'Spirit', origin: 'Kenya', price: 300, cost: 200, stockLevel: 120, lowStockThreshold: 30, createdAt: new Date('2023-08-05T10:00:00Z').getTime() },
  { id: 'prod_rum_003', name: 'Kenya Cane 750ml', type: 'Spirit', origin: 'Kenya', price: 800, cost: 550, stockLevel: 80, lowStockThreshold: 20, createdAt: new Date('2023-08-06T10:00:00Z').getTime() },
  // Spirits - Brandy & Cognac
  { id: 'prod_brandy_001', name: 'Richot 250ml', type: 'Spirit', origin: 'France', price: 500, cost: 350, stockLevel: 50, lowStockThreshold: 12, createdAt: new Date('2023-02-10T10:00:00Z').getTime() },
  { id: 'prod_brandy_002', name: 'V&A 250ml', type: 'Spirit', origin: 'Kenya', price: 480, cost: 330, stockLevel: 60, lowStockThreshold: 15, createdAt: new Date('2023-09-11T10:00:00Z').getTime() },
  { id: 'prod_brandy_003', name: 'Viceroy', type: 'Spirit', origin: 'South Africa', price: 1600, cost: 1150, stockLevel: 30, lowStockThreshold: 8, createdAt: new Date('2023-05-20T10:00:00Z').getTime() },
  { id: 'prod_cognac_001', name: 'Hennessy VS 750ml', type: 'Spirit', origin: 'France', price: 6000, cost: 4500, stockLevel: 15, lowStockThreshold: 4, createdAt: new Date('2022-09-01T10:00:00Z').getTime() },
  { id: 'prod_cognac_002', name: 'Hennessy VS 1L', type: 'Spirit', origin: 'France', price: 7800, cost: 5800, stockLevel: 10, lowStockThreshold: 3, createdAt: new Date('2023-08-15T10:00:00Z').getTime() },
  { id: 'prod_cognac_003', name: 'Martel VS 700ml', type: 'Spirit', origin: 'France', price: 5500, cost: 4100, stockLevel: 12, lowStockThreshold: 4, createdAt: new Date('2023-03-25T10:00:00Z').getTime() },
  { id: 'prod_cognac_004', name: 'Martel VSOP 700ml', type: 'Spirit', origin: 'France', price: 8500, cost: 6400, stockLevel: 8, lowStockThreshold: 2, createdAt: new Date('2023-09-18T10:00:00Z').getTime() },
  { id: 'prod_cognac_005', name: 'Martel Blue Swift', type: 'Spirit', origin: 'France', price: 9500, cost: 7100, stockLevel: 6, lowStockThreshold: 2, createdAt: new Date('2023-10-03T10:00:00Z').getTime() },
  // Spirits - Tequila
  { id: 'prod_tequila_001', name: 'Jose Cuervo Silver 750ml', type: 'Spirit', origin: 'Mexico', price: 2500, cost: 1800, stockLevel: 20, lowStockThreshold: 5, createdAt: new Date('2023-04-12T10:00:00Z').getTime() },
  { id: 'prod_tequila_002', name: 'Jose Cuervo Gold 750ml', type: 'Spirit', origin: 'Mexico', price: 2600, cost: 1900, stockLevel: 20, lowStockThreshold: 5, createdAt: new Date('2023-08-22T10:00:00Z').getTime() },
  { id: 'prod_tequila_003', name: 'Camino Clear 750ml', type: 'Spirit', origin: 'Mexico', price: 2200, cost: 1600, stockLevel: 25, lowStockThreshold: 8, createdAt: new Date('2023-01-18T10:00:00Z').getTime() },
  { id: 'prod_tequila_004', name: 'Camino Gold 750ml', type: 'Spirit', origin: 'Mexico', price: 2300, cost: 1700, stockLevel: 25, lowStockThreshold: 8, createdAt: new Date('2023-09-23T10:00:00Z').getTime() },
  // Other Spirits
  { id: 'prod_spirit_001', name: 'Konyagi 250ml', type: 'Spirit', origin: 'Tanzania', price: 280, cost: 180, stockLevel: 150, lowStockThreshold: 36, createdAt: new Date('2023-07-10T10:00:00Z').getTime() },
  { id: 'prod_spirit_002', name: 'Konyagi 750ml', type: 'Spirit', origin: 'Tanzania', price: 750, cost: 500, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-07-11T10:00:00Z').getTime() },
  { id: 'prod_spirit_003', name: 'Kibao 250ml', type: 'Spirit', origin: 'Kenya', price: 250, cost: 160, stockLevel: 200, lowStockThreshold: 48, createdAt: new Date('2023-08-14T10:00:00Z').getTime() },
  { id: 'prod_spirit_004', name: 'Kibao 750ml', type: 'Spirit', origin: 'Kenya', price: 700, cost: 480, stockLevel: 120, lowStockThreshold: 24, createdAt: new Date('2023-08-15T10:00:00Z').getTime() },
  { id: 'prod_spirit_005', name: 'Triple Ace 250ml', type: 'Spirit', origin: 'Kenya', price: 280, cost: 190, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-09-16T10:00:00Z').getTime() },
  { id: 'prod_spirit_006', name: 'General Meakins 250ml', type: 'Spirit', origin: 'Kenya', price: 300, cost: 200, stockLevel: 80, lowStockThreshold: 20, createdAt: new Date('2023-05-05T10:00:00Z').getTime() },
  { id: 'prod_spirit_007', name: 'General Meakins 750ml', type: 'Spirit', origin: 'Kenya', price: 800, cost: 550, stockLevel: 60, lowStockThreshold: 15, createdAt: new Date('2023-05-06T10:00:00Z').getTime() },
  { id: 'prod_spirit_008', name: 'Origin 250ml', type: 'Spirit', origin: 'Kenya', price: 320, cost: 220, stockLevel: 90, lowStockThreshold: 24, createdAt: new Date('2023-09-19T10:00:00Z').getTime() },
  { id: 'prod_spirit_009', name: 'Origin 750ml', type: 'Spirit', origin: 'Kenya', price: 850, cost: 600, stockLevel: 70, lowStockThreshold: 18, createdAt: new Date('2023-09-20T10:00:00Z').getTime() },
  { id: 'prod_spirit_010', name: 'County 250ml', type: 'Spirit', origin: 'Kenya', price: 280, cost: 190, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-06-12T10:00:00Z').getTime() },
  { id: 'prod_spirit_011', name: 'County 750ml', type: 'Spirit', origin: 'Kenya', price: 750, cost: 520, stockLevel: 80, lowStockThreshold: 20, createdAt: new Date('2023-06-13T10:00:00Z').getTime() },
  // Liqueurs
  { id: 'prod_liqueur_001', name: 'Baileys 750ml', type: 'Liqueur', origin: 'Ireland', price: 2800, cost: 2000, stockLevel: 20, lowStockThreshold: 5, createdAt: new Date('2023-02-28T10:00:00Z').getTime() },
  { id: 'prod_liqueur_002', name: 'Jägermeister 700ml', type: 'Liqueur', origin: 'Germany', price: 2900, cost: 2100, stockLevel: 18, lowStockThreshold: 5, createdAt: new Date('2023-09-08T10:00:00Z').getTime() },
  { id: 'prod_liqueur_003', name: 'Jägermeister 1L', type: 'Liqueur', origin: 'Germany', price: 3800, cost: 2800, stockLevel: 12, lowStockThreshold: 4, createdAt: new Date('2023-09-09T10:00:00Z').getTime() },
  // Wines
  { id: 'prod_wine_001', name: 'Four Cousins Sweet Red', type: 'Wine', origin: 'South Africa', price: 1200, cost: 800, stockLevel: 40, lowStockThreshold: 10, createdAt: new Date('2023-08-30T10:00:00Z').getTime() },
  { id: 'prod_wine_002', name: 'Cellar Cask 750ml', type: 'Wine', origin: 'South Africa', price: 1100, cost: 750, stockLevel: 50, lowStockThreshold: 12, createdAt: new Date('2023-04-04T10:00:00Z').getTime() },
  { id: 'prod_wine_003', name: 'Casa Buena 1L', type: 'Wine', origin: 'Chile', price: 1500, cost: 1000, stockLevel: 30, lowStockThreshold: 8, createdAt: new Date('2023-09-14T10:00:00Z').getTime() },
  { id: 'prod_wine_004', name: 'Four Cousins Sweet White', type: 'Wine', origin: 'South Africa', price: 1200, cost: 800, stockLevel: 35, lowStockThreshold: 10, createdAt: new Date('2023-08-31T10:00:00Z').getTime() },
  // Ready to Drink (RTDs)
  { id: 'prod_rtd_001', name: 'Smirnoff Ice Guarana', type: 'Liqueur', origin: 'Global', price: 280, cost: 180, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-09-01T10:00:00Z').getTime() },
  { id: 'prod_rtd_002', name: 'Smirnoff Ice Black', type: 'Liqueur', origin: 'Global', price: 280, cost: 180, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-09-02T10:00:00Z').getTime() },
  { id: 'prod_rtd_003', name: 'Hunters 250ml', type: 'Liqueur', origin: 'South Africa', price: 300, cost: 200, stockLevel: 80, lowStockThreshold: 20, createdAt: new Date('2023-06-20T10:00:00Z').getTime() },
  { id: 'prod_rtd_004', name: 'Hunters 750ml', type: 'Liqueur', origin: 'South Africa', price: 800, cost: 550, stockLevel: 50, lowStockThreshold: 12, createdAt: new Date('2023-06-21T10:00:00Z').getTime() },
  { id: 'prod_rtd_005', name: 'Pineapple Punch', type: 'Liqueur', origin: 'Kenya', price: 250, cost: 160, stockLevel: 120, lowStockThreshold: 30, createdAt: new Date('2023-08-25T10:00:00Z').getTime() },
  { id: 'prod_rtd_006', name: 'K.O', type: 'Liqueur', origin: 'Kenya', price: 250, cost: 160, stockLevel: 120, lowStockThreshold: 30, createdAt: new Date('2023-08-26T10:00:00Z').getTime() },
  { id: 'prod_rtd_007', name: 'Manyatta', type: 'Liqueur', origin: 'Kenya', price: 260, cost: 170, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-09-27T10:00:00Z').getTime() },
  { id: 'prod_rtd_008', name: 'Snap', type: 'Liqueur', origin: 'Kenya', price: 250, cost: 160, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-05-15T10:00:00Z').getTime() },
  { id: 'prod_rtd_009', name: 'Crazy Cock', type: 'Liqueur', origin: 'Kenya', price: 250, cost: 160, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-09-15T10:00:00Z').getTime() },
  { id: 'prod_rtd_010', name: 'All Seasons', type: 'Liqueur', origin: 'Kenya', price: 250, cost: 160, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-04-18T10:00:00Z').getTime() },
  // Non-Alcoholic
  { id: 'prod_nonalc_001', name: 'Red Bull', type: 'Liqueur', origin: 'Austria', price: 250, cost: 150, stockLevel: 80, lowStockThreshold: 20, createdAt: new Date('2023-09-01T10:00:00Z').getTime() },
  { id: 'prod_nonalc_002', name: 'Monster', type: 'Liqueur', origin: 'USA', price: 300, cost: 200, stockLevel: 70, lowStockThreshold: 20, createdAt: new Date('2023-08-15T10:00:00Z').getTime() },
  { id: 'prod_nonalc_003', name: 'Predator', type: 'Liqueur', origin: 'Global', price: 150, cost: 90, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-09-10T10:00:00Z').getTime() },
  { id: 'prod_nonalc_004', name: 'Power Play', type: 'Liqueur', origin: 'Global', price: 150, cost: 90, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-09-11T10:00:00Z').getTime() },
  { id: 'prod_nonalc_005', name: 'Coke 400ml', type: 'Liqueur', origin: 'Global', price: 80, cost: 50, stockLevel: 200, lowStockThreshold: 48, createdAt: new Date('2023-03-01T10:00:00Z').getTime() },
  { id: 'prod_nonalc_006', name: 'Coke 1.25L', type: 'Liqueur', origin: 'Global', price: 150, cost: 100, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-03-02T10:00:00Z').getTime() },
  { id: 'prod_nonalc_007', name: 'Minute Maid 500ml', type: 'Liqueur', origin: 'Global', price: 100, cost: 60, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-08-20T10:00:00Z').getTime() },
  { id: 'prod_nonalc_008', name: 'Minute Maid 1L', type: 'Liqueur', origin: 'Global', price: 180, cost: 120, stockLevel: 80, lowStockThreshold: 20, createdAt: new Date('2023-08-21T10:00:00Z').getTime() },
  { id: 'prod_nonalc_009', name: 'Del Monte', type: 'Liqueur', origin: 'Global', price: 200, cost: 140, stockLevel: 80, lowStockThreshold: 20, createdAt: new Date('2023-05-25T10:00:00Z').getTime() },
  { id: 'prod_nonalc_010', name: 'Water Bottle 500ml', type: 'Liqueur', origin: 'Kenya', price: 50, cost: 20, stockLevel: 300, lowStockThreshold: 72, createdAt: new Date('2023-09-25T10:00:00Z').getTime() },
  { id: 'prod_nonalc_011', name: 'Water 1L', type: 'Liqueur', origin: 'Kenya', price: 80, cost: 40, stockLevel: 200, lowStockThreshold: 48, createdAt: new Date('2023-09-26T10:00:00Z').getTime() },
  { id: 'prod_nonalc_012', name: 'Lemonade', type: 'Liqueur', origin: 'Kenya', price: 120, cost: 70, stockLevel: 100, lowStockThreshold: 24, createdAt: new Date('2023-07-15T10:00:00Z').getTime() },
  // Others
  { id: 'prod_other_001', name: 'Dunhill', type: 'Liqueur', origin: 'UK', price: 400, cost: 300, stockLevel: 100, lowStockThreshold: 20, createdAt: new Date('2023-01-10T10:00:00Z').getTime() },
  { id: 'prod_other_002', name: 'Safari Cigars', type: 'Liqueur', origin: 'Kenya', price: 300, cost: 200, stockLevel: 100, lowStockThreshold: 20, createdAt: new Date('2023-08-10T10:00:00Z').getTime() },
];
export const MOCK_CUSTOMERS: Customer[] = [
    { id: 'cust_001', name: 'Alice Johnson', phone: '254712345678', loyaltyTier: 'Gold', purchaseHistory: ['sale_001', 'sale_003'] },
    { id: 'cust_002', name: 'Bob Williams', phone: '254723456789', loyaltyTier: 'Silver', purchaseHistory: ['sale_002'] },
    { id: 'cust_003', name: 'Charlie Brown', phone: '254734567890', loyaltyTier: 'Bronze', purchaseHistory: [] },
    { id: 'cust_004', name: 'Diana Miller', phone: '254745678901', loyaltyTier: 'VIP', purchaseHistory: ['sale_004', 'sale_005', 'sale_006'] },
    { id: 'cust_005', name: 'Ethan Davis', phone: '254756789012', loyaltyTier: 'Silver', purchaseHistory: ['sale_007'] },
];
export const MOCK_SALES: Sale[] = [
  { id: 'sale_001', items: [{ productId: 'prod_beer_001', quantity: 2, price: 250.0 }], total: 500.0, customerId: 'cust_001', customerName: 'Alice Johnson', paymentMethod: 'Mpesa', timestamp: new Date('2023-10-01T10:00:00Z').getTime() },
  { id: 'sale_002', items: [{ productId: 'prod_gin_003', quantity: 1, price: 1300.0 }, { productId: 'prod_nonalc_005', quantity: 4, price: 80.0 }], total: 1620.0, customerId: 'cust_002', customerName: 'Bob Williams', paymentMethod: 'Cash', timestamp: new Date('2023-10-02T14:30:00Z').getTime() },
  { id: 'sale_003', items: [{ productId: 'prod_wine_001', quantity: 1, price: 1200.0 }], total: 1200.0, customerId: 'cust_001', customerName: 'Alice Johnson', paymentMethod: 'Mpesa', timestamp: new Date('2023-10-03T18:00:00Z').getTime() },
  { id: 'sale_004', items: [{ productId: 'prod_cognac_001', quantity: 1, price: 6000.0 }], total: 6000.0, customerId: 'cust_004', customerName: 'Diana Miller', paymentMethod: 'Mpesa', timestamp: new Date('2023-10-04T12:00:00Z').getTime() },
  { id: 'sale_005', items: [{ productId: 'prod_whiskey_002', quantity: 2, price: 2800.0 }], total: 5600.0, customerId: 'cust_004', customerName: 'Diana Miller', paymentMethod: 'Cash', timestamp: new Date('2023-10-05T19:45:00Z').getTime() },
];
export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 'sup_001', name: 'East African Breweries', contactPerson: 'John Doe', phone: '254711223344', email: 'john@eabl.com', category: 'Local Craft' },
  { id: 'sup_002', name: 'Pernod Ricard Kenya', contactPerson: 'Jane Smith', phone: '254722334455', email: 'jane@pernod-ricard.com', category: 'International Imports' },
  { id: 'sup_003', name: 'Wow Beverages', contactPerson: 'Peter Jones', phone: '254733445566', email: 'peter@wowbeverages.com', category: 'Spirits' },
  { id: 'sup_004', name: 'Viva Global', contactPerson: 'Mary Anne', phone: '254744556677', email: 'mary@vivaglobal.com', category: 'Wine' },
];
export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-001', supplierId: 'sup_001', supplierName: 'East African Breweries', orderDate: new Date('2023-10-01').getTime(), expectedDeliveryDate: new Date('2023-10-15').getTime(), status: 'Delivered', totalValue: 150000, itemCount: 200 },
  { id: 'PO-002', supplierId: 'sup_002', supplierName: 'Pernod Ricard Kenya', orderDate: new Date('2023-10-05').getTime(), expectedDeliveryDate: new Date('2023-10-12').getTime(), status: 'Shipped', totalValue: 85000, itemCount: 50 },
  { id: 'PO-003', supplierId: 'sup_004', supplierName: 'Viva Global', orderDate: new Date('2023-10-08').getTime(), expectedDeliveryDate: new Date('2023-10-10').getTime(), status: 'Pending', totalValue: 120000, itemCount: 100 },
];
export const MOCK_ONLINE_ORDERS: OnlineOrder[] = [
  { id: 'WEB-1001', customerName: 'Grace Kelly', orderDate: new Date().getTime() - 86400000 * 1, total: 1800.0, status: 'Shipped', itemCount: 1 },
  { id: 'WEB-1002', customerName: 'Frank Sinatra', orderDate: new Date().getTime() - 86400000 * 2, total: 2500.0, status: 'Delivered', itemCount: 1 },
  { id: 'WEB-1003', customerName: 'Audrey Hepburn', orderDate: new Date().getTime() - 3600000 * 3, total: 7000.0, status: 'Pending Fulfillment', itemCount: 2 },
];
export const MOCK_EVENTS: Event[] = [
  { id: 'evt_001', title: 'Bordeaux Grand Cru Tasting', date: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 18).getTime(), type: 'Wine Tasting', attendees: 18, maxCapacity: 20 },
  { id: 'evt_002', title: 'New World Wines Launch', date: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 19).getTime(), type: 'Launch Party', attendees: 35, maxCapacity: 50 },
  { id: 'evt_003', title: 'Whiskey Blending Masterclass', date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5, 17).getTime(), type: 'Class', attendees: 12, maxCapacity: 15 },
];
export const MOCK_STAFF_MEMBERS: StaffMember[] = [
  { id: 'staff_001', name: 'Hellena Smith', role: 'Owner', email: 'hellena@cellarcraft.com', phone: '254700112233', status: 'Active' },
  { id: 'staff_002', name: 'Marcus King', role: 'Manager', email: 'marcus@cellarcraft.com', phone: '254711223344', status: 'Active' },
  { id: 'staff_003', name: 'Olivia Chen', role: 'Sommelier', email: 'olivia@cellarcraft.com', phone: '254722334455', status: 'Active' },
  { id: 'staff_004', name: 'David Lee', role: 'Clerk', email: 'david@cellarcraft.com', phone: '254733445566', status: 'Active' },
];