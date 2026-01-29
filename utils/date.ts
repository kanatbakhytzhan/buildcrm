/**
 * Форматирует ISO дату в читаемый формат
 * @param isoString - ISO 8601 дата (например, "2024-01-29T14:30:00")
 * @returns Отформатированная строка в локальном времени (например, "29 янв, 14:30")
 */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "Нет даты";

  try {
    // КРИТИЧЕСКИ ВАЖНО: Если бэкенд присылает время в UTC без 'Z', добавляем его
    // Это гарантирует, что JavaScript правильно интерпретирует дату как UTC
    const normalizedDate = isoString.endsWith('Z') ? isoString : `${isoString}Z`;
    const date = new Date(normalizedDate);

    // Проверка на валидность даты
    if (isNaN(date.getTime())) {
      return "Неверная дата";
    }

    // Форматируем дату с русской локалью
    // Intl.DateTimeFormat автоматически конвертирует UTC в локальное время устройства
    const formatter = new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    return formatter.format(date);
  } catch (error) {
    console.error("Ошибка форматирования даты:", error);
    return "Ошибка даты";
  }
}

/**
 * Возвращает относительное время (Сегодня, Вчера, N дней назад)
 * @param isoString - ISO 8601 дата
 * @returns Относительная строка времени в локальном часовом поясе
 */
export function getRelativeTime(isoString: string | null | undefined): string {
  if (!isoString) return "Неизвестно";

  try {
    // Нормализуем дату как UTC (добавляем Z если нет)
    const normalizedDate = isoString.endsWith('Z') ? isoString : `${isoString}Z`;
    const date = new Date(normalizedDate);
    
    // Проверка на валидность
    if (isNaN(date.getTime())) {
      return "Неизвестно";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Только что";
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays === 1) return "Вчера";
    if (diffDays < 7) return `${diffDays} дн назад`;

    // Для старых дат показываем просто дату (уже в локальном времени)
    return formatDate(isoString);
  } catch (error) {
    return "Неизвестно";
  }
}
