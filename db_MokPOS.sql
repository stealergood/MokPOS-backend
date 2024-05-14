CREATE TABLE `User` (
  `user_id` VARCHAR(255) PRIMARY KEY,
  `store_name` VARCHAR(255),
  `email` VARCHAR(255),
  `phone` INT,
  `password` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Product` (
  `product_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` VARCHAR(255),
  `product_name` VARCHAR(255),
  `image` VARCHAR(255),
  `image_public_id` VARCHAR(255),
  `price` DECIMAL(10,2),
  `stock` INT,
  `category_id` INT,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Category` (
  `category_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` VARCHAR(255),
  `category_name` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Order` (
  `order_id` VARCHAR(255) PRIMARY KEY,
  `user_id` VARCHAR(255),
  `transaction_id` INT,
  `product_id` INT,
  `quantity` INT,
  `total_price` DECIMAL(10,2)
);

CREATE TABLE `Transaction` (
  `transaction_id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` VARCHAR(255),
  `amount` DECIMAL(10,2),
  `payment_method` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  `placement` ENUM ('dine_in', 'takeaway')
);

ALTER TABLE `Product` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Product` ADD FOREIGN KEY (`category_id`) REFERENCES `Category` (`category_id`);

ALTER TABLE `Category` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Order` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Order` ADD FOREIGN KEY (`product_id`) REFERENCES `Product` (`product_id`);

ALTER TABLE `Transaction` ADD FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`);

ALTER TABLE `Order` ADD FOREIGN KEY (`transaction_id`) REFERENCES `Transaction` (`transaction_id`);
