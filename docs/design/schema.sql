-- SQL Schema + Seed Data
-- Mini project: Quan ly Quan An
-- Compatible with PostgreSQL

DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS dining_tables CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES roles(id),
    full_name VARCHAR(120) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dining_tables (
    id SERIAL PRIMARY KEY,
    table_code VARCHAR(20) NOT NULL UNIQUE,
    capacity INT NOT NULL CHECK (capacity > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'occupied', 'reserved'))
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id),
    name VARCHAR(120) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    table_id INT REFERENCES dining_tables(id),
    created_by INT NOT NULL REFERENCES users(id),
    customer_name VARCHAR(120),
    order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('dine_in', 'takeaway', 'delivery')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'served', 'paid', 'cancelled')),
    ordered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note TEXT
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INT NOT NULL REFERENCES menu_items(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
    item_note TEXT
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'card', 'transfer', 'e_wallet')),
    amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
    paid_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'refunded')),
    transaction_ref VARCHAR(100)
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    table_id INT NOT NULL REFERENCES dining_tables(id),
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    reserved_time TIMESTAMP NOT NULL,
    party_size INT NOT NULL CHECK (party_size > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('booked', 'checked_in', 'cancelled', 'completed')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO roles (name) VALUES
('admin'),
('cashier'),
('kitchen_staff');

INSERT INTO users (role_id, full_name, username, password_hash, phone) VALUES
(1, 'Quan Ly 01', 'admin01', 'hashed_password_admin', '0900000001'),
(2, 'Thu Ngan 01', 'cashier01', 'hashed_password_cashier', '0900000002'),
(3, 'Nhan Vien Bep 01', 'kitchen01', 'hashed_password_kitchen', '0900000003');

INSERT INTO dining_tables (table_code, capacity, status) VALUES
('T01', 2, 'available'),
('T02', 4, 'occupied'),
('T03', 6, 'reserved'),
('T04', 4, 'available');

INSERT INTO categories (name) VALUES
('Mon chinh'),
('Mon an nhe'),
('Do uong');

INSERT INTO menu_items (category_id, name, description, price, is_available) VALUES
(1, 'Com ga nuong', 'Com trang an kem ga nuong sot mat ong', 55000, TRUE),
(1, 'Bun bo Hue', 'Bun bo cay nhe, nhieu topping', 60000, TRUE),
(2, 'Khoai tay chien', 'Khoai tay chien gion', 30000, TRUE),
(3, 'Tra dao cam sa', 'Tra dao tuoi kem cam sa', 35000, TRUE),
(3, 'Ca phe den', 'Ca phe den da', 25000, TRUE);

INSERT INTO orders (table_id, created_by, customer_name, order_type, status, ordered_at, note) VALUES
(2, 2, 'Khach le A', 'dine_in', 'processing', CURRENT_TIMESTAMP, 'It da'),
(NULL, 2, 'Khach mang di B', 'takeaway', 'pending', CURRENT_TIMESTAMP, NULL);

INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, item_note) VALUES
(1, 1, 1, 55000, NULL),
(1, 4, 2, 35000, 'Giam duong'),
(2, 3, 1, 30000, NULL);

INSERT INTO payments (order_id, payment_method, amount, paid_at, status, transaction_ref) VALUES
(1, 'cash', 125000, CURRENT_TIMESTAMP, 'success', 'PAY-CASH-0001');

INSERT INTO reservations (table_id, customer_name, customer_phone, reserved_time, party_size, status) VALUES
(3, 'Nguyen Van C', '0911222333', CURRENT_TIMESTAMP + INTERVAL '2 hour', 5, 'booked'),
(4, 'Tran Thi D', '0944555666', CURRENT_TIMESTAMP + INTERVAL '1 day', 4, 'booked');
