CREATE TABLE `users` (
  `user_id` int PRIMARY KEY,
  `store_name` varchar(255),
  `email` varchar(255),
  `phone` int(20),
  `password` varchar(255),
  `created_at` datetime
);

CREATE TABLE `products` (
  `product_id` int PRIMARY KEY,
  `product_name` varchar(255),
  `price` decimal,
  `stock` int(11),
  `category` int,
  `created_at` datetime
);

CREATE TABLE `category` (
  `category_id` int PRIMARY KEY,
  `category_name` varchar(255)
);

CREATE TABLE `orders` (
  `order_id` int PRIMARY KEY,
  `product_id` int,
  `quantity` int(11),
  `total_price` decimal,
  `payment_method` varchar(255),
  `created_at` datetime
);

CREATE TABLE `transactions` (
  `transaction_id` int PRIMARY KEY,
  `user_id` int,
  `order_id` int,
  `amount` decimal,
  `created_at` datetime
);

ALTER TABLE `products` ADD FOREIGN KEY (`category`) REFERENCES `category` (`category_id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

ALTER TABLE `transactions` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

ALTER TABLE `transactions` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);
