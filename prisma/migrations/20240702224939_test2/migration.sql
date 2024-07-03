-- CreateTable
CREATE TABLE `Config` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Config_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
