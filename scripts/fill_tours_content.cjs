const fs = require('fs');
const p = 'assets/tours/tours_index.json';
const data = JSON.parse(fs.readFileSync(p, 'utf8'));

const C = [
  'При неявке взимается 100% стоимости — возврат невозможен',
  'Отмена менее чем за 24 часа — возврат средств не осуществляется',
  'Отмена менее чем за 72 часа — возврат 50% стоимости',
  'Отмена более чем за 72 часа — удерживается 10% за обработку',
  'При форс-мажоре (погода, техника) — альтернативная дата или полный возврат'
];
const CE = [
  'No-show: 100% charged, no refund',
  'Cancellation < 24h: no refund',
  'Cancellation < 72h: 50% refund',
  'Cancellation > 72h: 10% processing fee retained',
  'Force majeure (weather/equipment): alternative date or full refund offered'
];
const SEA = ['Солнцезащитный крем SPF 50+','Коралловые тапочки (защита от рифов)','Репеллент от комаров','Купальник / плавки','Полотенце','Фотоаппарат или смартфон','Наличные (тайские баты)','Лёгкая одежда и головной убор','Очки от солнца'];
const SEA_EN = ['Sunscreen SPF 50+','Coral shoes (reef protection)','Mosquito repellent','Swimwear','Towel','Camera or smartphone','Cash (Thai baht)','Light clothes and hat','Sunglasses'];
const LAND = ['Удобная обувь для ходьбы','Лёгкая дышащая одежда','Головной убор от солнца','Солнцезащитный крем SPF 50+','Репеллент от насекомых','Вода (не менее 1 литра)','Фотоаппарат или смартфон','Наличные (тайские баты)','Небольшой рюкзак'];
const LAND_EN = ['Comfortable walking shoes','Light breathable clothing','Sun hat','Sunscreen SPF 50+','Insect repellent','Water (at least 1 litre)','Camera or smartphone','Cash (Thai baht)','Small backpack'];

const CONTENT = {
  T02: { i: ['Трансфер отель ↔ пирс','Катер или катамаран','Снаряжение для снорклинга','Обед на борту','Русскоязычный гид (кроме Эконом)','Страховка','Питьевая вода'], ie: ['Hotel ↔ pier transfer','Boat or catamaran','Snorkeling gear','Lunch on board','Russian-speaking guide (excl. Economy)','Insurance','Drinking water'], b: SEA, be: SEA_EN },
  T03: { i: ['Трансфер отель ↔ пирс','Катамаран с водной горкой','Снаряжение для снорклинга','Обед на борту','Гид','Страховка','Питьевая вода'], ie: ['Hotel ↔ pier transfer','Catamaran with water slide','Snorkeling gear','Lunch on board','Guide','Insurance','Drinking water'], b: SEA, be: SEA_EN },
  T04: { i: ['Трансфер отель ↔ пирс','Лодка по заливу Пханг Нга','Каякинг среди мангровых лесов','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Phang Nga Bay boat','Kayaking through mangroves','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T05: { i: ['Трансфер отель ↔ пирс','Скоростной катер','Залив Пханг Нга + остров Хонг','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Speedboat','Phang Nga Bay + Hong Island','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T06: { i: ['Трансфер отель ↔ пирс','Скоростной катер','Посещение 11 островов (Пхи Пхи, Краби, Джеймс Бонд)','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Speedboat','11 island stops (Phi Phi, Krabi, James Bond)','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T07: { i: ['Трансфер отель ↔ пирс','Скоростной катер','3 главных направления: Пхи Пхи, Краби, залив Пханг Нга','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Speedboat','3 key destinations: Phi Phi, Krabi, Phang Nga','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T08: { i: ['Трансфер отель ↔ пирс','Лодка','Встреча рассвета на островах','Лёгкий завтрак/снек','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Boat','Sunrise on the islands','Light breakfast/snack','Guide','Insurance'], b: SEA, be: SEA_EN },
  T09: { i: ['Трансфер отель ↔ пирс','Катер','Снасти для рыбалки','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Boat','Fishing gear','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T10: { i: ['Трансфер отель ↔ пирс','Скоростной катер','Снаряжение для снорклинга','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Speedboat','Snorkeling gear','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T11: { i: ['Трансфер отель ↔ пирс','Катер','Снаряжение для снорклинга','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Boat','Snorkeling gear','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T12: { i: ['Трансфер отель ↔ пирс','Катер','Снаряжение для снорклинга','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Boat','Snorkeling gear','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T13: { i: ['Трансфер отель ↔ пирс','Катер','Снаряжение для снорклинга','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Boat','Snorkeling gear','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T14: { i: ['Трансфер отель ↔ пирс','Катер','Снаряжение для снорклинга','Обед','Страховка','Проживание на острове (для пакета 2 дня)'], ie: ['Hotel ↔ pier transfer','Boat','Snorkeling gear','Lunch','Insurance','Island accommodation (2-day package)'], b: SEA, be: SEA_EN },
  T15: { i: ['Трансфер отель ↔ пирс','Катамаран Ombré','Снаряжение для снорклинга','Обед','Страховка (без русского гида)'], ie: ['Hotel ↔ pier transfer','Ombré catamaran','Snorkeling gear','Lunch','Insurance (no Russian guide)'], b: SEA, be: SEA_EN },
  T16: { i: ['Трансфер отель ↔ пирс','Катамаран Hype','Снаряжение для снорклинга','Обед','Страховка (без русского гида)'], ie: ['Hotel ↔ pier transfer','Hype catamaran','Snorkeling gear','Lunch','Insurance (no Russian guide)'], b: SEA, be: SEA_EN },
  T17: { i: ['Трансфер отель ↔ пирс','Скоростной катер','Снаряжение для снорклинга','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Speedboat','Snorkeling gear','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T18: { i: ['Трансфер отель ↔ пирс','Катер','Снаряжение для снорклинга','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Boat','Snorkeling gear','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T19: { i: ['Трансфер отель ↔ пирс','Скоростной катер','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Speedboat','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T20: { i: ['Трансфер отель ↔ пирс','Катер или катамаран','Снаряжение для снорклинга','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Boat or catamaran','Snorkeling gear','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T21: { i: ['Трансфер','Проживание на борту (1 ночь)','Все питание','Дайвинг (2 погружения)','Снаряжение для снорклинга','Страховка (без русского гида)'], ie: ['Transfers','Onboard accommodation (1 night)','All meals','Diving (2 dives)','Snorkeling gear','Insurance (no Russian guide)'], b: SEA, be: SEA_EN },
  T22: { i: ['Трансфер','Проживание на борту (1 ночь)','Все питание','Снаряжение для снорклинга','Страховка (без русского гида)'], ie: ['Transfers','Onboard accommodation (1 night)','All meals','Snorkeling gear','Insurance (no Russian guide)'], b: SEA, be: SEA_EN },
  T23: { i: ['Трансфер отель ↔ пирс','Катер или катамаран','Снаряжение для снорклинга','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Boat or catamaran','Snorkeling gear','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T24: { i: ['Трансфер отель ↔ пирс','Катер','Снаряжение для снорклинга','Обед','Гид','Страховка'], ie: ['Hotel ↔ pier transfer','Boat','Snorkeling gear','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T25: { i: ['Трансфер','Проживание на острове','Все питание','Снаряжение для снорклинга','Страховка'], ie: ['Transfers','Island accommodation','All meals','Snorkeling gear','Insurance'], b: SEA, be: SEA_EN },
  T26: { i: ['Трансфер','Проживание','Все питание','Экскурсии по программе','Страховка'], ie: ['Transfers','Accommodation','All meals','Program excursions','Insurance'], b: SEA, be: SEA_EN },
  T27: { i: ['Трансфер','Проживание','Все питание','Экскурсии по программе','Страховка'], ie: ['Transfers','Accommodation','All meals','Program excursions','Insurance'], b: SEA, be: SEA_EN },
  T28: { i: ['Трансфер Пхукет — Пхи Пхи и обратно','Проживание на острове (1 ночь)','Питание по программе','Страховка'], ie: ['Phuket — Phi Phi transfer and return','Island accommodation (1 night)','Meals per program','Insurance'], b: SEA, be: SEA_EN },
  T29: { i: ['Ранний трансфер Пхукет — Пхи Пхи','Проживание на острове (1 ночь)','Питание по программе','Страховка'], ie: ['Early Phuket — Phi Phi transfer','Island accommodation (1 night)','Meals per program','Insurance'], b: SEA, be: SEA_EN },
  T30: { i: ['Билет на паром Пхукет ↔ Пхи Пхи (эконом-класс)','Место на борту'], ie: ['Phuket ↔ Phi Phi ferry ticket (economy)','Seat on board'], b: SEA, be: SEA_EN },
  T31: { i: ['Билет на скоростной катер Пхукет ↔ Пхи Пхи'], ie: ['Phuket ↔ Phi Phi speedboat ticket'], b: SEA, be: SEA_EN },
  T32: { i: ['Билет на паром в первом или премиум классе','Улучшенные места с дополнительными удобствами'], ie: ['First or Premium class ferry ticket','Upgraded seats with extra comfort'], b: SEA, be: SEA_EN },
  T33: { i: ['Трансфер по основным достопримечательностям','Русскоязычный гид','Входные билеты (Большой Будда, Ват Чалонг)','Страховка'], ie: ['Transfer between main sights','Russian-speaking guide','Entrance fees (Big Buddha, Wat Chalong)','Insurance'], b: LAND, be: LAND_EN },
  T34: { i: ['Трансфер по достопримечательностям и рынку','Русскоязычный гид','Страховка'], ie: ['Transfer to sights and market','Russian-speaking guide','Insurance'], b: LAND, be: LAND_EN },
  T35: { i: ['Трансфер туда и обратно','Гид','Все активности (слоны, джунгли, горячие источники)','Обед','Страховка'], ie: ['Round-trip transfer','Guide','All activities (elephants, jungle, hot springs)','Lunch','Insurance'], b: LAND, be: LAND_EN },
  T36: { i: ['Трансфер туда и обратно','Рафтинг по горной реке','Слоновье СПА','Обед','Страховка'], ie: ['Round-trip transfer','River rafting','Elephant SPA','Lunch','Insurance'], b: LAND, be: LAND_EN },
  T37: { i: ['Трансфер туда и обратно','Гид','Смотровая площадка Самет Нангше','Пляж с самолётами','Озеро с кувшинками Ma Doo Bua','Страховка'], ie: ['Round-trip transfer','Guide','Samet Nangshe viewpoint','Airplane beach','Ma Doo Bua lotus lake','Insurance'], b: LAND, be: LAND_EN },
  T38: { i: ['Трансфер туда и обратно','Гид','Стеклянный мост Самет Нангше','Пляж с самолётами','Озеро с кувшинками','Страховка'], ie: ['Round-trip transfer','Guide','Samet Nangshe glass bridge','Airplane beach','Lotus lake','Insurance'], b: LAND, be: LAND_EN },
  T39: { i: ['Трансфер туда и обратно','Рафтинг','Сафари на слонах','Квадроциклы по джунглям','Обед','Страховка'], ie: ['Round-trip transfer','River rafting','Elephant safari','Jungle ATV quad bikes','Lunch','Insurance'], b: LAND, be: LAND_EN },
  T40: { i: ['Трансфер туда и обратно','Рафтинг (программа по выбору)','Страховка (без русского гида)'], ie: ['Round-trip transfer','Rafting (chosen program)','Insurance (no Russian guide)'], b: LAND, be: LAND_EN },
  T41: { i: ['Трансфер туда и обратно','Рафтинг на бамбуковых плотах (программа по выбору)','Страховка (без русского гида)'], ie: ['Round-trip transfer','Bamboo rafting (chosen program)','Insurance (no Russian guide)'], b: LAND, be: LAND_EN },
  T42: { i: ['Трансфер туда и обратно','Гид','Сафари по нацпарку Кхао Лак','Купание и кормление слонов','Обед','Страховка'], ie: ['Round-trip transfer','Guide','Khao Lak NP safari','Elephant bathing & feeding','Lunch','Insurance'], b: LAND, be: LAND_EN },
  T43: { i: ['Трансфер туда и обратно','Прогулка на лодке по озеру Чаолан','Обед','Гид','Страховка'], ie: ['Round-trip transfer','Chaolan Lake boat tour','Lunch','Guide','Insurance'], b: LAND, be: LAND_EN },
  T44: { i: ['Трансфер туда и обратно','Прогулка на лодке по озеру Чеолан','Смотровая площадка Нангши Самет','Обед','Гид','Страховка'], ie: ['Round-trip transfer','Chaolan Lake boat tour','Samet Nangshe viewpoint','Lunch','Guide','Insurance'], b: LAND, be: LAND_EN },
  T45: { i: ['Трансфер туда и обратно','Гид','Посещение главных мест Краби','Обед','Страховка'], ie: ['Round-trip transfer','Guide','Visit to Krabi highlights','Lunch','Insurance'], b: LAND, be: LAND_EN },
  T46: { i: ['Трансфер туда и обратно','Лодка по заливу Пханг Нга','Каякинг','Обед','Гид','Страховка'], ie: ['Round-trip transfer','Phang Nga Bay boat','Kayaking','Lunch','Guide','Insurance'], b: SEA, be: SEA_EN },
  T47: { i: ['Трансфер туда и обратно','Ночная лодка','Стеклянный мост','Спа-программа','Ужин','Страховка'], ie: ['Round-trip transfer','Night boat','Glass bridge','Spa program','Dinner','Insurance'], b: SEA, be: SEA_EN },
  T48: { i: ['Трансфер до заповедника','Кормление и купание со слонами','Питание (по программе)','Страховка (без русского гида)'], ie: ['Transfer to sanctuary','Elephant feeding & bathing','Meals (per program)','Insurance (no Russian guide)'], b: LAND, be: LAND_EN },
  T49: { i: ['Трансфер до заповедника','Программа с elephants (2 или 4 часа)','Страховка (без русского гида)'], ie: ['Transfer to sanctuary','Elephant program (2 or 4 hours)','Insurance (no Russian guide)'], b: LAND, be: LAND_EN },
  T50: { i: ['Трансфер до заповедника Phuket Elephant Care','Активности по программе','Страховка'], ie: ['Transfer to Phuket Elephant Care','Program activities','Insurance'], b: LAND, be: LAND_EN },
  T51: { i: ['Трансфер до фермы Phang Chang Kamala','Программа по выбору (A–E)','Страховка (без русского гида)'], ie: ['Transfer to Phang Chang Kamala farm','Chosen program (A–E)','Insurance (no Russian guide)'], b: LAND, be: LAND_EN },
  T52: { i: ['Трансфер до фермы Phuchada Safari','Программа 30–60 минут','Страховка (без русского гида)'], ie: ['Transfer to Phuchada Safari farm','30–60 min elephant program','Insurance (no Russian guide)'], b: LAND, be: LAND_EN },
  T54: { i: ['Трансфер до зиплайн-парка','Зиплайн по выбранной программе','Инструктаж по безопасности','Страховка (без русского гида)'], ie: ['Transfer to zip line park','Zip line (chosen program)','Safety briefing','Insurance (no Russian guide)'], b: LAND, be: LAND_EN },
  T55: { i: ['Трансфер отель ↔ пирс','2 погружения с аквалангом','Всё необходимое оборудование','Инструктор','Страховка'], ie: ['Hotel ↔ pier transfer','2 scuba dives','Full diving equipment','Instructor','Insurance'], b: SEA, be: SEA_EN },
  T56: { i: ['Трансфер до трассы','Квадроцикл (30, 45 или 60 мин)','Инструктаж','Страховка'], ie: ['Transfer to ATV track','Quad bike (30, 45 or 60 min)','Safety briefing','Insurance'], b: LAND, be: LAND_EN },
  T57: { i: ['Полёт на самолёте или вертолёте (по выбору)','Пилот','Страховка'], ie: ['Scenic flight by plane or helicopter','Pilot','Insurance'], b: LAND, be: LAND_EN },
  T59: { i: ['Трансфер отель ↔ пирс','Катер','Снасти и оборудование для рыбалки','Страховка'], ie: ['Hotel ↔ pier transfer','Boat','Fishing gear and equipment','Insurance'], b: SEA, be: SEA_EN },
  T61: { i: ['Входной билет в аквапарк (Splash Jungle или Andamanda)','Трансфер опционально'], ie: ['Water park entry ticket (Splash Jungle or Andamanda)','Transfer optional'], b: LAND, be: LAND_EN },
  T65: { i: ['Билет на стадион (Stadium или VIP/Ringside)'], ie: ['Stadium ticket (Stadium or VIP/Ringside)'], b: LAND, be: LAND_EN },
  T68: { i: ['Авиаперелёт или трансфер','Проживание (по программе)','Питание (по программе)','Экскурсионная программа','Страховка'], ie: ['Flight or transfer','Accommodation (per program)','Meals (per program)','Tour program','Insurance'], b: LAND, be: LAND_EN },
  T69: { i: ['Трансфер Пхукет — граница (Сатун или Ранонг) — Пхукет','Все пограничные процедуры'], ie: ['Phuket — border (Satun or Ranong) — Phuket transfer','All border procedures'], b: LAND, be: LAND_EN },
  T70: { i: ['Полное сопровождение при оформлении тайских прав','Помощь со сдачей экзаменов'], ie: ['Full assistance for Thai driver\'s license','Exam support'], b: LAND, be: LAND_EN },
  T71: { i: ['Аренда судна (лодка, яхта или катамаран) на выбранный маршрут','Капитан и экипаж','Топливо','Страховка'], ie: ['Vessel rental (boat, yacht or catamaran) for chosen route','Captain and crew','Fuel','Insurance'], b: SEA, be: SEA_EN },
};

let updated = 0;
data.forEach(t => {
  const c = CONTENT[t.sku];
  if (!c) return;
  t.included = c.i;
  t.included_en = c.ie;
  t.what_to_bring = c.b;
  t.what_to_bring_en = c.be;
  t.cancellation = C;
  t.cancellation_en = CE;
  updated++;
});

// Also set cancellation for T01 (already has included set)
data.forEach(t => {
  if (!t.cancellation || !t.cancellation.length) {
    t.cancellation = C;
    t.cancellation_en = CE;
  }
  if (!t.what_to_bring || !t.what_to_bring.length) {
    t.what_to_bring = SEA;
    t.what_to_bring_en = SEA_EN;
  }
});

fs.writeFileSync(p, JSON.stringify(data, null, 2));
console.log('Updated', updated, 'tours. Total:', data.length);
