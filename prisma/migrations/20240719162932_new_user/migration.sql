/*
  Warnings:

  - You are about to drop the column `claimed` on the `order` table. All the data in the column will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_in_order` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quantity` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product_in_order` DROP FOREIGN KEY `product_in_order_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_in_order` DROP FOREIGN KEY `product_in_order_product_id_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `claimed`,
    ADD COLUMN `quantity` INTEGER NOT NULL,
    ADD COLUMN `type` ENUM('HIGIENIZACAO') NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- DropTable
DROP TABLE `product`;

-- DropTable
DROP TABLE `product_in_order`;
