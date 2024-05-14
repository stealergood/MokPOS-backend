/*
  Warnings:

  - You are about to alter the column `total_price` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `order_id` on the `transaction` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - Added the required column `transaction_id` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_order_id_fkey`;

-- AlterTable
ALTER TABLE `category` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `order` ADD COLUMN `transaction_id` INTEGER NOT NULL,
    MODIFY `total_price` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `price` DECIMAL(10, 2) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `image` VARCHAR(191) NULL,
    MODIFY `image_public_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `order_id`,
    MODIFY `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `amount` DECIMAL(10, 2) NOT NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `user` MODIFY `store_name` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `phone` INTEGER NULL,
    MODIFY `password` VARCHAR(191) NULL,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `Transaction`(`transaction_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
