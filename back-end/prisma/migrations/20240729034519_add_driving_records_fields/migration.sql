-- CreateTable
CREATE TABLE `boards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `postId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `parentId` INTEGER NULL,

    INDEX `FK_ParentComment`(`parentId`),
    INDEX `FK_Post`(`postId`),
    INDEX `FK_User`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `driving_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `date` DATE NULL,
    `memo` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `driving_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `driving_log_id` INTEGER NULL,
    `start_time` VARCHAR(191) NULL,
    `end_time` VARCHAR(191) NULL,
    `working_hours` VARCHAR(191) NULL,
    `day_of_week` VARCHAR(10) NULL,
    `cumulative_km` INTEGER NULL,
    `driving_distance` INTEGER NULL,
    `business_distance` INTEGER NULL,
    `business_rate` DECIMAL(5, 2) NULL,
    `fuel_amount` DECIMAL(10, 2) NULL,
    `fuel_efficiency` DECIMAL(10, 2) NULL,
    `total_driving_cases` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `totalDrivingTime` FLOAT NULL,

    INDEX `driving_log_id`(`driving_log_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expense_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `driving_log_id` INTEGER NULL,
    `fuel_expense` DECIMAL(15, 2) NULL,
    `toll_fee` DECIMAL(15, 2) NULL,
    `meal_expense` DECIMAL(15, 2) NULL,
    `fine_expense` DECIMAL(15, 2) NULL,
    `other_expense` DECIMAL(15, 2) NULL,
    `expense_spare_1` DECIMAL(15, 2) NULL,
    `expense_spare_2` DECIMAL(15, 2) NULL,
    `expense_spare_3` DECIMAL(15, 2) NULL,
    `expense_spare_4` DECIMAL(15, 2) NULL,
    `total_expense` DECIMAL(15, 2) NULL,
    `profit_loss` DECIMAL(15, 2) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `card_fee` FLOAT NULL,
    `kakao_fee` FLOAT NULL,
    `uber_fee` FLOAT NULL,
    `userId` INTEGER NULL,
    `onda_fee` DECIMAL(10, 2) NULL,
    `tada_fee` DECIMAL(10, 2) NULL,
    `iam_fee` DECIMAL(10, 2) NULL,
    `etc_fee` DECIMAL(10, 2) NULL,

    INDEX `driving_log_id`(`driving_log_id`),
    INDEX `fk_expense_records_user`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `franchise_fees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `franchise_name` VARCHAR(255) NULL,
    `fee` DECIMAL(15, 2) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `user_vehicle_id` INTEGER NULL,

    INDEX `FK_UserVehicle`(`user_vehicle_id`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `income_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `driving_log_id` INTEGER NULL,
    `card_income` DECIMAL(15, 2) NULL,
    `cash_income` DECIMAL(15, 2) NULL,
    `kakao_income` DECIMAL(15, 2) NULL,
    `uber_income` DECIMAL(15, 2) NULL,
    `onda_income` DECIMAL(15, 2) NULL,
    `tada_income` DECIMAL(15, 2) NULL,
    `iam_income` DECIMAL(15, 2) NULL,
    `etc_income` DECIMAL(15, 2) NULL,
    `other_income` DECIMAL(15, 2) NULL,
    `income_spare_1` DECIMAL(15, 2) NULL,
    `income_spare_2` DECIMAL(15, 2) NULL,
    `income_spare_3` DECIMAL(15, 2) NULL,
    `income_spare_4` DECIMAL(15, 2) NULL,
    `total_income` DECIMAL(15, 2) NULL,
    `income_per_km` DECIMAL(10, 2) NULL,
    `income_per_hour` DECIMAL(10, 2) NULL,
    `total_transport_income` DECIMAL(15, 2) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `totalTransportIncome` FLOAT NULL,
    `userId` INTEGER NULL,

    INDEX `driving_log_id`(`driving_log_id`),
    INDEX `fk_income_records_user`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `likes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `postId` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `unique_likes`(`userId`, `postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `my_carId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `unit` VARCHAR(15) NOT NULL DEFAULT 'km',

    INDEX `fk_maintenance_items_my_car`(`my_carId`),
    INDEX `idx_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `carId` INTEGER NULL,
    `maintenanceItemId` INTEGER NULL,
    `maintenanceDate` DATE NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `maintenanceMethod` VARCHAR(255) NULL,
    `maintenanceInterval` INTEGER NULL,
    `maintenanceDistance` INTEGER NULL,
    `mileageAtMaintenance` INTEGER NULL,
    `maintenanceCost` DECIMAL(10, 2) NULL,
    `edited` INTEGER NULL DEFAULT 0,

    INDEX `fk_maintenance_records_carId`(`carId`),
    INDEX `fk_maintenance_records_maintenanceItemId`(`maintenanceItemId`),
    INDEX `fk_maintenance_records_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `my_car` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `vehicle_name` VARCHAR(255) NULL,
    `fuel_type` VARCHAR(255) NULL,
    `year` YEAR NULL,
    `mileage` INTEGER NULL,
    `license_plate` VARCHAR(255) NULL,
    `first_registration_date` DATE NULL,
    `insurance_company` VARCHAR(255) NULL,
    `insurance_period` DATE NULL,
    `insurance_fee` DECIMAL(15, 2) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `insurance_period_start` DATE NULL,
    `insurance_period_end` DATE NULL,
    `imageUrl` VARCHAR(255) NULL,

    UNIQUE INDEX `userId_2`(`userId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `postImages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` INTEGER NOT NULL,
    `imageUrl` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `postId`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `boardId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `imageUrl` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `viewCount` INTEGER NULL DEFAULT 0,
    `likeCount` INTEGER NULL DEFAULT 0,
    `order_number` INTEGER NULL,

    INDEX `FK_Board`(`boardId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_incomes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `income_type` VARCHAR(255) NULL,
    `start_date` DATE NULL,
    `region1` VARCHAR(255) NULL,
    `region2` VARCHAR(255) NULL,
    `monthly_payment` DECIMAL(15, 2) NULL,
    `fuel_allowance` DECIMAL(15, 2) NULL,
    `investment` DECIMAL(15, 2) NULL,
    `standard_expense_rate` DECIMAL(5, 2) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `userId_2`(`userId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `birth_date` VARCHAR(15) NULL,
    `phone` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `imageUrl` VARCHAR(255) NULL,

    UNIQUE INDEX `userId_2`(`userId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_vehicles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `carType` VARCHAR(255) NULL,
    `franchise_status` VARCHAR(255) NULL,
    `commission_rate` DECIMAL(5, 2) NULL,
    `vehicle_name` VARCHAR(255) NULL,
    `year` INTEGER NULL,
    `fuel_type` VARCHAR(255) NULL,
    `mileage` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `userId`(`userId`),
    INDEX `idx_user_vehicles_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NULL,
    `googleId` VARCHAR(255) NULL,
    `kakaoId` VARCHAR(255) NULL,
    `naverId` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `jobtype` INTEGER NULL,

    UNIQUE INDEX `email`(`username`),
    UNIQUE INDEX `googleId`(`googleId`),
    UNIQUE INDEX `kakaoId`(`kakaoId`),
    UNIQUE INDEX `naverId`(`naverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `FK_ParentComment` FOREIGN KEY (`parentId`) REFERENCES `comments`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `driving_logs` ADD CONSTRAINT `driving_logs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `driving_records` ADD CONSTRAINT `driving_records_ibfk_1` FOREIGN KEY (`driving_log_id`) REFERENCES `driving_logs`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `expense_records` ADD CONSTRAINT `expense_records_ibfk_1` FOREIGN KEY (`driving_log_id`) REFERENCES `driving_logs`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `expense_records` ADD CONSTRAINT `fk_expense_records_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `franchise_fees` ADD CONSTRAINT `FK_UserVehicle` FOREIGN KEY (`user_vehicle_id`) REFERENCES `user_vehicles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `franchise_fees` ADD CONSTRAINT `franchise_fees_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `income_records` ADD CONSTRAINT `fk_income_driving_log` FOREIGN KEY (`driving_log_id`) REFERENCES `driving_logs`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `income_records` ADD CONSTRAINT `fk_income_records_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `maintenance_items` ADD CONSTRAINT `fk_maintenance_items_my_car` FOREIGN KEY (`my_carId`) REFERENCES `my_car`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `maintenance_items` ADD CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `maintenance_records` ADD CONSTRAINT `maintenance_records_ibfk_2` FOREIGN KEY (`carId`) REFERENCES `my_car`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `maintenance_records` ADD CONSTRAINT `maintenance_records_ibfk_3` FOREIGN KEY (`maintenanceItemId`) REFERENCES `maintenance_items`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `maintenance_records` ADD CONSTRAINT `maintenance_records_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `my_car` ADD CONSTRAINT `my_car_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `postImages` ADD CONSTRAINT `postImages_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`boardId`) REFERENCES `boards`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_incomes` ADD CONSTRAINT `user_incomes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_vehicles` ADD CONSTRAINT `FK_user_vehicles_userId` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
