/*
  Warnings:

  - You are about to alter the column `start_time` on the `driving_records` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_time` on the `driving_records` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `working_hours` on the `driving_records` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `driving_records` ADD COLUMN `userId` INTEGER NULL,
    MODIFY `start_time` DATETIME NULL,
    MODIFY `end_time` DATETIME NULL,
    MODIFY `working_hours` DATETIME NULL;
