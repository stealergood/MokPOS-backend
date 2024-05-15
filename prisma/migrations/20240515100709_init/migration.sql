/*
  Warnings:

  - The primary key for the `transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_transaction_id_fkey`;

-- AlterTable
ALTER TABLE `order` MODIFY `transaction_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `transaction` DROP PRIMARY KEY,
    MODIFY `transaction_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`transaction_id`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `Transaction`(`transaction_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
