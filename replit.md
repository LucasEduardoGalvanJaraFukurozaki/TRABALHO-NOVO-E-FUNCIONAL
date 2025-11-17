# Overview

This is a pharmacy inventory management system (Sistema de Estoque de Farmácia) built with Node.js and Express. The system provides comprehensive functionality for managing a pharmacy's operations including customer registration, supplier management, employee records, product inventory, stock movements, sales processing, and reporting. The application uses a web-based interface with multiple HTML pages for different modules, all connected to a SQLite database for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
- **Framework**: Express.js server running on port 5000 (configurable via environment)
- **Database**: SQLite3 with file-based storage (`database.db`)
- **API Design**: RESTful endpoints for CRUD operations on all entities
- **Data Processing**: Body-parser middleware for JSON request handling
- **Static Files**: Express static middleware serving the `public` directory

## Frontend Architecture
- **Structure**: Multi-page application with separate HTML files for each module
- **Styling**: Custom CSS files for each page with responsive design
- **Interactivity**: Vanilla JavaScript for form handling, API calls, and dynamic content
- **Navigation**: Consistent header navigation across all pages with hamburger menu for mobile

## Database Schema
The system uses several interconnected tables:
- **Clientes**: Customer data with complete address information and contact details
- **Fornecedores**: Supplier records with business information and contact persons
- **Funcionarios**: Employee management (referenced in frontend)
- **Produtos**: Product catalog with inventory levels and pricing
- **Movimento**: Stock movement tracking for inventory control
- **Vendas**: Sales transaction records

## Module Organization
- **Registration System**: Separate modules for customers, suppliers, employees, and products
- **Inventory Management**: Stock movement tracking with support for entries, exits, adjustments, returns, and losses
- **Sales Processing**: Customer lookup and product selection for transaction processing
- **Reporting**: Dynamic report generation with multiple view options
- **Responsive Design**: Mobile-friendly interface with hamburger navigation

## Data Validation
- Frontend form validation using HTML5 attributes and JavaScript
- Backend data integrity through SQLite constraints and unique fields
- Error handling with user-friendly messages and console logging

# External Dependencies

## Runtime Dependencies
- **express**: Web application framework (v5.1.0)
- **body-parser**: HTTP request body parsing middleware (v2.2.0) 
- **sqlite3**: SQLite database driver for Node.js (v5.1.7)

## Development Tools
- **Node.js**: JavaScript runtime environment
- **npm**: Package manager for dependency management

## Frontend Assets
- Custom CSS frameworks for consistent styling across modules
- Vanilla JavaScript for client-side functionality
- Static image assets including logos and icons
- Responsive design implementation without external CSS frameworks

## Database
- **SQLite**: Embedded database engine for data persistence
- File-based storage system requiring no external database server
- ACID compliance for transaction integrity