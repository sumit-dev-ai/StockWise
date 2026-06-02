CREATE DATABASE IF NOT EXISTS stockwise;
USE stockwise;

-- Users table to store user information
CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- for google sign-in, we can use google_id to uniquely identify users
    google_id VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    -- avatar_url can store the URL of the user's profile picture from Google
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- store table with foreign key to users
-- STORES
CREATE TABLE IF NOT EXISTS stores(
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(255),
  business_type VARCHAR(100),
  currency VARCHAR(10) DEFAULT 'INR',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_user_store 
  FOREIGN KEY (user_id) 
  REFERENCES users(id) 
  ON DELETE CASCADE

);


-- Master categories table to store predefined categories
-- MASTER CATEGORIES
CREATE TABLE IF NOT EXISTS master_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255),
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Store categories table to store categories specific to each store,
--  with optional link to master categories

-- STORE CATEGORIES
CREATE TABLE IF NOT EXISTS store_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  master_category_id INT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  is_custom BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_store_categories_store
    FOREIGN KEY (store_id)
    REFERENCES stores(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_store_categories_master_category
    FOREIGN KEY (master_category_id)
    REFERENCES master_categories(id)
    ON DELETE SET NULL,


  CONSTRAINT unique_store_category_name
    UNIQUE (store_id, name)
);


-- Suppliers table to store supplier information for each store
-- SUPPLIERS
CREATE TABLE IF NOT EXISTS suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(150),
  address VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_suppliers_store
    FOREIGN KEY (store_id)
    REFERENCES stores(id)
    ON DELETE CASCADE
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products(
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- every product must belong to a store, so store_id is NOT NULL
    store_id INT NOT NULL,      
    store_category_id INT NOT NULL,
    supplier_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    description TEXT,
    cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    selling_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock_quantity INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'pcs',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_store_product
    FOREIGN KEY (store_id)
    REFERENCES stores(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_store_category_product
    FOREIGN KEY (store_category_id)
    REFERENCES store_categories(id)
    ON DELETE RESTRICT,

    CONSTRAINT fk_suppliers_product
    FOREIGN KEY (supplier_id)
    REFERENCES suppliers(id)
    ON DELETE RESTRICT,

    CONSTRAINT unique_product_sku_per_store
    UNIQUE (store_id, sku),

    CONSTRAINT check_product_stock_non_negative
    CHECK (stock_quantity >= 0),

    CONSTRAINT check_low_stock_threshold_non_negative
  CHECK (low_stock_threshold >= 0),

    CONSTRAINT check_product_prices_non_negative
    CHECK (cost_price >= 0 AND selling_price >= 0)

);

-- STOCK PURCHASES
CREATE TABLE IF NOT EXISTS stock_purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  product_id INT NOT NULL,
  supplier_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_cost DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_stock_purchases_store
    FOREIGN KEY (store_id)
    REFERENCES stores(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_stock_purchases_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE RESTRICT,

  CONSTRAINT fk_stock_purchases_supplier
    FOREIGN KEY (supplier_id)
    REFERENCES suppliers(id)
    ON DELETE RESTRICT,

  CONSTRAINT check_purchase_quantity_positive
    CHECK (quantity > 0),

  CONSTRAINT check_purchase_cost_non_negative
    CHECK (unit_cost >= 0 AND total_cost >= 0)
);

-- SALES
CREATE TABLE IF NOT EXISTS sales(
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- every sale must belong to a store, so
    store_id INT NOT NULL,  
    sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    payment_method ENUM('CASH', 'CARD', 'UPI', 'OTHER') DEFAULT 'CASH',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_sales_store
      FOREIGN KEY (store_id)
      REFERENCES stores(id)
      ON DELETE CASCADE,
    -- total_amount should never be negative
        CONSTRAINT check_sale_total_non_negative
        CHECK (total_amount >= 0)
);

-- SALE ITEMS
CREATE TABLE IF NOT EXISTS sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_sale_items_sale
    FOREIGN KEY (sale_id)
    REFERENCES sales(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_sale_items_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE RESTRICT,

  CONSTRAINT check_sale_item_quantity_positive
    CHECK (quantity > 0),

  CONSTRAINT check_sale_item_price_non_negative
    CHECK (unit_price >= 0 AND total_price >= 0)
);
-- INVENTORY LOGS
CREATE TABLE IF NOT EXISTS inventory_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  product_id INT NOT NULL,
  change_type ENUM('PURCHASE', 'SALE', 'MANUAL_ADJUSTMENT') NOT NULL,
  quantity_change INT NOT NULL,
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  reference_type ENUM('PURCHASE', 'SALE', 'MANUAL_ADJUSTMENT') NOT NULL,
  reference_id INT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_inventory_logs_store
    FOREIGN KEY (store_id)
    REFERENCES stores(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_inventory_logs_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE RESTRICT,

  CONSTRAINT check_inventory_stock_non_negative
    CHECK (previous_stock >= 0 AND new_stock >= 0)
);
