CREATE TABLE `bookmarks` (
	`user_id` text NOT NULL,
	`book_id` text NOT NULL,
	`page` integer NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `book_id`)
);
--> statement-breakpoint
CREATE TABLE `drafts` (
	`user_id` text NOT NULL,
	`prompt_id` text NOT NULL,
	`text` text NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `prompt_id`)
);
