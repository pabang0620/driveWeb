/*
  Warnings:

  - You are about to alter the column `start_time` on the `driving_records` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Time(0)`.
  - You are about to alter the column `end_time` on the `driving_records` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Time(0)`.
  - You are about to alter the column `working_hours` on the `driving_records` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Time(0)`.

*/
-- AlterTable
ALTER TABLE `driving_records` MODIFY `start_time` TIME(0) NULL,
    MODIFY `end_time` TIME(0) NULL,
    MODIFY `working_hours` TIME(0) NULL;
