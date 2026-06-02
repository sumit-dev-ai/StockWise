# StockWise — Inventory & Demand Forecasting System

## 1. Project Overview

StockWise is an inventory management and demand forecasting system for store owners and small businesses.

The main goal of this app is to help a store owner manage products, suppliers, purchases, sales, stock quantity, inventory logs, and business revenue from one dashboard.

In Phase 1, StockWise will work as a full-stack inventory management app.

In Phase 2, machine learning features will be added to predict demand, low-stock risk, and product sales trends.

---

## 2. App Story

StockWise helps a store owner manage their daily business operations.

A store owner can add products, organize products by categories, manage suppliers, record stock purchases, record customer sales, track stock changes, and view business performance through a dashboard.

Whenever stock is purchased, product stock should increase.

Whenever a sale is recorded, product stock should decrease.

Every stock movement should be saved in inventory logs so the store owner can track what happened and when.

---

## 3. Target Users

The main users of StockWise are:

* Store owners
* Shop managers
* Small business owners
* Inventory managers

These users need a simple system to track products, stock, sales, purchases, and revenue.

---

## 4. Core Features

### Authentication

* User registration
* User login
* User logout
* Protected routes using authentication

### Store Management

* Create store profile
* View store details
* Update store information

### Product Management

* Add products
* Update products
* Delete products
* View product list
* Filter products by category
* Track product stock quantity

### Category Management

* Create product categories
* Update categories
* Delete categories
* View categories

### Supplier Management

* Add suppliers
* Update supplier details
* Delete suppliers
* View supplier list

### Stock Purchase Management

* Record stock purchases
* Increase product stock after purchase
* Track purchase history

### Sales Management

* Record sales
* Add multiple products in one sale
* Decrease product stock after sale
* Prevent sale if stock is not enough
* Track sales history

### Inventory Logs

* Track every stock movement
* Store reason for stock change
* Track whether stock increased or decreased

### Dashboard

* Show total revenue
* Show total sales
* Show low-stock products
* Show top-selling products
* Show recent sales
* Filter reports by date

---

## 5. Database Tables

The planned SQL tables are:

* users
* stores
* products
* categories
* suppliers
* stock_purchases
* sales
* sale_items
* inventory_logs

---

## 6. Pages Needed

The frontend pages needed are:

* Register page
* Login page
* Dashboard page
* Store profile page
* Products page
* Add product page
* Edit product page
* Categories page
* Suppliers page
* Purchases page
* Sales page
* Create sale page
* Inventory logs page
* Reports page

---

## 7. APIs Needed

### Auth APIs

* Register user
* Login user
* Logout user
* Get current user

### Store APIs

* Create store
* Get store details
* Update store details

### Category APIs

* Create category
* Get all categories
* Update category
* Delete category

### Supplier APIs

* Create supplier
* Get all suppliers
* Update supplier
* Delete supplier

### Product APIs

* Create product
* Get all products
* Get single product
* Update product
* Delete product
* Get low-stock products

### Purchase APIs

* Create stock purchase
* Get purchase history
* Get single purchase

### Sale APIs

* Create sale
* Get sales history
* Get single sale
* Filter sales by date

### Inventory APIs

* Get inventory logs
* Get inventory logs by product

### Dashboard APIs

* Get revenue summary
* Get low-stock products
* Get top-selling products
* Get recent sales
* Get sales chart data

---

## 8. Business Rules

* A user must be logged in to manage store data.
* A user can only manage their own store data.
* A product must belong to a store.
* A product can belong to a category.
* A product can have a supplier.
* Product stock should increase when a stock purchase is added.
* Product stock should decrease when a sale is recorded.
* A sale should not be allowed if product stock is lower than the selling quantity.
* Every stock increase or decrease should create an inventory log.
* Low-stock products should be shown when product stock is less than or equal to the minimum stock level.
* Sales should store multiple sale items.
* Dashboard data should be calculated from sales, products, purchases, and inventory logs.

---

## 9. Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* React Router
* Axios
* Context API

### Backend

* Node.js
* Express.js
* TypeScript
* Prisma ORM
* PostgreSQL or MySQL
* JWT Authentication
* Cookie Parser
* CORS

### Future Machine Learning Phase

* Python
* Pandas
* NumPy
* Scikit-learn
* Regression models
* Classification models

---

## 10. Future ML Features

In Phase 2, StockWise will include machine learning features.

Planned ML features:

* Demand prediction
* Low-stock risk prediction
* Sales trend prediction
* Best-selling product prediction
* Product restocking recommendation

The ML system will use historical sales, product, and inventory data to make predictions.
