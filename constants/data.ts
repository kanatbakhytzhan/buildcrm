export interface Lead {
  id: string;
  name: string;
  phone: string;
  city: string;
  request: string;
  date: string;
  status: "new" | "progress" | "archive";
}

export const LEADS: Lead[] = [
  {
    id: "1",
    name: "Айбек",
    phone: "+77011234567",
    city: "Алматы",
    request: "Нужен фундамент 10x12, участок ровный, грунт хороший",
    date: "Сегодня, 14:30",
    status: "new",
  },
  {
    id: "2",
    name: "Сергей",
    phone: "+77012345678",
    city: "Астана",
    request: "Строительство дома под ключ, 150м2, газоблок",
    date: "Вчера, 09:15",
    status: "new",
  },
  {
    id: "3",
    name: "Гульмира",
    phone: "+77013456789",
    city: "Шымкент",
    request: "Пристройка к дому и баня из бревна",
    date: "Вчера, 18:45",
    status: "new",
  },
  {
    id: "4",
    name: "Марат",
    phone: "+77014567890",
    city: "Караганда",
    request: "Кровля металлочерепица, площадь 120м2",
    date: "2 дня назад",
    status: "progress",
  },
  {
    id: "5",
    name: "Динара",
    phone: "+77015678901",
    city: "Актобе",
    request: "Отделка квартиры, 80м2, евроремонт",
    date: "3 дня назад",
    status: "progress",
  },
  {
    id: "6",
    name: "Тимур",
    phone: "+77016789012",
    city: "Павлодар",
    request: "Забор из профнастила, 50 метров",
    date: "Неделю назад",
    status: "archive",
  },
];
