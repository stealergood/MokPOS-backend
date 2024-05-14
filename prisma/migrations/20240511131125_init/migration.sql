/*
  Warnings:

  - The primary key for the `order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `Transaction_order_id_fkey`;

-- AlterTable
ALTER TABLE `order` DROP PRIMARY KEY,
    DROP COLUMN `created_at`,
    MODIFY `order_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`order_id`);

-- AlterTable
ALTER TABLE `transaction` MODIFY `order_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
