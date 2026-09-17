CREATE TABLE `reviews` (
	`user_id` text NOT NULL,
	`word_id` text NOT NULL,
	`stage` integer DEFAULT 0 NOT NULL,
	`due` integer NOT NULL,
	`last_attempt` text NOT NULL,
	PRIMARY KEY(`user_id`, `word_id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`user_id` text NOT NULL,
	`id` text NOT NULL,
	`kind` text NOT NULL,
	`item_id` text NOT NULL,
	`title` text NOT NULL,
	`score` integer NOT NULL,
	`total` integer NOT NULL,
	`seconds` integer NOT NULL,
	`day` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `id`)
);
