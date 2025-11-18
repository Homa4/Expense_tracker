-- CreateTable
CREATE TABLE `category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(45) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `currency` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `currency_type` VARCHAR(45) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `record` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(0) NULL,
    `amount` VARCHAR(45) NULL,
    `user_id` INTEGER NULL,
    `category_id` INTEGER NULL,
    `currency_id` INTEGER NULL,

    INDEX `category_id_idx`(`category_id`),
    INDEX `currency_id_idx`(`currency_id`),
    INDEX `user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NULL,
    `currency_id` INTEGER NULL,
    `currency_type` VARCHAR(45) NULL,

    INDEX `currency_id_idx`(`currency_id`),
    INDEX `currency_type_idx`(`currency_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `test` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `record` ADD CONSTRAINT `category_id` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `record` ADD CONSTRAINT `fk_record_currency` FOREIGN KEY (`currency_id`) REFERENCES `currency`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `record` ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `currency_id` FOREIGN KEY (`currency_id`) REFERENCES `currency`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
