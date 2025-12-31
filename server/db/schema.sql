-- Create DB if you want:
-- CREATE DATABASE dreamy;
USE dreamy;

-- =====================
-- Services
-- =====================
CREATE TABLE IF NOT EXISTS services (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  service_group    VARCHAR(40) NOT NULL,
  name             VARCHAR(140) NOT NULL,
  duration_minutes INT NOT NULL,
  price_cents      INT NOT NULL,
  is_active        TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_services_group_name (service_group, name),
  INDEX idx_services_group (service_group),
  CHECK (duration_minutes > 0),
  CHECK (price_cents >= 0)
) ENGINE=InnoDB;

-- =====================
-- Customers
-- =====================
CREATE TABLE IF NOT EXISTS customers (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name  VARCHAR(80)  NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(40)  NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_customers_email (email)
) ENGINE=InnoDB;

-- =====================
-- Bookings
-- =====================
CREATE TABLE IF NOT EXISTS bookings (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_id           BIGINT UNSIGNED NOT NULL,

  service_id            BIGINT UNSIGNED NOT NULL,
  service_group_snapshot VARCHAR(40) NOT NULL,
  service_name_snapshot VARCHAR(140) NOT NULL,
  duration_minutes      INT NOT NULL,
  price_cents_snapshot  INT NOT NULL,

  slot_start            DATETIME NOT NULL,
  slot_end              DATETIME NOT NULL,

  notes                 VARCHAR(800) NOT NULL DEFAULT '',
  status                ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  CONSTRAINT fk_bookings_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_bookings_service
    FOREIGN KEY (service_id) REFERENCES services(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  INDEX idx_bookings_start (slot_start),
  INDEX idx_bookings_end (slot_end),
  INDEX idx_bookings_status (status)
) ENGINE=InnoDB;

-- =====================
-- Booking items (cart attached to booking request)
-- =====================
CREATE TABLE IF NOT EXISTS booking_items (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  booking_id  BIGINT UNSIGNED NOT NULL,
  item_group  VARCHAR(40) NOT NULL,
  item_name   VARCHAR(140) NOT NULL,
  price_cents INT NOT NULL,
  qty         INT NOT NULL,

  PRIMARY KEY (id),

  CONSTRAINT fk_booking_items_booking
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_booking_items_booking (booking_id),

  CHECK (price_cents >= 0),
  CHECK (qty >= 1 AND qty <= 20)
) ENGINE=InnoDB;

-- =====================
-- Seed services (safe re-run)
-- =====================
INSERT INTO services (service_group, name, duration_minutes, price_cents)
VALUES
('Brows', 'Brow + Lip Wax', 40, 2300),
('Brows', 'Brow Lamination', 45, 5000),
('Brows', 'Brow Lamination + Tint', 55, 6500),
('Brows', 'Brow Lamination + Wax', 45, 6000),
('Brows', 'Brow Lamination + Wax + Tint', 55, 8000),
('Brows', 'Brow Tint', 35, 2500),
('Brows', 'Brow Wax', 30, 2000),
('Brows', 'Brow Wax + Tint', 30, 4000),

('Facials', 'Custom Dreamy Facial', 45, 8000),
('Facials', 'Custom Facial', 50, 6000),
('Facials', 'Dermaplaning Facial', 30, 7000),
('Facials', 'Mini Facial Glow & Go!', 30, 4000),
('Facials', 'Back Acne Treatment', 75, 6000),
('Facials', 'Dermaplane (Add-On)', 30, 4000),
('Facials', 'High Frequency (Add-On)', 10, 1000),

('Waxing', 'Chin Wax', 15, 1000),
('Waxing', 'Full Arm Wax', 30, 5000),
('Waxing', 'Full Face Wax', 30, 5000),
('Waxing', 'Full Leg Wax', 45, 6500),
('Waxing', 'Half Arm Wax', 30, 3000),
('Waxing', 'Half Leg Wax', 30, 5000),
('Waxing', 'Lip Wax', 10, 1000),
('Waxing', 'Lip + Chin Wax', 15, 2000),
('Waxing', 'Sideburn Wax', 20, 2000),
('Waxing', 'Underarms Wax', 30, 2000),

('Brazilian', 'Bikini Line Wax', 30, 3500),
('Brazilian', 'Brazilian Treatment', 30, 4500),
('Brazilian', 'Brazilian Wax (4–5 weeks)', 30, 6500)
ON DUPLICATE KEY UPDATE
  duration_minutes = VALUES(duration_minutes),
  price_cents = VALUES(price_cents),
  is_active = 1;
