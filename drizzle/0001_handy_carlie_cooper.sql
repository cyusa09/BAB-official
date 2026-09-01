CREATE TABLE `assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`location` varchar(180) NOT NULL,
	`hectares` decimal(10,2) NOT NULL,
	`goal` enum('balanced','development','agriculture') NOT NULL,
	`inputsJson` text NOT NULL,
	`resultJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`)
);
