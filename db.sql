

-- --------------------------------------------------------

--
-- Структура таблицы `accounts`
--

CREATE TABLE `accounts` (
  `id` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `accounts`
--

INSERT INTO `accounts` (`id`, `name`, `created_at`) VALUES
(1, 'Test Account', '2025-02-07 09:32:03');

-- --------------------------------------------------------

--
-- Структура таблицы `calendar_events`
--

CREATE TABLE `calendar_events` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `event_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `goals`
--

CREATE TABLE `goals` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` varchar(50) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `invite_codes`
--

CREATE TABLE `invite_codes` (
  `id` int NOT NULL,
  `code` varchar(32) NOT NULL,
  `account_id` int NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `movies`
--

CREATE TABLE `movies` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `rating` int DEFAULT NULL,
  `watch_status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `photos`
--

CREATE TABLE `photos` (
  `id` int NOT NULL,
  `s3_url` varchar(512) NOT NULL,
  `comment` text,
  `photo_date` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `account_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `photos`
--

INSERT INTO `photos` (`id`, `s3_url`, `comment`, `photo_date`, `location`, `created_at`, `account_id`) VALUES
(16, 'https://storage.yandexcloud.net/lovebot/photos/1738921054413-1%20%C3%A2%C2%80%C2%93%20%C3%90%C2%94%C3%90%C2%B5%C3%91%C2%82%C3%90%C2%B0%C3%90%C2%BB%C3%90%C2%B8%20%C3%90%C2%BF%C3%90%C2%BB%C3%90%C2%B0%C3%91%C2%82%C3%90%C2%B5%C3%90%C2%B6%C3%90%C2%B0%20%C3%90%C2%BF%C3%90%C2%BE%20%C3%91%C2%80%C3%90%C2%B5%C3%90%C2%BA%C3%90%C2%B2%C3%90%C2%B8%C3%90%C2%B7%C3%90%C2%B8%C3%91%C2%82%C3%90%C2%B0%C3%90%C2%BC.png', '', '2025-02-06', '', '2025-02-07 09:38:57', 1),
(17, 'https://storage.yandexcloud.net/lovebot/photos/1738921053440-1%20%C3%A2%C2%80%C2%93%20%C3%90%C2%94%C3%90%C2%B5%C3%91%C2%82%C3%90%C2%B0%C3%90%C2%BB%C3%90%C2%B8%20%C3%90%C2%BF%C3%90%C2%BB%C3%90%C2%B0%C3%91%C2%82%C3%90%C2%B5%C3%90%C2%B6%C3%90%C2%B0%20%C3%90%C2%BF%C3%90%C2%BE%20%C3%91%C2%80%C3%90%C2%B5%C3%90%C2%BA%C3%90%C2%B2%C3%90%C2%B8%C3%90%C2%B7%C3%90%C2%B8%C3%91%C2%82%C3%90%C2%B0%C3%90%C2%BC.png', '', '2025-02-06', '', '2025-02-07 09:38:57', 1),
(18, 'https://storage.yandexcloud.net/lovebot/photos/1738921040459-1%20%C3%A2%C2%80%C2%93%20%C3%90%C2%94%C3%90%C2%B5%C3%91%C2%82%C3%90%C2%B0%C3%90%C2%BB%C3%90%C2%B8%20%C3%90%C2%BF%C3%90%C2%BB%C3%90%C2%B0%C3%91%C2%82%C3%90%C2%B5%C3%90%C2%B6%C3%90%C2%B0%20%C3%90%C2%BF%C3%90%C2%BE%20%C3%91%C2%80%C3%90%C2%B5%C3%90%C2%BA%C3%90%C2%B2%C3%90%C2%B8%C3%90%C2%B7%C3%90%C2%B8%C3%91%C2%82%C3%90%C2%B0%C3%90%C2%BC.png', '', '2025-02-06', '', '2025-02-07 09:38:57', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `recipes`
--

CREATE TABLE `recipes` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `ingredients` text,
  `instructions` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `travels`
--

CREATE TABLE `travels` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `destination` varchar(255) NOT NULL,
  `description` text,
  `travel_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `telegram_id` varchar(64) NOT NULL,
  `account_id` int NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `telegram_id`, `account_id`, `username`, `created_at`) VALUES
(1, 'test_user_123', 1, NULL, '2025-02-07 09:32:03');

-- --------------------------------------------------------

--
-- Структура таблицы `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`);

--
-- Индексы таблицы `goals`
--
ALTER TABLE `goals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`);

--
-- Индексы таблицы `invite_codes`
--
ALTER TABLE `invite_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `account_id` (`account_id`);

--
-- Индексы таблицы `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`);

--
-- Индексы таблицы `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`);

--
-- Индексы таблицы `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`);

--
-- Индексы таблицы `travels`
--
ALTER TABLE `travels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `telegram_id` (`telegram_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Индексы таблицы `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `calendar_events`
--
ALTER TABLE `calendar_events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `goals`
--
ALTER TABLE `goals`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `invite_codes`
--
ALTER TABLE `invite_codes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT для таблицы `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `travels`
--
ALTER TABLE `travels`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `calendar_events`
--
ALTER TABLE `calendar_events`
  ADD CONSTRAINT `calendar_events_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Ограничения внешнего ключа таблицы `goals`
--
ALTER TABLE `goals`
  ADD CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Ограничения внешнего ключа таблицы `invite_codes`
--
ALTER TABLE `invite_codes`
  ADD CONSTRAINT `invite_codes_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Ограничения внешнего ключа таблицы `movies`
--
ALTER TABLE `movies`
  ADD CONSTRAINT `movies_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Ограничения внешнего ключа таблицы `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Ограничения внешнего ключа таблицы `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Ограничения внешнего ключа таблицы `travels`
--
ALTER TABLE `travels`
  ADD CONSTRAINT `travels_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Ограничения внешнего ключа таблицы `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);

--
-- Ограничения внешнего ключа таблицы `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
