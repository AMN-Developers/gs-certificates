/*
  Warnings:

  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[certificateTokenId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `certificateTokenId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_user_id_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `certificateTokenId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `order`;

-- CreateTable
CREATE TABLE `certificate_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `higienizacao` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `user_certificateTokenId_key` ON `user`(`certificateTokenId`);

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_certificateTokenId_fkey` FOREIGN KEY (`certificateTokenId`) REFERENCES `certificate_tokens`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
