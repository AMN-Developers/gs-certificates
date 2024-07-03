-- DropIndex
DROP INDEX `order_user_id_fkey` ON `order`;

-- DropIndex
DROP INDEX `product_in_order_product_id_fkey` ON `product_in_order`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `teste` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_in_order` ADD CONSTRAINT `product_in_order_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_in_order` ADD CONSTRAINT `product_in_order_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
