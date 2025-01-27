/*
  Warnings:

  - A unique constraint covering the columns `[epoch]` on the table `scores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `metadata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `metadata_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `scores_epoch_key` ON `scores`(`epoch`);
