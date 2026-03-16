/* ============================================================
   AZANOV RETREAT — COMPONENT DATA & RENDER FUNCTIONS
   ============================================================ */

function _d(obj, field) {
  return (window.i18n && window.i18n.d(obj, field)) || (obj && obj[field]) || '';
}
function _t(key) {
  return (window.i18n && window.i18n.t(key)) || key;
}
function fleetDesc(y) {
  if (window.i18n && window.i18n.lang === 'en') {
    return y.description_en || FLEET_DESC_EN[y.type] || y.description || '';
  }
  return y.description || '';
}

/* ---- DATA: PACKAGES ---- */
const PACKAGES = [
  {
    id: 'regent',
    name: 'Regent Bang Tao Escape',
    subtitle: 'Две недели приватной роскоши в сердце Банг Тао',
    subtitle_en: 'Two weeks of private luxury in the heart of Bang Tao',
    price: 280000,
    priceLabel: '280 000 ฿',
    nights: '14 ночей',
    nights_en: '14 nights',
    badge: 'Бутик-ретрит',
    badge_en: 'Boutique Retreat',
    badgeType: 'gold',
    guests: 6,
    bedrooms: 2,
    area: '140 м²',
    villaIds: ['v11'],
    villa: 'The Regent Bang Tao, апартаменты 140 м²',
    yacht: 'Катамаран Dolphin 50ft',
    yachtIds: ['pkg-dolphin'],
    excursion: 'Катамаран Пхи-Пхи + Майтон, Пханг Нга + Стеклянный мост, Hanuman World',
    excursionIds: ['pkhi-pkhi-bambu-kay-mayton-na-katamarane', '11-ostrovov-variant-1'],
    excursionImages: [
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-1.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-3.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-9.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-11.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-13.jpg',
      'assets/tours/11-ostrovov-variant-1/images/photo-1.jpg'
    ],
    img: 'assets/houses/V-008/img_01.jpg',
    images: [...Array.from({length: 7}, (_, i) => `assets/houses/V-008/img_${String(i+1).padStart(2,'0')}.jpg`), ...Array.from({length: 20}, (_, i) => `assets/houses/V-008/img_${String(i+9).padStart(2,'0')}.jpg`)],
    color: '#C9A84C',
    description: 'Закрытый клубный ретрит без массового туризма: только ваша группа, полная приватность, ощущение собственной виллы в премиум-комплексе The Regent. Идеальное сочетание wow-экскурсий на приватном катамаране, профессиональной фотосъёмки и спокойных дней полного релакса. Локация — сердце Банг Тао: 2 минуты пешком до Boat Avenue, 10 минут до пляжа и Laguna.',
    description_en: 'An exclusive club retreat away from mass tourism: only your group, full privacy, the feel of your own villa in The Regent premium complex. The perfect blend of wow excursions on a private catamaran, professional photography, and calm days of full relaxation. Location — heart of Bang Tao: 2 min walk to Boat Avenue, 10 min to beach and Laguna.',
    included: [
      { short: 'Проживание в апартаментах 140 м² (2 спальни, 2 санузла, кухня, гостиная, балкон) — 14 ночей', short_en: 'Stay in a 140 m² apartment (2 bed, 2 bath, kitchen, living room, balcony) — 14 nights', popupTitle: 'Проживание', popupTitle_en: 'Accommodation', popupDesc: 'Просторные апартаменты 140 м² в The Regent Bang Tao: 2 спальни, 2 санузла, полностью оборудованная кухня, большая гостиная, балкон с видом. Уровень приватной виллы с отельным сервисом. Локация — сердце Банг Тао: 2 минуты пешком до Boat Avenue, 10 минут до пляжа и Laguna.', popupDesc_en: 'Spacious 140 m² apartment in The Regent Bang Tao: 2 bedrooms, 2 bathrooms, fully equipped kitchen, large living room, balcony with view. Private villa level with hotel service. Location — heart of Bang Tao: 2 min walk to Boat Avenue, 10 min to beach and Laguna.' },
      { short: 'Ежедневная полная уборка (смена белья, полотенец, heavy clean)', short_en: 'Daily full housekeeping (linen, towels, deep clean)', popupTitle: 'Уборка', popupTitle_en: 'Housekeeping', popupDesc: 'Ежедневная профессиональная уборка включена в стоимость. Смена белья и полотенец, тщательная уборка помещений. Вам не нужно беспокоиться о быте — всё под контролем.', popupDesc_en: 'Daily professional housekeeping included. Linen and towel change, thorough cleaning. No need to worry about daily chores — everything is taken care of.' },
      { short: 'Все трансферы на премиум-минивэне (аэропорт ↔ апартаменты + все экскурсии)', short_en: 'All transfers by premium minivan (airport ↔ apartment + all excursions)', popupTitle: 'Трансферы', popupTitle_en: 'Transfers', popupDesc: 'Все трансферы на премиум-минивэне: встреча в аэропорту, доставка до апартаментов, трансферы на все экскурсии и обратно. Комфорт и пунктуальность на всём маршруте.', popupDesc_en: 'All transfers by premium minivan: airport meet & greet, delivery to apartment, transfers to and from all excursions. Comfort and punctuality throughout.' },
      { short: 'Приватная экскурсия на катамаране 50 ft «Dolphin» — Ко Пхи-Пхи + Майтон (9 часов, снорклинг, обед на борту)', short_en: 'Private catamaran excursion «Dolphin 50ft» — Phi Phi + Maiton (9 hrs, snorkeling, onboard lunch)', popupTitle: 'Катамаран Dolphin 50ft', popupTitle_en: 'Catamaran Dolphin 50ft', popupDesc: 'Полный день на моторном катамаране 50 ft «Dolphin»: маршрут Ко Пхи-Пхи + остров Майтон. 9 часов в море, снорклинг, пляжи, обед на борту. Стабильность и комфорт — никаких посторонних, только ваша группа.', popupDesc_en: 'Full day on the motor catamaran 50ft «Dolphin»: Koh Phi Phi + Maiton island route. 9 hours at sea, snorkeling, beaches, onboard lunch. Stability and comfort — no strangers, only your group.' },
      { short: 'Полный день «Удивительная Пханг Нга + Стеклянный мост» (русский гид, обед, слоны, водопад)', short_en: '«Amazing Phang Nga + Glass Bridge» full day (guide, lunch, elephants, waterfall)', popupTitle: 'Пханг Нга + Стеклянный мост', popupTitle_en: 'Phang Nga + Glass Bridge', popupDesc: 'Самет Нангши, пещерный храм, мангровые леса на длиннохвостой лодке, деревня морских цыган, храм Ада и Рая, прогулка на слонах, водопад. Русский гид, обед включён.', popupDesc_en: 'Samet Nangshe, cave temple, mangroves by longtail boat, sea gypsy village, Heaven & Hell temple, elephant walk, waterfall. Guide, lunch included.' },
      { short: 'Полдня Hanuman World — зиплайн 42 платформы + обед', short_en: 'Half-day Hanuman World — 42-platform zipline + lunch', popupTitle: 'Hanuman World', popupTitle_en: 'Hanuman World', popupDesc: 'Экскурсия в Hanuman World: зиплайн 42 платформы через джунгли, обед включён. После — релакс в апартаментах.', popupDesc_en: 'Hanuman World excursion: 42-platform jungle zipline, lunch included. Relax at the apartment afterwards.' },
      { short: 'Профессиональный фотограф на 2 ключевых дня (яхта + Пханг Нга) — полный день съёмки + обработка', short_en: 'Professional photographer 2 key days (yacht + Phang Nga) — full day shoot + editing', popupTitle: 'Фотограф', popupTitle_en: 'Photographer', popupDesc: 'Профессиональный фотограф на 2 ключевых дня: день на катамаране и день экскурсии Пханг Нга. Полный день съёмки, базовая обработка и передача файлов. Премиум-контент для личного архива и соцсетей.', popupDesc_en: 'Professional photographer for 2 key days: catamaran day and Phang Nga excursion day. Full day shoot, basic editing and file delivery. Premium content for personal archive and social media.' },
      { short: 'Full-консьерж 24/7 на весь период', short_en: 'Full concierge 24/7 throughout stay', popupTitle: 'Консьерж 24/7', popupTitle_en: 'Concierge 24/7', popupDesc: 'Полный консьерж-сервис круглосуточно: рекомендации, бронирования, решение любых вопросов. Ваш личный ассистент на острове.', popupDesc_en: 'Full concierge service around the clock: recommendations, bookings, any request. Your personal island assistant.' }
    ],
    program: [
      { day: 1, title: 'Прилёт, трансфер, welcome', title_en: 'Arrival, transfer, welcome', desc: 'Трансфер из аэропорта на премиум-минивэне. Welcome в апартаментах — фрукты, напитки. Лёгкий ужин в Boat Avenue (2 минуты пешком).', desc_en: 'Airport transfer by premium minivan. Welcome at apartment — fruits, drinks. Light dinner at Boat Avenue (2 min walk).' },
      { day: 2, title: 'Свободный день — пляж и Laguna', title_en: 'Free day — beach & Laguna', desc: 'Пляж Банг Тао, Blue Tree, Laguna. Шопинг в Boat Avenue, массаж. Ужин в апартаментах или ресторане — по желанию.', desc_en: 'Bang Tao beach, Blue Tree, Laguna. Shopping at Boat Avenue, massage. Dinner at apartment or restaurant — as preferred.' },
      { day: 3, title: 'Свободный день — релакс', title_en: 'Free day — relaxation', desc: 'Свободный день в вашем ритме. Бассейн комплекса, спа, шопинг, прогулки по Банг Тао.', desc_en: 'Free day at your own pace. Complex pool, spa, shopping, Bang Tao walks.' },
      { day: 4, title: 'Свободный день — активности по желанию', title_en: 'Free day — optional activities', desc: 'Свободный день. Доступны дополнительные активности по желанию через консьержа.', desc_en: 'Free day. Additional activities available on request via concierge.' },
      { day: 5, title: 'Катамаран «Dolphin 50ft» — Пхи-Пхи + Майтон', title_en: 'Catamaran «Dolphin 50ft» — Phi Phi + Maiton', desc: 'Полный день на приватном катамаране 50ft. Маршрут Ко Пхи-Пхи + остров Майтон. 9 часов, снорклинг, пляжи, обед на борту. Фотограф весь день.', desc_en: 'Full day on private catamaran 50ft. Route: Koh Phi Phi + Maiton island. 9 hours, snorkeling, beaches, onboard lunch. Photographer all day.' },
      { day: 6, title: 'Восстановление — бассейн, йога, спа', title_en: 'Recovery — pool, yoga, spa', desc: 'Бассейн комплекса, йога на балконе, спа, шопинг. День полного расслабления после морского приключения.', desc_en: 'Complex pool, balcony yoga, spa, shopping. A full relaxation day after the sea adventure.' },
      { day: 7, title: 'Пханг Нга + Стеклянный мост', title_en: 'Phang Nga + Glass Bridge', desc: 'Полный день: Самет Нангши, пещерный храм, мангровые леса (длиннохвостая лодка), деревня морских цыган, храм Ада и Рая, слоны, водопад. Русский гид, обед включён. Фотограф весь день.', desc_en: 'Full day: Samet Nangshe, cave temple, mangrove longtail boat, sea gypsy village, Heaven & Hell temple, elephants, waterfall. Russian guide, lunch included. Photographer all day.' },
      { day: 8, title: 'Hanuman World — зиплайн', title_en: 'Hanuman World — zipline', desc: 'Полдня: Hanuman World — зиплайн 42 платформы через джунгли, обед включён. После — возвращение и релакс в апартаментах.', desc_en: 'Half-day: Hanuman World — 42-platform jungle zipline, lunch included. Return and relax at apartment.' },
      { day: 9, title: 'Свободный день', title_en: 'Free day', desc: 'Свободный день в вашем ритме: полный отдых или дополнительные активности по желанию через консьержа.', desc_en: 'Free day at your own pace: complete rest or additional activities on request via concierge.' },
      { day: 10, title: 'Свободный день', title_en: 'Free day', desc: 'Свободный день. Пляж, массаж, шопинг — всё рядом. Консьерж доступен 24/7.', desc_en: 'Free day. Beach, massage, shopping — all nearby. Concierge available 24/7.' },
      { day: 11, title: 'Свободный день', title_en: 'Free day', desc: 'Свободный день. Laguna, Blue Tree или другие локации Банг Тао — по желанию.', desc_en: 'Free day. Laguna, Blue Tree or other Bang Tao spots — as you wish.' },
      { day: 12, title: 'Свободный день', title_en: 'Free day', desc: 'Свободный день. Возможность заказать доп. экскурсии или активности через консьержа.', desc_en: 'Free day. Option to book additional excursions or activities via concierge.' },
      { day: 13, title: 'Свободный день', title_en: 'Free day', desc: 'Последние свободные дни в своём ритме. Полный релакс или активности на выбор.', desc_en: 'Last free days at your own pace. Full relaxation or optional activities.' },
      { day: 14, title: 'Лёгкий день + прощальный ужин', title_en: 'Easy day + farewell dinner', desc: 'Лёгкий день, возможна фотосессия на закате (доп.), прощальный ужин в любимом месте.', desc_en: 'Easy day, optional sunset photoshoot, farewell dinner at your favourite spot.' },
      { day: 15, title: 'Выезд — трансфер в аэропорт', title_en: 'Departure — airport transfer', desc: 'Трансфер в аэропорт на премиум-минивэне. До свидания, Пхукет!', desc_en: 'Transfer to airport by premium minivan. Until next time, Phuket!' }
    ],
    extras: ['Приватный ужин шеф-поваром прямо в апартаментах', 'Закатный круиз на яхте / катамаране', 'Премиум-спа в Anantara, Banyan Tree или Laguna', 'Дополнительные фотосессии (закат, пляж, апартаменты)', 'Приватный трансфер на Mercedes/V Class', 'Алкоголь, премиум-напитки, фруктовые корзины, цветы', 'Йога / пилатес с инструктором', 'Гольф, рыбалка, дайвинг и многое другое'],
    extras_en: ['Private chef dinner at apartment', 'Sunset yacht/catamaran cruise', 'Premium spa at Anantara, Banyan Tree or Laguna', 'Additional photo sessions (sunset, beach, apartment)', 'Private Mercedes/V Class transfer', 'Alcohol, premium drinks, fruit baskets, flowers', 'Yoga / pilates with instructor', 'Golf, fishing, diving and much more'],
    sellingPoints: ['Апартаменты 140 м² в The Regent — уровень приватной виллы с отельным сервисом', 'Приватный катамаран 50 ft — стабильность, комфорт, никаких посторонних', 'Два дня профессиональной фотосъёмки — премиум-контент для архива и соцсетей', 'Баланс wow-экскурсий (3 дня) и абсолютного релакса (10+ дней)', 'Локация в центре Банг Тао — всё под рукой, но тихо и эксклюзивно', 'Формат закрытого клуба — только ваша группа, полная свобода и персонализация'],
    sellingPoints_en: ['140 m\u02bc² apartment at The Regent — private villa level with hotel service', 'Private catamaran 50 ft — stability, comfort, no strangers', 'Two days of professional photography — premium content for archive and social media', 'Balance of wow excursions (3 days) and absolute relaxation (10+ days)', 'Central Bang Tao location — everything at hand, yet quiet and exclusive', 'Private club format — only your group, full freedom and personalisation']
  },
  {
    id: 'laguna',
    name: 'Laguna Private Haven',
    subtitle: 'Ваш личный уголок рая в сердце Банг Тао',
    subtitle_en: 'Your personal corner of paradise in the heart of Bang Tao',
    price: 500000,
    priceLabel: '500 000 ฿',
    nights: '14 ночей',
    nights_en: '14 nights',
    badge: 'Закрытый клуб',
    badge_en: 'Private Club',
    badgeType: 'teal',
    guests: 8,
    bedrooms: 5,
    area: '~500 м²',
    villaIds: ['v10'],
    villa: 'Laguna Park 2 — 5-спальная вилла',
    yacht: 'Катамаран Lunik Floeth 48ft',
    yachtIds: ['pkg-lunik'],
    excursion: 'Mantra Spa + Samet Nangshe, Пханг Нга, катамаран Koh Kai + Maiton',
    excursionIds: ['pkhi-pkhi-bambu-kay-mayton-na-katamarane', '4-zhemchuzhiny-andamana'],
    excursionImages: [
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-1.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-9.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-11.jpg',
      'assets/tours/4-zhemchuzhiny-andamana/images/photo-2.jpg',
      'assets/tours/4-zhemchuzhiny-andamana/images/photo-6.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-13.jpg'
    ],
    img: 'assets/houses/V-016/img_01.jpg',
    images: villaImages('V-016', 25),
    color: '#40E0D0',
    description: 'Где тишина встречает роскошь, а каждый день становится воспоминанием. Престижный комплекс Laguna Park 2 с видом на море. Современная вилла 2019 года, приватный бассейн, sea view. Строго 6–8 человек — закрытый клуб, полная приватность.',
    description_en: 'Where silence meets luxury and every day becomes a memory. Prestigious Laguna Park 2 complex with sea view. Modern 2019 villa, private pool, sea view. Strictly 6–8 guests — private club, full privacy.',
    included: [
      { short: 'Приватная вилла на 14 ночей (5 спален, 5 ванных, приватный бассейн, терраса sea view)', short_en: 'Private villa 14 nights (5 bed, 5 bath, private pool, sea-view terrace)', popupTitle: 'Вилла Laguna Park 2', popupTitle_en: 'Laguna Park 2 Villa', popupDesc: 'Современная 5-спальная вилла ~500 м², 3 уровня, построена 2019. Приватный бассейн, терраса с видом на море, полностью оборудована (кухня, гостиная, кондиционеры, Wi-Fi). Разрешены хорошо воспитанные питомцы (без лая).', popupDesc_en: 'Modern 5-bedroom villa ~500 m², 3 levels, built 2019. Private pool, sea-view terrace, fully equipped (kitchen, living room, AC, Wi-Fi). Well-behaved pets (no barking) allowed.' },
      { short: 'Ежедневная профессиональная уборка', short_en: 'Daily professional housekeeping', popupTitle: 'Уборка', popupTitle_en: 'Housekeeping', popupDesc: 'Ежедневная профессиональная уборка включена в стоимость. Поддержание порядка и чистоты на протяжении всего пребывания.', popupDesc_en: 'Daily professional housekeeping is included. Order and cleanliness maintained throughout your entire stay.' },
      { short: 'Welcome-сет при заселении (напитки, фрукты, лёгкое угощение)', short_en: 'Welcome set on arrival (drinks, fruits, light refreshments)', popupTitle: 'Welcome-сет', popupTitle_en: 'Welcome Set', popupDesc: 'При заселении: прохладительные напитки, сезонные фрукты, лёгкое welcome-угощение. Сразу почувствуйте заботу.', popupDesc_en: 'On arrival: soft drinks, seasonal fruits, light welcome treat. Feel the care from the very first moment.' },
      { short: 'Полный день на катамаране «Lunik Floeth 48ft» (Koh Kai + Maiton, каяк, рыбалка, плавучий бассейн)', short_en: 'Full day on catamaran «Lunik Floeth 48ft» (Koh Kai + Maiton, kayak, fishing, floating pool)', popupTitle: 'Катамаран Lunik Floeth 48ft', popupTitle_en: 'Catamaran Lunik Floeth 48ft', popupDesc: 'Профессиональный экипаж, прохладительные напитки, фрукты, каяк, рыбалка, плавучий бассейн, полотенца, страховка. Маршрут Koh Kai + Maiton.', popupDesc_en: 'Professional crew, soft drinks, fruits, kayak, fishing, floating pool, towels, insurance. Route: Koh Kai + Maiton.' },
      { short: 'Экскурсия «Mantra Spa + Samet Nangshe + Белый храм» (русский гид, обед, слоны, термальные бассейны)', short_en: '«Mantra Spa + Samet Nangshe + White Temple» tour (guide, lunch, elephants, thermal pools)', popupTitle: 'Mantra Spa + Samet Nangshe + Белый храм', popupTitle_en: 'Mantra Spa + Samet Nangshe + White Temple', popupDesc: 'Трансфер, русскоязычный гид, обед. Посещение храма, смотровая площадка, слоновый заповедник, релакс в термальных бассейнах и саунах Mantra Spa.', popupDesc_en: 'Transfer, Russian-speaking guide, lunch. Temple visit, observation deck, elephant sanctuary, relax in thermal pools and saunas at Mantra Spa.' },
      { short: 'Экскурсия «Удивительная Пханг Нга + Стеклянный мост» (лодка по манграм, храм Ада и Рая, слоны, водопад)', short_en: '«Amazing Phang Nga + Glass Bridge» tour (mangrove boat, Heaven & Hell temple, elephants, waterfall)', popupTitle: 'Пханг Нга + Стеклянный мост', popupTitle_en: 'Phang Nga + Glass Bridge', popupDesc: 'Трансфер, русский гид, обед. Лодка по манграм, храм Ада и Рая, слоны, водопад, Самет Нангши со стеклянным мостом.', popupDesc_en: 'Transfer, guide, lunch. Mangrove boat, Heaven & Hell temple, elephants, waterfall, Samet Nangshe with glass bridge.' },
      { short: 'Личный фотограф на все три экскурсионных дня', short_en: 'Personal photographer for all three excursion days', popupTitle: 'Фотограф', popupTitle_en: 'Photographer', popupDesc: 'Профессиональный фотограф сопровождает все три экскурсионных дня. Все моменты в профессиональных кадрах.', popupDesc_en: 'Professional photographer accompanies all three excursion days. Every moment captured in professional shots.' },
      { short: 'Все трансферы по программе (аэропорт ↔ вилла + экскурсии)', short_en: 'All transfers on program (airport ↔ villa + excursions)', popupTitle: 'Трансферы', popupTitle_en: 'Transfers', popupDesc: 'Все трансферы по программе: аэропорт ↔ вилла, трансферы на экскурсии и обратно.', popupDesc_en: 'All program transfers: airport ↔ villa, transfers to excursions and back.' },
      { short: 'Full-консьерж 24/7', short_en: 'Full concierge 24/7', popupTitle: 'Консьерж 24/7', popupTitle_en: 'Concierge 24/7', popupDesc: 'Координация, помощь по любым вопросам круглосуточно.', popupDesc_en: 'Coordination and assistance with any request around the clock.' }
    ],
    program: [
      { day: 1, title: 'Прилёт, заселение', title_en: 'Arrival, check-in', desc: 'Приватный трансфер, welcome-сет (напитки + фрукты + угощение), отдых у бассейна.', desc_en: 'Private transfer, welcome set (drinks + fruits + treats), relax by the pool.' },
      { day: 2, title: 'Релакс на вилле', title_en: 'Villa relaxation', desc: 'Приватный бассейн, sea view, свободное время.', desc_en: 'Private pool, sea view, free time.' },
      { day: 5, title: 'Mantra Spa + Samet Nangshe + Белый храм', title_en: 'Mantra Spa + Samet Nangshe + White Temple', desc: 'Экскурсия + фотограф.', desc_en: 'Excursion + photographer.' },
      { day: 7, title: 'Катамаран Lunik Floeth 48ft', title_en: 'Catamaran Lunik Floeth 48ft', desc: 'Koh Kai + Maiton + фотограф.', desc_en: 'Koh Kai + Maiton + photographer.' },
      { day: 11, title: 'Пханг Нга + Стеклянный мост', title_en: 'Phang Nga + Glass Bridge', desc: 'Экскурсия + фотограф.', desc_en: 'Excursion + photographer.' },
      { day: 15, title: 'Выезд', title_en: 'Departure', desc: 'Трансфер в аэропорт.', desc_en: 'Transfer to airport.' }
    ],
    extras: ['Приватный ужин от шеф-повара на вилле (от 2 500–3 500 THB/чел.)', 'Приватная йога-сессия (2 500–4 000 THB/сессия)', 'Массаж на вилле (от 1 200–2 000 THB/чел.)'],
    extras_en: ['Private chef dinner at villa (from 2,500–3,500 THB/person)', 'Private yoga session (2,500–4,000 THB/session)', 'Villa massage (from 1,200–2,000 THB/person)'],
    sellingPoints: ['Полностью приватная вилла в Laguna Park', 'Закрытый клуб 6–8 человек — полная эксклюзивность', 'Три тщательно подобранные активности', 'Личный фотограф на каждый выезд', 'Sea view, приватный бассейн, дизайн 2019 года', 'Welcome-сет + ежедневная уборка + консьерж 24/7'],
    sellingPoints_en: ['Fully private villa in Laguna Park', 'Private club 6–8 guests — full exclusivity', 'Three curated activities', 'Personal photographer on every trip', 'Sea view, private pool, 2019 design', 'Welcome set + daily housekeeping + concierge 24/7']
  },
  {
    id: 'rockpool',
    name: 'Rock Pool Premium 10D',
    subtitle: '10 дней • 8 спален • Nai Harn',
    price: 810000,
    priceLabel: '810 000 ฿',
    nights: '9 ночей',
    nights_en: '9 nights',
    badge: 'Премиум',
    badge_en: 'Premium',
    badgeType: 'white',
    guests: 15,
    bedrooms: 8,
    area: '1600 м²',
    villaIds: ['v3'],
    villa: 'Rock Pool Villa (V-017) — 8 спален, 1600 м²',
    yacht: 'Яхта Posillipo-Rizzardi Technema 89',
    yachtIds: ['f57'],
    excursion: 'Яхта Пхи-Пхи, Изумруды Краби 2д/1н',
    excursionIds: ['pkhi-pkhi-bambu-kay-na-lyuksovom-katere', 'khong-krabi'],
    excursionImages: [
      'assets/tours/pkhi-pkhi-bambu-kay-na-lyuksovom-katere/images/photo-1.png',
      'assets/tours/pkhi-pkhi-bambu-kay-na-lyuksovom-katere/images/photo-3.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-na-lyuksovom-katere/images/photo-11.jpg',
      'assets/tours/khong-krabi/images/photo-3.jpg',
      'assets/tours/khong-krabi/images/photo-7.jpg',
      'assets/tours/khong-krabi/images/photo-11.jpg'
    ],
    img: 'assets/houses/V-017/img_01.jpg',
    images: villaImages('V-017', 57),
    color: '#F0D98A',
    description: 'Вилла Rock Pool — 8 спален, территория 1600 м². Бассейн 8×8 м с джакузи, SPA-зона, паровая сауна. Яхта Technema 89 на Пхи-Пхи, экскурсия «Изумруды Краби» 2д/1н. Фотограф 3 дня.',
    description_en: 'Rock Pool Villa — 8 bedrooms, 1600 m². 8×8 m pool with jacuzzi, SPA zone, steam sauna. Technema 89 yacht to Phi Phi, «Emerald Krabi» 2d/1n tour. Photographer 3 days.',
    included: [
      { short: 'Вилла Rock Pool (V-017) — 8 спален, территория 1600 м²', short_en: 'Rock Pool Villa (V-017) — 8 bedrooms, 1600 m²', popupTitle: 'Вилла Rock Pool', popupTitle_en: 'Rock Pool Villa', popupDesc: 'Вилла Rock Pool (V-017): 8 спален, территория 1600 м². Бассейн 8×8 м с джакузи, SPA-зона, паровая сауна. Nai Harn.', popupDesc_en: 'Rock Pool Villa (V-017): 8 bedrooms, 1600 m². 8×8 m pool with jacuzzi, SPA zone, steam sauna. Nai Harn.' },
      { short: 'Бассейн 8×8 м с джакузи, SPA-зона, паровая сауна', short_en: '8×8 m pool with jacuzzi, SPA zone, steam sauna', popupTitle: 'Бассейн и SPA', popupTitle_en: 'Pool & SPA', popupDesc: 'Бассейн 8×8 м с джакузи, отдельная SPA-зона, паровая сауна. Всё на территории виллы.', popupDesc_en: '8×8 m pool with jacuzzi, separate SPA zone, steam sauna. All on the villa grounds.' },
      { short: 'Ежедневная уборка включена', short_en: 'Daily housekeeping included', popupTitle: 'Уборка', popupTitle_en: 'Housekeeping', popupDesc: 'Ежедневная уборка включена в стоимость пакета.', popupDesc_en: 'Daily housekeeping included in the package price.' },
      { short: 'Электричество и вода включены в пакет', short_en: 'Electricity and water included', popupTitle: 'Коммунальные услуги', popupTitle_en: 'Utilities', popupDesc: 'Электричество и вода включены в стоимость пакета. Без доплат по счётчику.', popupDesc_en: 'Electricity and water included. No meter surcharges.' },
      { short: 'Яхта Posillipo-Rizzardi Technema 89 (9 часов, Пхи-Пхи)', short_en: 'Posillipo-Rizzardi Technema 89 yacht (9 hrs, Phi Phi)', popupTitle: 'Яхта Technema 89', popupTitle_en: 'Technema 89 Yacht', popupDesc: 'Яхта Posillipo-Rizzardi Technema 89: 9 часов, маршрут Пхи-Пхи. Премиум-судно для морского дня.', popupDesc_en: 'Posillipo-Rizzardi Technema 89 yacht: 9 hours, Phi Phi route. Premium vessel for an unforgettable sea day.' },
      { short: 'Экскурсия «Изумруды Краби» 2д/1н (русский гид, отель 3–4*)', short_en: '«Emerald Krabi» 2d/1n tour (guide, 3–4★ hotel)', popupTitle: 'Изумруды Краби', popupTitle_en: 'Emerald Krabi', popupDesc: 'Двухдневная экскурсия: Klang Cave, Emerald Lake, hot springs, Ao Nang. День 2: острова Twin Sea, Chicken, Poda, снорклинг. Русский гид, отель 3–4*.', popupDesc_en: 'Two-day tour: Klang Cave, Emerald Lake, hot springs, Ao Nang. Day 2: Twin Sea, Chicken, Poda islands, snorkeling. Guide, 3–4★ hotel.' },
      { short: 'Фотограф 3 дня (яхта + 2 дня Краби)', short_en: 'Photographer 3 days (yacht + 2 Krabi days)', popupTitle: 'Фотограф', popupTitle_en: 'Photographer', popupDesc: 'Профессиональный фотограф на 3 дня: день на яхте и 2 дня экскурсии Краби.', popupDesc_en: 'Professional photographer for 3 days: one yacht day and 2 Krabi excursion days.' },
      { short: 'Трансфер аэропорт ↔ вилла ↔ пирс ↔ аэропорт', short_en: 'Airport ↔ villa ↔ pier ↔ airport transfer', popupTitle: 'Трансферы', popupTitle_en: 'Transfers', popupDesc: 'Все трансферы по маршруту: аэропорт ↔ вилла ↔ пирс ↔ аэропорт.', popupDesc_en: 'All route transfers: airport ↔ villa ↔ pier ↔ airport.' },
      { short: 'Вилла-менеджер и консьерж по запросу', short_en: 'Villa manager & concierge on request', popupTitle: 'Вилла-менеджер', popupTitle_en: 'Villa Manager', popupDesc: 'Вилла-менеджер и консьерж-сервис по запросу.', popupDesc_en: 'Villa manager and concierge service on request.' }
    ],
    program: [
      { day: 1, title: 'Прилёт и заселение', title_en: 'Arrival & check-in', desc: 'Трансфер из аэропорта, check-in, отдых у бассейна.', desc_en: 'Airport transfer, check-in, relax by the pool.' },
      { day: 2, title: 'Nai Harn', title_en: 'Nai Harn', desc: 'Пляж Nai Harn, релакс, массаж по запросу.', desc_en: 'Nai Harn beach, relaxation, massage on request.' },
      { day: 3, title: 'Суперяхта Technema 89', title_en: 'Superyacht Technema 89', desc: '9 часов, Пхи-Пхи. Фотограф.', desc_en: '9 hours, Phi Phi. Photographer.' },
      { day: 4, title: 'Краби (день 1)', title_en: 'Krabi (day 1)', desc: 'Klang Cave, Emerald Lake, hot springs, заселение Ao Nang. Фотограф.', desc_en: 'Klang Cave, Emerald Lake, hot springs, check-in Ao Nang. Photographer.' },
      { day: 5, title: 'Краби (день 2)', title_en: 'Krabi (day 2)', desc: 'Острова Twin Sea, Chicken, Poda, снорклинг, возвращение на Пхукет. Фотограф.', desc_en: 'Twin Sea, Chicken, Poda islands, snorkeling, return to Phuket. Photographer.' },
      { day: 6, title: 'Релакс', title_en: 'Relax day', desc: 'Отдых на вилле, бассейн, SPA-зона.', desc_en: 'Villa rest, pool, SPA zone.' },
      { day: 8, title: 'Пхукет-таун', title_en: 'Phuket Old Town', desc: 'Прогулка, шопинг или экскурсии.', desc_en: 'Stroll, shopping or excursions.' },
      { day: 9, title: 'Финальный день', title_en: 'Final day', desc: 'Закат на Промтеп, ужин по рекомендации.', desc_en: 'Sunset at Promthep Cape, dinner at a recommended venue.' },
      { day: 10, title: 'Выезд', title_en: 'Departure', desc: 'Чек-аут и трансфер в аэропорт.', desc_en: 'Check-out and airport transfer.' }
    ],
    extras: ['Дополнительные активности по запросу через консьерж'],
    extras_en: ['Additional activities on request via concierge'],
    sellingPoints: ['Вилла 1600 м² с бассейном и SPA', 'Яхта Technema 89 — премиум-судно', 'Экскурсия «Изумруды Краби» 2д/1н', 'Фотограф 3 дня', 'До 15 гостей — идеально для большой компании'],
    sellingPoints_en: ['1,600 m² villa with pool and SPA', 'Technema 89 yacht — premium vessel', '«Emerald Krabi» 2d/1n tour', 'Photographer 3 days', 'Up to 15 guests — ideal for large groups']
  },
  {
    id: 'quick',
    name: 'Quick Phuket Escape',
    subtitle: '5 ночей • 4 спальни • Rawai / Nai Harn',
    subtitle_en: '5 nights • 4 bedrooms • Rawai / Nai Harn',
    price: 135000,
    priceLabel: '135 000 ฿',
    nights: '5 ночей',
    nights_en: '5 nights',
    badge: 'Быстрый старт',
    badge_en: 'Quick Start',
    badgeType: 'white',
    guests: 8,
    bedrooms: 4,
    area: '125 м² жилая / 175 м² участок',
    villaIds: ['v6'],
    villa: 'Unique Villa Baan Bua (V-004) — 4 спальни, 4 ванные',
    yacht: 'Катер к Coral Island — по запросу',
    yachtIds: ['f68'],
    excursion: 'Coral Island — по запросу',
    excursionIds: ['koral-mys-promtep-zakat'],
    excursionImages: [
      'assets/tours/koral-mys-promtep-zakat/images/photo-2.jpg',
      'assets/tours/koral-mys-promtep-zakat/images/photo-3.jpg',
      'assets/tours/koral-mys-promtep-zakat/images/photo-5.jpg',
      'assets/tours/koral-mys-promtep-zakat/images/photo-9.jpg',
      'assets/tours/koral-mys-promtep-zakat/images/photo-11.jpg',
      'assets/tours/koral-mys-promtep-zakat/images/photo-13.jpg'
    ],
    img: 'assets/houses/V-004/img_01.jpg',
    images: villaImages('V-004', 14),
    color: '#7AB8C8',
    included: [
      'Вилла Unique Villa Baan Bua (V-004) — 4 спальни, 4 ванные',
      'Собственный бассейн и охраняемый поселок Baan Bua',
      'Итальянская мебель, техника Smeg, стиральная машина Samsung',
      'Кухня с посудомойкой, духовкой и индукционной плитой',
      'Вода, интернет, обслуживание бассейна включены',
      'Ежедневная уборка включена',
      'Крытая парковка на территории',
      'Катер к Coral Island (Ko He) — по запросу',
      'Личный фотограф на морской день',
      'Трансфер аэропорт ↔ вилла ↔ пирс ↔ аэропорт'
    ],
    description: 'Минимальный ретрит на 5 ночей в закрытом поселке Baan Bua. Новая вилла с приватным бассейном + морской день на спидботе. Идеально для компании 6–8 человек.',
    description_en: 'Minimum 5-night retreat in gated Baan Bua. New villa with private pool + speedboat sea day. Ideal for 6–8 guests.',
    included_en: ['Unique Villa Baan Bua (V-004) — 4 bedrooms, 4 bathrooms', 'Private pool and gated Baan Bua community', 'Italian furniture, Smeg appliances, Samsung washer', 'Kitchen with dishwasher, oven and induction cooktop', 'Water, internet, pool maintenance included', 'Daily housekeeping included', 'Covered parking on site', 'Boat to Coral Island (Ko He) — on request', 'Personal photographer for sea day', 'Airport ↔ villa ↔ pier ↔ airport transfer']
  }
];

/* ---- DATA: FLEET ---- */
const expMap = {
  villa: 'Вилла', villa_en: 'Villa',
  yacht: 'Яхта', yacht_en: 'Yacht',
  bikes: 'Авто/Байки', bikes_en: 'Car/Bikes',
  retreat: 'Полный ретрит', retreat_en: 'Full Retreat',
  package: 'Пакет', package_en: 'Package'
};
const FLEET_DESC_EN = {
  speedboat: 'Private sea excursion in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi islands in comfort — snorkeling, fruits, drinks, GoPro, insurance.',
  motorboat: 'Private sea excursion in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi islands in comfort — snorkeling, fruits, drinks, GoPro, insurance.',
  catamaran: 'Private sea excursion in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi islands in comfort — snorkeling, fruits, drinks, GoPro, insurance.',
  yacht: 'Private sea excursion in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi islands in comfort — snorkeling, fruits, drinks, GoPro, insurance.',
  superyacht: 'Private sea excursion in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi islands in comfort — snorkeling, fruits, drinks, GoPro, insurance.'
};
const FLEET_VIBE_EN = { 'Катер': 'Speedboat', 'Суперяхта': 'Superyacht', 'Моторная яхта': 'Motor Yacht', 'Парусная яхта': 'Sailing Yacht', 'Парусный катамаран': 'Sailing Catamaran', 'Моторный катамаран': 'Motor Catamaran', 'Рыбацкая лодка': 'Fishing Boat' };
function fleetVibe(y) {
  if (window.i18n && window.i18n.lang === 'en' && y.vibe) return FLEET_VIBE_EN[y.vibe] || y.vibe;
  return y.vibe || '';
}
// 109 судов с фото из assets/ships/
const FLEET = [
  // --- Package-specific vessels (not shown in fleet catalog) ---
  {
    id: 'pkg-dolphin',
    name: 'Катамаран Dolphin 50ft',
    name_en: 'Catamaran Dolphin 50ft',
    type: 'catamaran',
    guests: 14,
    length: '50 ft',
    speed: '—',
    price: 0,
    priceLabel: 'входит в пакет',
    vibe: 'Моторный катамаран',
    vibe_en: 'Motor Catamaran',
    description: 'Приватный моторный катамаран Dolphin 50ft — эксклюзивно для гостей пакета Regent Bang Tao Escape. Маршрут Ко Пхи-Пхи + остров Майтон. 9 часов, снорклинг, пляжи, обед на борту. Стабильность и комфорт — никаких посторонних, только ваша группа.',
    description_en: 'Private motor catamaran Dolphin 50ft — exclusively for Regent Bang Tao Escape guests. Route: Koh Phi Phi + Maiton island. 9 hours, snorkeling, beaches, onboard lunch. Stability and comfort — no strangers, only your group.',
    img: 'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-1.jpg',
    images: [
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-1.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-3.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-9.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-11.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-13.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-15.jpg'
    ]
  },
  {
    id: 'pkg-lunik',
    name: 'Катамаран Lunik Floeth 48ft',
    name_en: 'Catamaran Lunik Floeth 48ft',
    type: 'catamaran',
    guests: 12,
    length: '48 ft',
    speed: '—',
    price: 0,
    priceLabel: 'входит в пакет',
    vibe: 'Моторный катамаран',
    vibe_en: 'Motor Catamaran',
    description: 'Приватный катамаран Lunik Floeth 48ft — эксклюзивно для гостей пакета Laguna Private Haven. Маршрут Koh Kai + Maiton. Профессиональный экипаж, прохладительные напитки, фрукты, каяк, рыбалка, плавучий бассейн, полотенца, страховка.',
    description_en: 'Private catamaran Lunik Floeth 48ft — exclusively for Laguna Private Haven guests. Route: Koh Kai + Maiton. Professional crew, soft drinks, fruits, kayak, fishing, floating pool, towels, insurance.',
    img: 'assets/tours/4-zhemchuzhiny-andamana/images/photo-2.jpg',
    images: [
      'assets/tours/4-zhemchuzhiny-andamana/images/photo-2.jpg',
      'assets/tours/4-zhemchuzhiny-andamana/images/photo-6.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-1.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-9.jpg',
      'assets/tours/pkhi-pkhi-bambu-kay-mayton-na-katamarane/images/photo-11.jpg'
    ]
  },
  { id: 'f1', name: 'Limpopo', type: 'speedboat', guests: 4, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private speedboat for island tours around Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motorboats/Limpopo/24831.jpg', images: ['assets/ships/motorboats/Limpopo/24831.jpg', 'assets/ships/motorboats/Limpopo/24833.jpg', 'assets/ships/motorboats/Limpopo/24836.jpg', 'assets/ships/motorboats/Limpopo/24837.jpg', 'assets/ships/motorboats/Limpopo/33697.jpg'] },
  { id: 'f2', name: 'Lucky Star', type: 'speedboat', guests: 6, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private speedboat for island tours around Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motorboats/Lucky Star/IMG_001.jpg', images: ['assets/ships/motorboats/Lucky Star/IMG_001.jpg', 'assets/ships/motorboats/Lucky Star/IMG_002.jpg', 'assets/ships/motorboats/Lucky Star/IMG_003.jpg', 'assets/ships/motorboats/Lucky Star/IMG_004.jpg', 'assets/ships/motorboats/Lucky Star/IMG_005.jpg'] },
  { id: 'f3', name: 'Madam Shadow 34ft', type: 'speedboat', guests: 6, length: '34 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Madam Shadow — крытый катер с тентом на всю открытую палубу: максимум тени, защита от ливня, комфорт без перегрева. 34 фута идеально подходят для небольших компаний, которые хотят провести день на воде без лобового солнца. До 8 гостей. Ближние острова, спокойный темп, снорклинг в нужном месте. Для семей с детьми или тех, кто предпочитает тень экшну.', description_en: 'Madam Shadow is a covered boat with a full-length canopy: maximum shade, rain protection, comfort without overheating. 34 feet is the right size for smaller groups who want a day on the water without direct sun exposure. Up to 8 guests. Nearby islands, relaxed pace, snorkelling at the right spot. Perfect for families with children or those who prefer shade over adrenaline.', img: 'assets/ships/motorboats/Madam Shadow 34ft/Copy of DJI_20250708145031_0001_D.jpg', images: ['assets/ships/motorboats/Madam Shadow 34ft/Copy of DJI_20250708145031_0001_D.jpg', 'assets/ships/motorboats/Madam Shadow 34ft/Copy of DJI_20250708145224_0015_D.jpg', 'assets/ships/motorboats/Madam Shadow 34ft/Copy of DJI_20250708145331_0030_D.jpg', 'assets/ships/motorboats/Madam Shadow 34ft/Copy of DJI_20250708145415_0039_D.jpg', 'assets/ships/motorboats/Madam Shadow 34ft/Copy of DJI_20250708145523_0048_D.jpg'] },
  { id: 'f4', name: 'Na-О 29ft', type: 'speedboat', guests: 6, length: '29 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Na-O — минималистичный открытый катер для тех, кому нужен выход на воду без лишнего. 29 футов, открытая палуба, мощный мотор. Ко Хе, Ко Лон, Ко Сире — берёт ближние направления за считанные минуты. До 8 гостей. Маленький, быстрый, маневренный — заходит в бухты, куда крупные лодки не суются. Идеально для половины дня или сессии снорклинга без длинных переходов.', description_en: 'Na-O is a minimalist open boat for those who need to get on the water without overhead. 29 feet, open deck, strong engine. Ko He, Ko Lon, Ko Sireh — near-range destinations in minutes. Up to 8 guests. Small, fast, nimble — it gets into bays where larger boats can\'t follow. Perfect for a half-day outing or a snorkelling session without long transits.', img: 'assets/ships/motorboats/Na-О 29ft/Copy of 1D2A4907.jpg', images: ['assets/ships/motorboats/Na-О 29ft/Copy of 1D2A4907.jpg', 'assets/ships/motorboats/Na-О 29ft/Copy of 1D2A4914.jpg', 'assets/ships/motorboats/Na-О 29ft/Copy of DJI_0204.jpg', 'assets/ships/motorboats/Na-О 29ft/Copy of DJI_0229.jpg', 'assets/ships/motorboats/Na-О 29ft/Copy of DJI_0308.jpg'] },
  { id: 'f5', name: 'Nanea 40ft', type: 'speedboat', guests: 8, length: '40 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Nanea — компактная моторная яхта, которая берёт лучшее от дня на воде: небольшой размер позволяет зайти туда, куда крупные яхты не заходят, а комфортный борт держит группу в нужном ритме. До 10 гостей. Маршруты ближнего пояса: Ко Хе, Ко Кай, Майтон — идеальные острова без перегона. Снорклинг, купание, рыбалка — всё на одном дне. Хорошая яхта для небольшой компании, которая хочет своё, а не с туристическим автобусом.', description_en: 'Nanea is a compact motor yacht that captures the best of a day on the water: small enough to access spots large yachts can\'t, comfortable enough to keep the group in the right rhythm throughout the day. Up to 10 guests. Near-range routes: Ko He, Ko Kai, Maiton — perfect islands without excessive transit. Snorkelling, swimming, fishing — all in a single day. The right yacht for a small group that wants their own experience, not a shared tour.', img: 'assets/ships/motorboats/Nanea 40ft/Copy of DJI_20240405170844_0106_D.jpg', images: ['assets/ships/motorboats/Nanea 40ft/Copy of DJI_20240405170844_0106_D.jpg', 'assets/ships/motorboats/Nanea 40ft/Copy of DJI_20240405170856_0107_D.jpg', 'assets/ships/motorboats/Nanea 40ft/Copy of DJI_20240405170925_0109_D.jpg', 'assets/ships/motorboats/Nanea 40ft/Copy of DJI_20240405170939_0110_D.jpg', 'assets/ships/motorboats/Nanea 40ft/Copy of DJI_20240405171009_0114_D.jpg'] },
  { id: 'f6', name: 'Ocean Safari 2', type: 'speedboat', guests: 16, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private speedboat for island tours around Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motorboats/Ocean Safari 2/20231206_081342.jpg', images: ['assets/ships/motorboats/Ocean Safari 2/20231206_081342.jpg', 'assets/ships/motorboats/Ocean Safari 2/20231206_081347.jpg', 'assets/ships/motorboats/Ocean Safari 2/20231206_103038.jpg', 'assets/ships/motorboats/Ocean Safari 2/20231207_071644.jpg'] },
  { id: 'f7', name: 'Ocean Safari 3', type: 'speedboat', guests: 6, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private speedboat for island tours around Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motorboats/Ocean Safari 3/20201206_142533.jpg', images: ['assets/ships/motorboats/Ocean Safari 3/20201206_142533.jpg', 'assets/ships/motorboats/Ocean Safari 3/20201206_142559.jpg', 'assets/ships/motorboats/Ocean Safari 3/20201210_171250.jpg', 'assets/ships/motorboats/Ocean Safari 3/20201210_171333.jpg', 'assets/ships/motorboats/Ocean Safari 3/20201210_171349.jpg'] },
  { id: 'f8', name: 'Sabi 375', type: 'speedboat', guests: 8, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Катер', vibe_en: 'Speedboat', description: 'SABI 375 — профессиональный рыболовный катер с открытой кормой, удобной посадкой и полным комплектом рыболовного снаряжения. Компактный, маневренный, идёт туда, куда не сунется 50-футовая яхта. До 6 гостей. Тролинг, джиггинг, донная рыбалка — капитан строит программу под уровень и задачу. Улов дня можно сдать на кухню виллы — консьерж организует.', description_en: 'SABI 375 is a professional fishing boat with an open stern, comfortable seating, and a full set of fishing gear. Compact, nimble, and goes where a 50-foot yacht simply can\'t. Up to 6 guests. Trolling, jigging, bottom fishing — the captain builds the programme around your level and goals. The day\'s catch can be sent to your villa kitchen — your concierge arranges it.', img: 'assets/ships/motorboats/Sabi 375/SABI-Raptor-38-1.jpg', images: ['assets/ships/motorboats/Sabi 375/SABI-Raptor-38-1.jpg', 'assets/ships/motorboats/Sabi 375/SABI-Raptor-38-2.jpg', 'assets/ships/motorboats/Sabi 375/SABI-Raptor-38-3.jpg', 'assets/ships/motorboats/Sabi 375/SABI-Raptor-38-4.jpg', 'assets/ships/motorboats/Sabi 375/SABI-RAPTOR-38-5.jpg'] },
  { id: 'f35', name: 'Beach Club Yona', type: 'superyacht', guests: 300, length: '—', speed: '7 кн', price: 2000000, priceLabel: 'от 2 000 000 ฿', vibe: 'Суперяхта', vibe_en: 'Superyacht', description: 'Beach Club Yona — это не яхта. Это отдельный остров с диджеем, баром и полным погружением в Андаманское море. 48 метров. 18 метров в ширину. Собственный пляжный клуб с лестницей прямо в воду. Широкая палуба вмещает до 300 гостей — корпоратив, свадьба, закрытая вечеринка. Звук, свет, шоу-программа — всё на борту. Экипаж работает как слаженная команда пятизвёздочного отеля. Семь часов в открытом море: вы выбираете маршрут, время, атмосферу. Снорклинг, гидроциклы, закат с диджеем в открытом океане — Beach Club Yona создаёт события, которые не повторяются.', description_en: 'Beach Club Yona is not a yacht. It\'s a private island with a DJ, a full bar, and direct access into the Andaman Sea. 48 metres long. 18 metres wide. Its own beach club staircase straight into the water. The expansive deck holds up to 300 guests — corporate events, weddings, exclusive parties. Sound, lighting, and entertainment are all onboard. The crew operates like a five-star hotel team. Seven hours on the open sea: you choose the route, the pace, the vibe. Snorkelling, jet skis, sunset DJ sessions in open water — Beach Club Yona creates moments that don\'t repeat.', img: 'assets/ships/motor-yachts/Beach Club Yona/Yona beach club 2.jpg', images: ['assets/ships/motor-yachts/Beach Club Yona/Yona beach club 2.jpg', 'assets/ships/motor-yachts/Beach Club Yona/Yona Beach club pool bed.jpg', 'assets/ships/motor-yachts/Beach Club Yona/Yona beach club sea bed.jpg', 'assets/ships/motor-yachts/Beach Club Yona/Yona bed and cabana.jpg', 'assets/ships/motor-yachts/Beach Club Yona/Yona Dj booth.jpg'] },
  { id: 'f37', name: 'Demarest', type: 'superyacht', guests: 20, length: '—', speed: '25 кн', price: 450000, priceLabel: 'от 450 000 ฿', vibe: 'Суперяхта', vibe_en: 'Superyacht', description: 'Яхта «Demarest» — идеальная комбинация стиля и функциональности. Современный дизайн, просторный интерьер, полный рефит 2019 года. Просторные каюты, полностью оборудованная кухня, салон с панорамными окнами. Профессиональный экипаж готов создать идеальное путешествие под ваши пожелания.', description_en: 'Yacht Demarest — ideal blend of style and function. Modern design, spacious interior, full 2019 refit. Spacious cabins, fully equipped galley, salon with panoramic windows. Professional crew ready to create the perfect voyage.', img: 'assets/ships/motor-yachts/Demarest/Demarest-01.jpg', images: ['assets/ships/motor-yachts/Demarest/Demarest-01.jpg', 'assets/ships/motor-yachts/Demarest/Demarest-02.jpg', 'assets/ships/motor-yachts/Demarest/Demarest-03.jpg', 'assets/ships/motor-yachts/Demarest/Demarest-04.jpg', 'assets/ships/motor-yachts/Demarest/Demarest-05.jpg'] },
  { id: 'f43', name: 'Monte Carlo 86ft', type: 'superyacht', guests: 20, length: '86 ft', speed: '15 кн', price: 390000, priceLabel: 'от 390 000 ฿', vibe: 'Суперяхта', vibe_en: 'Superyacht', description: 'Моторная суперяхта Monte Carlo 86ft — роскошь и простор. Профессиональный экипаж, все удобства для премиум-отдыха на воде.', description_en: 'Monte Carlo 86ft — luxury motor yacht for premium charters. Spacious cabins, gourmet dining, professional crew. Perfect for multi-day voyages or exclusive day trips.', img: 'assets/ships/motor-yachts/Monte Carlo 86ft/Bow_1.jpg', images: ['assets/ships/motor-yachts/Monte Carlo 86ft/Bow_1.jpg', 'assets/ships/motor-yachts/Monte Carlo 86ft/Bow_2.jpg', 'assets/ships/motor-yachts/Monte Carlo 86ft/Flybridge.jpg', 'assets/ships/motor-yachts/Monte Carlo 86ft/Guest 1.jpg', 'assets/ships/motor-yachts/Monte Carlo 86ft/Guest 2.jpg'] },
  { id: 'f44', name: 'Moon Glider 90', type: 'superyacht', guests: 18, length: '—', speed: '18 кн', price: 220000, priceLabel: 'от 220 000 ฿', vibe: 'Суперяхта', vibe_en: 'Superyacht', description: 'Моторная суперяхта Moon Glider 90ft — роскошь и простор. Профессиональный экипаж, все удобства для премиум-отдыха на воде.', description_en: 'Moon Glider 90 — majestic superyacht offering unrivaled luxury. Expansive deck spaces, elegant interiors, infinity pool. The ultimate Phuket sea experience.', img: 'assets/ships/motor-yachts/Moon Glider 90/0K9A1335.jpg', images: ['assets/ships/motor-yachts/Moon Glider 90/0K9A1335.jpg', 'assets/ships/motor-yachts/Moon Glider 90/0K9A1341.jpg', 'assets/ships/motor-yachts/Moon Glider 90/0K9A1344-Enhanced-NR.jpg', 'assets/ships/motor-yachts/Moon Glider 90/0K9A1390-Enhanced-NR.jpg', 'assets/ships/motor-yachts/Moon Glider 90/0K9A1399-Enhanced-NR.jpg'] },
  { id: 'f45', name: 'Olympia', type: 'superyacht', guests: 25, length: '—', speed: '60 кн', price: 170000, priceLabel: 'от 170 000 ฿', vibe: 'Суперяхта', vibe_en: 'Superyacht', description: 'Моторная суперяхта Olympia — роскошь и простор. Профессиональный экипаж, все удобства для премиум-отдыха.', description_en: 'Oceanco 130ft — ultra-luxury superyacht for the most exclusive charters. World-class amenities, stabilized hull for smooth sailing, professional full crew.', img: 'assets/ships/motor-yachts/Olympia/26ab4759-218c-4431-b383-7fc7259bc49d.jpg', images: ['assets/ships/motor-yachts/Olympia/26ab4759-218c-4431-b383-7fc7259bc49d.jpg', 'assets/ships/motor-yachts/Olympia/3ba85e29-9b0b-4e7c-8fd9-897e80f6eaa2.jpg', 'assets/ships/motor-yachts/Olympia/485c458d-0241-4177-8daa-e874ea6d7160.jpg', 'assets/ships/motor-yachts/Olympia/6406ae83-e6e7-4798-8014-9c956dc69a40.jpg', 'assets/ships/motor-yachts/Olympia/76a9fd20-2cc5-41a5-bb1a-5b05ce12a105.jpg'] },
  { id: 'f40', name: 'Lady M. Sunseeker 54ft', type: 'yacht', guests: 8, length: '54 ft', speed: '26 кн', price: 129000, priceLabel: 'от 129 000 ฿', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Моторная яхта Sunseeker 54ft — британская роскошь и комфорт. Просторный салон, flybridge, профессиональный экипаж. Идеальна для премиум-экскурсий по островам.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Lady M. Sunseeker 54ft/2S5A0037-Enhanced-NR.jpg', images: ['assets/ships/motor-yachts/Lady M. Sunseeker 54ft/2S5A0037-Enhanced-NR.jpg', 'assets/ships/motor-yachts/Lady M. Sunseeker 54ft/2S5A0047-Enhanced-NR.jpg', 'assets/ships/motor-yachts/Lady M. Sunseeker 54ft/2S5A0064-Enhanced-NR.jpg', 'assets/ships/motor-yachts/Lady M. Sunseeker 54ft/2S5A0070-Enhanced-NR.jpg', 'assets/ships/motor-yachts/Lady M. Sunseeker 54ft/2S5A0148.jpg'] },
  { id: 'f50', name: 'Princess 65 Oceana', type: 'yacht', guests: 20, length: '—', speed: '27 кн', price: 110000, priceLabel: 'от 110 000 ฿', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Моторная яхта Princess 65 Oceana — премиум-судно для морских экскурсий. Просторный салон, комфортные зоны отдыха, профессиональный экипаж. Идеальна для дня на островах Пхукета.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Princess 65 Oceana/0.jpg', images: ['assets/ships/motor-yachts/Princess 65 Oceana/0.jpg', 'assets/ships/motor-yachts/Princess 65 Oceana/01.jpg', 'assets/ships/motor-yachts/Princess 65 Oceana/02.jpg', 'assets/ships/motor-yachts/Princess 65 Oceana/1.jpg', 'assets/ships/motor-yachts/Princess 65 Oceana/2.jpg'] },
  { id: 'f65', name: 'The Origin', type: 'yacht', guests: 30, length: '—', speed: '—', price: 110000, priceLabel: 'от 110 000 ฿', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Моторная яхта The Origin — современный дизайн и комфорт. Профессиональный экипаж, все удобства для премиум-отдыха на воде.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/The Origin/7M_TheOrigin1.jpg', images: ['assets/ships/motor-yachts/The Origin/7M_TheOrigin1.jpg', 'assets/ships/motor-yachts/The Origin/7M_TheOrigin11.jpg', 'assets/ships/motor-yachts/The Origin/7M_TheOrigin2.jpg', 'assets/ships/motor-yachts/The Origin/7M_TheOrigin5.jpg', 'assets/ships/motor-yachts/The Origin/7M_TheOrigin7.jpg'] },
  { id: 'f38', name: 'Ferretti 80', type: 'yacht', guests: 30, length: '—', speed: '—', price: 105000, priceLabel: 'от 105 000 ฿', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Яхта Ferretti 80 — уникальный опыт от итальянской Ferretti Group. Роскошный салон с кожей и деревянными отделками. Капитан и экипаж с богатым опытом. Идеальна для романтических встреч, семейных круизов и корпоративных мероприятий.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Ferretti 80/_5R_3737 copy.jpg', images: ['assets/ships/motor-yachts/Ferretti 80/_5R_3737 copy.jpg', 'assets/ships/motor-yachts/Ferretti 80/_5R_3740 copy.jpg', 'assets/ships/motor-yachts/Ferretti 80/_5R_3743 copy.jpg', 'assets/ships/motor-yachts/Ferretti 80/_5R_3746 copy.jpg', 'assets/ships/motor-yachts/Ferretti 80/_5R_3758 copy.jpg'] },
  { id: 'f57', name: 'Rizzardi', type: 'yacht', guests: 30, length: '—', speed: '18 кн', price: 105000, priceLabel: 'от 105 000 ฿', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Posillipo-Rizzardi Technema 89 — одна из самых узнаваемых итальянских моторных яхт своего времени. Классические формы итальянского яхтостроения, три палубы, пять кают. До 20 гостей на день — и вся яхта принадлежит только им. Пхи-Пхи, Пханг Нга, Краби — маршруты для яхты, которая делает их событием. Ужин на корме, закат с флайбриджа, якорная стоянка в закрытой бухте — это то, ради чего.', description_en: 'Posillipo-Rizzardi Technema 89 is one of the most recognisable Italian motor yachts of its era. Classic Italian boatbuilding lines, three decks, five cabins. Up to 20 guests per day — and the entire yacht belongs only to them. Phi Phi, Phang Nga, Krabi — routes that become events on a yacht like this. Dinner on the stern, sunset from the flybridge, anchored in a sheltered bay — this is what it\'s for.', img: 'assets/ships/motor-yachts/Rizzardi/1.jpg', images: ['assets/ships/motor-yachts/Rizzardi/1.jpg', 'assets/ships/motor-yachts/Rizzardi/2.jpg', 'assets/ships/motor-yachts/Rizzardi/3.jpg', 'assets/ships/motor-yachts/Rizzardi/4.jpg', 'assets/ships/motor-yachts/Rizzardi/5.jpg'] },
  { id: 'f106', name: 'Born Free 86ft', type: 'yacht', guests: 16, length: '86 ft', speed: '10 кн', price: 99000, priceLabel: 'от 99 000 ฿', vibe: 'Парусная яхта', vibe_en: 'Sailing Yacht', description: 'Born Free 86 ft — парусная яхта с впечатляющими размерами: 26 метров, три каюты, деревянная отделка, кондиционированный салон, дорогая аудиосистема. Команда стюардесс. До 16 гостей на день. Лучшее предложение по размеру парусного судна для дневного чартера на Пхукете. Просторный интерьер в нейтральных тонах, удобное зонирование — яхта, на которой хочется провести больше одного дня. Ко Рача, Майтон, Ко Кай — маршруты под ветер. Тихо, неторопливо, полный релакс.', description_en: 'Born Free 86 ft is a sailing yacht with impressive scale: 26 metres, three cabins, quality teak finish, air-conditioned saloon, high-end audio system. Stewardess crew. Up to 16 guests per day. The best sail-size-to-price on day charter in Phuket. Spacious neutral-toned interior, well-planned layout — a yacht you\'ll want to spend more than one day on. Ko Racha, Maiton, Ko Kai — wind-dependent routes. Quiet, unhurried, total relaxation.', img: 'assets/ships/sailing-yachts/Born Free 86ft/2021-12-13 14.32.09.jpg', images: ['assets/ships/sailing-yachts/Born Free 86ft/2021-12-13 14.32.09.jpg', 'assets/ships/sailing-yachts/Born Free 86ft/2021-12-13 14.32.22.jpg', 'assets/ships/sailing-yachts/Born Free 86ft/2021-12-13 14.32.27.jpg', 'assets/ships/sailing-yachts/Born Free 86ft/2021-12-13 14.32.31.jpg', 'assets/ships/sailing-yachts/Born Free 86ft/2021-12-13 14.32.37.jpg'] },
  { id: 'f46', name: 'Orange Princess 54', type: 'yacht', guests: 12, length: '—', speed: '15 кн', price: 80000, priceLabel: 'от 80 000 ฿', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Моторная яхта Orange Princess 54 — роскошь и комфорт. Просторный салон, flybridge. Идеальна для премиум-экскурсий.', description_en: 'Pershing 72 — high-performance motor yacht. Sleek Italian design, powerful engines, panoramic windows. Ideal for fast, stylish island-hopping.', img: 'assets/ships/motor-yachts/Orange Princess 54/1667557917066.jpg', images: ['assets/ships/motor-yachts/Orange Princess 54/1667557917066.jpg', 'assets/ships/motor-yachts/Orange Princess 54/1667557917673.jpg', 'assets/ships/motor-yachts/Orange Princess 54/1667557918267.jpg', 'assets/ships/motor-yachts/Orange Princess 54/1667557918820.jpg', 'assets/ships/motor-yachts/Orange Princess 54/1667557920539.jpg'] },
  { id: 'f62', name: 'Siam Princess 70', type: 'yacht', guests: 50, length: '—', speed: '9 кн', price: 69000, priceLabel: 'от 69 000 ฿', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Siam Princess — 70-футовая моторная яхта с уникальным тайским характером. Традиционные деревянные элементы, широкие палубы, большой флайбридж. Четыре каюты, до 20 гостей на день. Медленный, степенный ход — выйти на острова и смотреть, как закат красит воду. Пханг Нга — лучший маршрут для Siam Princess. Скалы, лагуны, пещеры — этот пейзаж требует именно такого темпа.', description_en: 'Siam Princess is a 70-foot motor yacht with a distinctly Thai character. Traditional teak elements, wide decks, generous flybridge. Four cabins, up to 20 guests per day. A slow, measured pace — head to the islands and watch the sunset paint the water. Phang Nga is Siam Princess\'s best route. Karst cliffs, lagoons, caves — this landscape demands exactly this tempo.', img: 'assets/ships/motor-yachts/Siam Princess 70/01.jpg', images: ['assets/ships/motor-yachts/Siam Princess 70/01.jpg', 'assets/ships/motor-yachts/Siam Princess 70/02.jpg', 'assets/ships/motor-yachts/Siam Princess 70/03.jpg', 'assets/ships/motor-yachts/Siam Princess 70/04.jpg', 'assets/ships/motor-yachts/Siam Princess 70/05.jpg'] },
  { id: 'f93', name: 'Pina Colada 40ft', type: 'catamaran', guests: 14, length: '40 ft', speed: '7 кн', price: 65000, priceLabel: 'от 65 000 ฿', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Парусный катамаран Pina Colada 40ft — идеальный способ открыть красоту Андаманского моря. Просторные каюты, уютные зоны отдыха. Высокая стабильность и маневренность. Идеален для семей, друзей или романтических прогулок. Исследуйте Ко Пхи-Пхи, Ко Рача, Ко Кай.', description_en: 'Sailing catamaran Pina Colada 40ft — ideal way to discover the Andaman Sea. Spacious cabins, cozy lounges. High stability and maneuverability. Perfect for families, friends or romantic cruises. Explore Phi Phi, Racha, Kai.', img: 'assets/ships/sailing-catamarans/Pina Colada 40ft/0A1.jpg', images: ['assets/ships/sailing-catamarans/Pina Colada 40ft/0A1.jpg', 'assets/ships/sailing-catamarans/Pina Colada 40ft/0A2.jpg', 'assets/ships/sailing-catamarans/Pina Colada 40ft/0A3.jpg', 'assets/ships/sailing-catamarans/Pina Colada 40ft/0A4.jpg', 'assets/ships/sailing-catamarans/Pina Colada 40ft/0A5.jpg'] },
  { id: 'f59', name: 'Sambuca 53', type: 'yacht', guests: 25, length: '—', speed: '15 кн', price: 55000, priceLabel: 'от 55 000 ฿', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Sambuca — моторная яхта итальянского происхождения с надёжным корпусом и просторной открытой кормой. Три каюты, флайбридж, кондиционированный салон. До 15 гостей на день — в комфорте и без тесноты. Классические маршруты: Пхи-Пхи, Ко Кай, Пханг Нга. Sambuca обеспечивает устойчивый ход и удобную посадку. Хороший выбор для тех, кому нужна проверенная яхта среднего класса.', description_en: 'Sambuca is an Italian-built motor yacht with a solid hull and a spacious open stern. Three cabins, flybridge, air-conditioned saloon. Up to 15 guests per day — in comfort, without crowding. Classic routes: Phi Phi, Ko Kai, Phang Nga. Sambuca delivers steady handling and a comfortable ride. The right pick for those who need a proven mid-range yacht.', img: 'assets/ships/motor-yachts/Sambuca 53/a05.jpg', images: ['assets/ships/motor-yachts/Sambuca 53/a05.jpg', 'assets/ships/motor-yachts/Sambuca 53/WhatsApp Imagde 2022-10-18 at 10.39.01.jpg', 'assets/ships/motor-yachts/Sambuca 53/WhatsApp Image 202ww2-10-18 at 10.39.06.jpg', 'assets/ships/motor-yachts/Sambuca 53/WhatsApp Image 20e22-10-18 at 10.39.01.jpg', 'assets/ships/motor-yachts/Sambuca 53/WhatsApp Image 2w022-10-18 at 10.39.04.jpg'] },
  { id: 'f27', name: 'SeaExplorer', type: 'catamaran', guests: 24, length: '—', speed: '27 кн', price: 55000, priceLabel: 'от 55 000 ฿', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Моторный катамаран SeaExplorer — просторный и стабильный. Два корпуса обеспечивают комфорт. Идеален для экскурсий по островам Пхукета.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/SeaExplorer/WhatsApp Image 2022-10-12 at 11.30.49.jpg', images: ['assets/ships/motor-catamarans/SeaExplorer/WhatsApp Image 2022-10-12 at 11.30.49.jpg', 'assets/ships/motor-catamarans/SeaExplorer/WhatsApp Image 2022-10-12 at 11.30.50.jpg', 'assets/ships/motor-catamarans/SeaExplorer/WhatsApp Image 2022-10-12 at 1w1.30.51.jpg', 'assets/ships/motor-catamarans/SeaExplorer/WhatsApp Image 2022-10-12 at 1w1.30.52.jpg', 'assets/ships/motor-catamarans/SeaExplorer/WhatsApp Image 20d22-10-12 at 11.30.54.jpg'] },
  { id: 'f97', name: 'Summer Leopard 47', type: 'catamaran', guests: 10, length: '—', speed: '—', price: 55000, priceLabel: 'от 55 000 ฿', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Парусный катамаран Leopard 47 — стабильность и простор. Просторные каюты, комфортная палуба. Идеален для дня под парусами.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Summer Leopard 47/7M_Summer_2.jpg', images: ['assets/ships/sailing-catamarans/Summer Leopard 47/7M_Summer_2.jpg', 'assets/ships/sailing-catamarans/Summer Leopard 47/7M_Summer_3.jpg', 'assets/ships/sailing-catamarans/Summer Leopard 47/7M_Summer_4.jpg', 'assets/ships/sailing-catamarans/Summer Leopard 47/7M_Summer_5.jpg', 'assets/ships/sailing-catamarans/Summer Leopard 47/7M_Summer_7.jpg'] },
  { id: 'f36', name: 'Bertram 50', type: 'yacht', guests: 10, length: '—', speed: '15 кн', price: 53000, priceLabel: 'от 53 000 ฿', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Bertram — американская легенда среди моторных яхт. 50 футов глубокого V-образного корпуса: режет волну там, где другие замедляются. Три каюты, просторный кокпит, стабильность в открытом океане. До 15 гостей на день. Открытый океан, рыбалка на большой воде, дальние маршруты — Bertram 50ft создан именно для этого. Ко Рача Яй, открытый горизонт — на борту Bertram это ощущается по-другому.', description_en: 'Bertram is an American legend among motor yachts. 50 feet of deep-V hull: cuts through the chop where others slow down. Three cabins, spacious cockpit, offshore stability. Up to 15 guests per day. Open ocean, offshore fishing, long-range routes — Bertram 50ft is built precisely for this. Ko Racha Yai, open horizon — it feels different on a Bertram.', img: 'assets/ships/motor-yachts/Bertram 50/2ea10d51-08eb-4922-96c5-8f811e9c9455.jpg', images: ['assets/ships/motor-yachts/Bertram 50/2ea10d51-08eb-4922-96c5-8f811e9c9455.jpg', 'assets/ships/motor-yachts/Bertram 50/WhatsApp Image 2022-11-016 at 17.47.45.jpg', 'assets/ships/motor-yachts/Bertram 50/WhatsApp Image 2022-11-16 at 17.47.44.jpg', 'assets/ships/motor-yachts/Bertram 50/WhatsApp Image 2022-11-1о6 at 17.47.47.jpg', 'assets/ships/motor-yachts/Bertram 50/WhatsApp Image 2022-1в1-16 at 17.47.47.jpg'] },
  { id: 'f10', name: 'Marlin', type: 'motorboat', guests: 15, length: '—', speed: '16 кн', price: 39000, priceLabel: 'от 39 000 ฿', vibe: 'Рыбацкая лодка', vibe_en: 'Fishing Boat', description: 'Рыбацкая лодка Marlin — для морской рыбалки на Пхукете. Опытный экипаж, троллинговая рыбалка. Из пойманного тунца приготовят сашими, организуют барбекю на острове.', description_en: 'Fishing boat Marlin — for sea fishing in Phuket. Experienced crew, trolling. Fresh tuna into sashimi, island BBQ arranged.', img: 'assets/ships/fishing-boats/Marlin/03-1.jpg', images: ['assets/ships/fishing-boats/Marlin/03-1.jpg', 'assets/ships/fishing-boats/Marlin/20230714_100700.jpg', 'assets/ships/fishing-boats/Marlin/20230806_125808.jpg', 'assets/ships/fishing-boats/Marlin/20230807_130858.jpg', 'assets/ships/fishing-boats/Marlin/242816.jpg'] },
  { id: 'f68', name: 'Srisuwan 37ft', type: 'speedboat', guests: 10, length: '37 ft', speed: '45 кн', price: 38000, priceLabel: 'от 38 000 ฿', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Srisuwan — моторная яхта тайской классики, которая знает воды Андаманского моря лучше, чем большинство новых катеров. Надёжная, вместительная, с открытой палубой и тенью — всё что нужно для полного дня на воде. До 12 человек. Ко Хе, Ко Кай, Майтон — достижимы без компромиссов. Капитан ведёт маршрут, команда следит за комфортом, вы занимаетесь только отдыхом. Охлаждённые напитки, снорклинг, полотенца — на борту. Трансфер из отеля — включён. Никаких доплат на воде.', description_en: 'Srisuwan is a Thai motor yacht that knows the Andaman waters better than most newer boats on the market. Reliable, roomy, with an open deck and shade — everything you need for a full day at sea. Up to 12 guests. Ko He, Ko Kai, Maiton — all reachable without compromise. The captain handles the route, the crew handles comfort, you handle the rest. Chilled drinks, snorkelling gear, towels — onboard. Hotel transfer — included. No extra charges once you\'re on the water.', img: 'assets/ships/motorboats/Srisuwan 37ft/2022-11-10 12.11.03.jpg', images: ['assets/ships/motorboats/Srisuwan 37ft/2022-11-10 12.11.03.jpg', 'assets/ships/motorboats/Srisuwan 37ft/2022-11-10 12.11.08.jpg', 'assets/ships/motorboats/Srisuwan 37ft/2022-11-10 12.11.14.jpg', 'assets/ships/motorboats/Srisuwan 37ft/3a02f70c-88d2-469d-aa7f-8215e1ca422e.jpg', 'assets/ships/motorboats/Srisuwan 37ft/59B5248B-C95E-493F-86FE-2B4F8F93AD9F_4_5005_c.jpg'] },
  { id: 'f86', name: 'Lagoon 440 Bluewings', type: 'catamaran', guests: 25, length: '—', speed: '12 кн', price: 30000, priceLabel: 'от 30 000 ฿', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Парусный катамаран Lagoon 440 — просторный и стабильный. Профессиональный экипаж, все удобства для комфортного отдыха на воде.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Lagoon 440 Bluewings/1593770840982.jpg', images: ['assets/ships/sailing-catamarans/Lagoon 440 Bluewings/1593770840982.jpg', 'assets/ships/sailing-catamarans/Lagoon 440 Bluewings/1593770850556.jpg', 'assets/ships/sailing-catamarans/Lagoon 440 Bluewings/1593770859670.jpg', 'assets/ships/sailing-catamarans/Lagoon 440 Bluewings/1593770862900.jpg', 'assets/ships/sailing-catamarans/Lagoon 440 Bluewings/1593770925281.jpg'] },
  { id: 'f73', name: 'Ameray 1 37ft', type: 'catamaran', guests: 25, length: '37 ft', speed: '—', price: 26000, priceLabel: 'от 26 000 ฿', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Парусный катамаран Ameray 1 37ft — компактный и манёвренный. Классический парусный опыт с комфортом катамарана. Подходит для небольших групп.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Ameray 1 37ft/WhatsApp Image 2567-01-19 at 15.40.24 (1).jpg', images: ['assets/ships/sailing-catamarans/Ameray 1 37ft/WhatsApp Image 2567-01-19 at 15.40.24 (1).jpg', 'assets/ships/sailing-catamarans/Ameray 1 37ft/WhatsApp Image 2567-01-19 at 15.40.24 (2).jpg', 'assets/ships/sailing-catamarans/Ameray 1 37ft/WhatsApp Image 2567-01-19 at 15.40.24 (3).jpg', 'assets/ships/sailing-catamarans/Ameray 1 37ft/WhatsApp Image 2567-01-19 at 15.40.24 (4).jpg', 'assets/ships/sailing-catamarans/Ameray 1 37ft/WhatsApp Image 2567-01-19 at 15.40.24 (5).jpg'] },
  { id: 'f70', name: 'Wave 29 Pro Datto', type: 'speedboat', guests: 15, length: '—', speed: '35 кн', price: 14000, priceLabel: 'от 14 000 ฿', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Спидбот для морских прогулок по островам Пхукета. Компактный и манёвренный — идеален для небольшой компании.', description_en: 'Private speedboat for island tours around Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motorboats/Wave 29 Pro Datto/3355116f-3a2e-4d0e-8629-d393aa79dd06.jpg', images: ['assets/ships/motorboats/Wave 29 Pro Datto/3355116f-3a2e-4d0e-8629-d393aa79dd06.jpg', 'assets/ships/motorboats/Wave 29 Pro Datto/4228f398-d068-4311-b8b0-d1f0362c6aa8.jpg', 'assets/ships/motorboats/Wave 29 Pro Datto/575638dd-dd83-4954-8cea-a3ed179d1d1c.jpg', 'assets/ships/motorboats/Wave 29 Pro Datto/9a542c90-4a6b-4e37-80b5-91f3181ef2f6.jpg', 'assets/ships/motorboats/Wave 29 Pro Datto/cf42b5aa-5256-4d12-9196-7ce807ad2e47.jpg'] },
  { id: 'f71', name: 'Yamela 15', type: 'speedboat', guests: 10, length: '—', speed: '30 кн', price: 12990, priceLabel: 'от 12 990 ฿', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Yamela — спидбот для тех, кто не хочет ждать. Три двигателя Honda 250. До 12 человек на борту. Пи-Пи, Майтон, Ко Кай — закрытый пункт за пару часов, а не полдня. Компактный, быстрый, маневренный. Правый борт — мягкие диваны для релакса. Левый — капитан и курс на ваш остров. Весь флайбридж под открытым небом. Снорклинг-оборудование и охлаждённые напитки — на борту. Трансфер из отеля — включён. Один звонок консьержу — остальное не ваша забота.', description_en: 'Yamela is a speedboat for those who don\'t like to wait. Three Honda 250 engines. Up to 12 guests onboard. Phi Phi, Maiton, Ko Kai — checked off in hours, not a full day. Compact, fast, agile. Soft loungers on the right. Captain on the left, heading straight for your island. The entire flybridge is open sky. Snorkelling gear and chilled drinks are onboard. Hotel transfer is included. One call to your concierge — everything else is handled.', img: 'assets/ships/motorboats/Yamela 15/DJI_0006.jpg', images: ['assets/ships/motorboats/Yamela 15/DJI_0006.jpg', 'assets/ships/motorboats/Yamela 15/DJI_0024h.jpg', 'assets/ships/motorboats/Yamela 15/DJI_0029e.jpg', 'assets/ships/motorboats/Yamela 15/DJI_0033h.jpg', 'assets/ships/motorboats/Yamela 15/DJI_0033hh.jpg'] },
  { id: 'f72', name: 'Admiral 40ft', type: 'catamaran', guests: 10, length: '40 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Admiral 40ft/000 𝐒𝐩𝐞𝐜𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧𝐬.jpg', images: ['assets/ships/sailing-catamarans/Admiral 40ft/000 𝐒𝐩𝐞𝐜𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧𝐬.jpg', 'assets/ships/sailing-catamarans/Admiral 40ft/00001.jpg', 'assets/ships/sailing-catamarans/Admiral 40ft/001.jpg', 'assets/ships/sailing-catamarans/Admiral 40ft/002.jpg', 'assets/ships/sailing-catamarans/Admiral 40ft/003.jpg'] },
  { id: 'f74', name: 'Ameray 888 39ft', type: 'catamaran', guests: 25, length: '39 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Ameray 888 39ft/WhatsApp Image 2567-01-19 at 15.43.51 (1).jpg', images: ['assets/ships/sailing-catamarans/Ameray 888 39ft/WhatsApp Image 2567-01-19 at 15.43.51 (1).jpg', 'assets/ships/sailing-catamarans/Ameray 888 39ft/WhatsApp Image 2567-01-19 at 15.43.51 (2).jpg', 'assets/ships/sailing-catamarans/Ameray 888 39ft/WhatsApp Image 2567-01-19 at 15.43.51 (3).jpg', 'assets/ships/sailing-catamarans/Ameray 888 39ft/WhatsApp Image 2567-01-19 at 15.43.51 (4).jpg', 'assets/ships/sailing-catamarans/Ameray 888 39ft/WhatsApp Image 2567-01-19 at 15.43.51 (5).jpg'] },
  { id: 'f75', name: 'Asrtea 42ft', type: 'catamaran', guests: 12, length: '42 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Asrtea 42ft/img_Asrtea_42ft_01.jpg', images: ['assets/ships/sailing-catamarans/Asrtea 42ft/img_Asrtea_42ft_01.jpg', 'assets/ships/sailing-catamarans/Asrtea 42ft/img_Asrtea_42ft_02.jpg', 'assets/ships/sailing-catamarans/Asrtea 42ft/img_Asrtea_42ft_03.jpg', 'assets/ships/sailing-catamarans/Asrtea 42ft/img_Asrtea_42ft_04.jpg', 'assets/ships/sailing-catamarans/Asrtea 42ft/img_Asrtea_42ft_05.jpg'] },
  { id: 'f30', name: 'Azimut 46ft', type: 'yacht', guests: 10, length: '46 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Azimut 46ft — младший брат Azimut 60 с той же итальянской эстетикой и прямым характером. 46 футов, две каюты, открытая корма, приличная скорость. Для компании до 10 человек — правильный выбор без переплаты. Ко Рача, Ко Кай, Ко Хе — маршруты ближнего пояса проходятся уверенно. Флайбридж с открытым видом, кондиционированный салон, камбуз. Что нужно — есть. Чего не нужно — нет.', description_en: 'Azimut 46ft is the younger sibling of the Azimut 60 — same Italian aesthetics, same direct character. 46 feet, two cabins, open stern, solid speed. For a group of up to 10 — the right call without overspending. Ko Racha, Ko Kai, Ko He — near-range routes covered with confidence. Open-view flybridge, air-conditioned saloon, full galley. What\'s needed is there. What isn\'t needed, isn\'t.', img: 'assets/ships/motor-yachts/Azimut 46ft/00.jpg', images: ['assets/ships/motor-yachts/Azimut 46ft/00.jpg', 'assets/ships/motor-yachts/Azimut 46ft/01.jpg', 'assets/ships/motor-yachts/Azimut 46ft/02.jpg', 'assets/ships/motor-yachts/Azimut 46ft/03.jpg', 'assets/ships/motor-yachts/Azimut 46ft/04.jpg'] },
  { id: 'f31', name: 'Azimut 50', type: 'yacht', guests: 11, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Azimut 50/Azimut-50-FT-1-1024x576.jpg', images: ['assets/ships/motor-yachts/Azimut 50/Azimut-50-FT-1-1024x576.jpg', 'assets/ships/motor-yachts/Azimut 50/Azimut-50-FT-2-1024x576.jpg', 'assets/ships/motor-yachts/Azimut 50/Azimut-50-FT-3-1024x576-2.jpg', 'assets/ships/motor-yachts/Azimut 50/Azimut-50-FT-3-1024x576.jpg', 'assets/ships/motor-yachts/Azimut 50/Azimut-50-FT-4-1024x576.jpg'] },
  { id: 'f32', name: 'Azimut 55E After', type: 'yacht', guests: 15, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Azimut 55E After/5414984_20151012204412416_1_XLARGE.jpg', images: ['assets/ships/motor-yachts/Azimut 55E After/5414984_20151012204412416_1_XLARGE.jpg', 'assets/ships/motor-yachts/Azimut 55E After/5414984_20170719232242612_1_XLARGE.jpg', 'assets/ships/motor-yachts/Azimut 55E After/5414984_20170719232244816_1_XLARGE.jpg', 'assets/ships/motor-yachts/Azimut 55E After/5414984_20170719232247137_1_XLARGE.jpg', 'assets/ships/motor-yachts/Azimut 55E After/5414984_20170719232248818_1_XLARGE.jpg'] },
  { id: 'f33', name: 'Azimut 60ft', type: 'yacht', guests: 12, length: '60 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Azimut 60ft — это имя, которое не требует представления. Итальянская верфь Azimut — синоним дизайна, который работает. 60 футов, три палубы, агрессивный нос, три каюты на ночёвку. До 12 гостей. 28 узлов крейсерского хода — Пхи-Пхи за час, Пханг Нга за полтора. Интерьер от итальянских дизайнеров, кондиционирование, полноценная кухня, большая кормовая платформа. Аренда Azimut 60ft — это не просто яхта. Это заявление о том, с каким вкусом вы проводите время.', description_en: 'Azimut 60ft is a name that needs no introduction. Italian yard Azimut means design that delivers. 60 feet, three decks, aggressive bow, three overnight cabins. Up to 12 guests. 28 knots cruising — Phi Phi in an hour, Phang Nga in ninety minutes. Italian-designed interior, air conditioning, full galley, large swim platform. Chartering an Azimut 60ft isn\'t just a day on the water. It\'s a statement about how you spend your time.', img: 'assets/ships/motor-yachts/Azimut 60ft/Azimut 60 1.jpg', images: ['assets/ships/motor-yachts/Azimut 60ft/Azimut 60 1.jpg', 'assets/ships/motor-yachts/Azimut 60ft/Azimut 60 2.jpg', 'assets/ships/motor-yachts/Azimut 60ft/Azimut 60 3.jpg', 'assets/ships/motor-yachts/Azimut 60ft/Azimut 60 4.jpg', 'assets/ships/motor-yachts/Azimut 60ft/Azimut 60 5-1.jpg'] },
  { id: 'f34', name: 'Azimut 68ft', type: 'yacht', guests: 10, length: '68 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Azimut 68ft/1Hl6pMajycKHDC5E7xfOGdAtx6lIFGcO.big.jpg', images: ['assets/ships/motor-yachts/Azimut 68ft/1Hl6pMajycKHDC5E7xfOGdAtx6lIFGcO.big.jpg', 'assets/ships/motor-yachts/Azimut 68ft/9eW2qvOCxcuL7XiwXrTcOTvggVlesmK9.big.jpg', 'assets/ships/motor-yachts/Azimut 68ft/ataRcZPpJXrIfdGVCQGizIMBXGC2jVhd.big.jpg', 'assets/ships/motor-yachts/Azimut 68ft/BPVmKNDX1Q62Hv6ZhRgActiTLt1qcBht.big.jpg', 'assets/ships/motor-yachts/Azimut 68ft/CjVo5gUhkt7aENY2A1dAbJ7c1gdSTBAB.big.jpg'] },
  { id: 'f104', name: 'Bavaria 41ft Isabella', type: 'yacht', guests: 8, length: '41 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусная яхта', vibe_en: 'Sailing Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-yachts/Bavaria 41ft Isabella/293593093.jpg', images: ['assets/ships/sailing-yachts/Bavaria 41ft Isabella/293593093.jpg', 'assets/ships/sailing-yachts/Bavaria 41ft Isabella/631683826739_.pic_hd.jpg', 'assets/ships/sailing-yachts/Bavaria 41ft Isabella/Bavaria_46_SORTIE_35-1920x1080.jpg', 'assets/ships/sailing-yachts/Bavaria 41ft Isabella/Bavaria_46_SORTIE_36-1920x1080.jpg', 'assets/ships/sailing-yachts/Bavaria 41ft Isabella/Bavaria_46_SORTIE_38-1920x1080.jpg'] },
  { id: 'f105', name: 'Bavaria 46 Isabella', type: 'yacht', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусная яхта', vibe_en: 'Sailing Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-yachts/Bavaria 46 Isabella/293593093.jpg', images: ['assets/ships/sailing-yachts/Bavaria 46 Isabella/293593093.jpg', 'assets/ships/sailing-yachts/Bavaria 46 Isabella/631683826739_.pic_hd.jpg', 'assets/ships/sailing-yachts/Bavaria 46 Isabella/Bavaria_46_SORTIE_35-1920x1080.jpg', 'assets/ships/sailing-yachts/Bavaria 46 Isabella/Bavaria_46_SORTIE_36-1920x1080.jpg', 'assets/ships/sailing-yachts/Bavaria 46 Isabella/Bavaria_46_SORTIE_38-1920x1080.jpg'] },
  { id: 'f76', name: 'Blue Aqua', type: 'catamaran', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Blue Aqua/2022-10-24 20.27.22.jpg', images: ['assets/ships/sailing-catamarans/Blue Aqua/2022-10-24 20.27.22.jpg', 'assets/ships/sailing-catamarans/Blue Aqua/2022-10-24 20.27.34.jpg', 'assets/ships/sailing-catamarans/Blue Aqua/2022-10-24 20.27.42.jpg', 'assets/ships/sailing-catamarans/Blue Aqua/2022-10-24 20.27.46.jpg', 'assets/ships/sailing-catamarans/Blue Aqua/2022-10-24 20.27.51.jpg'] },
  { id: 'f77', name: 'Blue Indigo Catana 47', type: 'catamaran', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Blue Indigo Catana 47/7M_(LG)_BLUE_INDIGO_1.jpg', images: ['assets/ships/sailing-catamarans/Blue Indigo Catana 47/7M_(LG)_BLUE_INDIGO_1.jpg', 'assets/ships/sailing-catamarans/Blue Indigo Catana 47/7M_(LG)_BLUE_INDIGO_2.jpg', 'assets/ships/sailing-catamarans/Blue Indigo Catana 47/7M_(LG)_BLUE_INDIGO_3.jpg', 'assets/ships/sailing-catamarans/Blue Indigo Catana 47/7M_(LG)_BLUE_INDIGO_4.jpg', 'assets/ships/sailing-catamarans/Blue Indigo Catana 47/7M_(LG)_BLUE_INDIGO_5.jpg'] },
  { id: 'f78', name: 'Blue Metis Lagoon 500', type: 'catamaran', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Blue Lagoon 42ft — современный парусный катамаран с элегантным дизайном, отличной маневренностью и максимальной скоростью для своего класса. Просторная палуба, полноценная кухня, уютные каюты — катамаран для тех, кто хочет парус без аскетизма. До 28 гостей днём, 4 на ночёвку. Ко Хе, Майтон, Ко Рача, Ко Пхи-Пхи — Blue Lagoon легко меняет маршрут под погоду и желания. Снорклинг, купание, якорная стоянка в закрытой бухте — программа строится прямо на воде.', description_en: 'Blue Lagoon 42ft is a modern sailing catamaran with elegant design, excellent manoeuvrability, and maximum speed for its class. Spacious deck, full galley, comfortable cabins — a catamaran for those who want sailing without the austerity. Up to 28 guests per day, 4 overnight. Ko He, Maiton, Ko Racha, Ko Phi Phi — Blue Lagoon shifts routes easily with the weather and your wishes. Snorkelling, swimming, anchoring in a sheltered bay — the programme builds itself on the water.', img: 'assets/ships/sailing-catamarans/Blue Metis Lagoon 500/DJI_0001.jpg', images: ['assets/ships/sailing-catamarans/Blue Metis Lagoon 500/DJI_0001.jpg', 'assets/ships/sailing-catamarans/Blue Metis Lagoon 500/DJI_0003.jpg', 'assets/ships/sailing-catamarans/Blue Metis Lagoon 500/FB_IMG_1593059638523.jpg', 'assets/ships/sailing-catamarans/Blue Metis Lagoon 500/IMG_8434-HDR.jpg', 'assets/ships/sailing-catamarans/Blue Metis Lagoon 500/IMG_8443-HDR.jpg'] },
  { id: 'f79', name: 'Clara', type: 'catamaran', guests: 35, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Clara/WhatsApp Image 2023-09-08 at 05.54.32.jpg', images: ['assets/ships/sailing-catamarans/Clara/WhatsApp Image 2023-09-08 at 05.54.32.jpg', 'assets/ships/sailing-catamarans/Clara/WhatsApp Image 2023-09-08 at 05.54.33.jpg', 'assets/ships/sailing-catamarans/Clara/WhatsApp Image 20d23-09-08 at 05.54.35.jpg', 'assets/ships/sailing-catamarans/Clara/WhatsApp Image 20f23-09-08 at 05.54.32.jpg', 'assets/ships/sailing-catamarans/Clara/WhatsApp Image 2d023-09-08 at 05.54.34.jpg'] },
  { id: 'f66', name: 'Cobalt Zoom 37ft', type: 'speedboat', guests: 6, length: '37 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Cobalt Zoom — это американский спидбот с характерным дизайном Cobalt Boats: низкий борт, мощные двигатели, комфортная обивка. Скорость и стиль в одном флаконе. До 10 гостей на открытой воде Андаманского моря. Ко Кай, Майтон, Ко Рача — маршруты подбираются под запрос. Катер уверенно держит курс на любой высоте волны. Открытая корма идеальна для прыжков в воду.', description_en: 'Cobalt Zoom is an American speedboat with the signature Cobalt Boats look: low freeboard, powerful engines, quality upholstery. Speed and style in one package. Up to 10 guests on the open Andaman Sea. Ko Kai, Maiton, Ko Racha — routes built to order. The boat handles well whatever the sea state. The open stern is perfect for jumping in.', img: 'assets/ships/motorboats/Cobalt Zoom 37ft/0234.jpg', images: ['assets/ships/motorboats/Cobalt Zoom 37ft/0234.jpg', 'assets/ships/motorboats/Cobalt Zoom 37ft/Copy of DJI_20250325163237_0002_D-Enhanced-NR.jpg', 'assets/ships/motorboats/Cobalt Zoom 37ft/Copy of DJI_20250325163242_0003_D-Enhanced-NR-2.jpg', 'assets/ships/motorboats/Cobalt Zoom 37ft/Copy of DJI_20250325163242_0003_D.jpg', 'assets/ships/motorboats/Cobalt Zoom 37ft/Copy of DJI_20250325163250_0004_D-Enhanced-NR.jpg'] },
  { id: 'f9', name: 'Di Fish', type: 'motorboat', guests: 20, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Рыбацкая лодка', vibe_en: 'Fishing Boat', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Fishing boat for sea fishing in Phuket. Experienced crew, trolling and bottom fishing. Transfer from main beaches included.', img: 'assets/ships/fishing-boats/Di Fish/00.jpg', images: ['assets/ships/fishing-boats/Di Fish/00.jpg', 'assets/ships/fishing-boats/Di Fish/001.jpg', 'assets/ships/fishing-boats/Di Fish/002.jpg', 'assets/ships/fishing-boats/Di Fish/003b.jpg', 'assets/ships/fishing-boats/Di Fish/00_.jpg'] },
  { id: 'f14', name: 'Formula 42ft', type: 'catamaran', guests: 15, length: '42 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/Formula 42ft/Фото 30.12.2024, 15 43 25 (2).jpg', images: ['assets/ships/motor-catamarans/Formula 42ft/Фото 30.12.2024, 15 43 25 (2).jpg', 'assets/ships/motor-catamarans/Formula 42ft/Фото 30.12.2024, 15 43 25 (3).jpg', 'assets/ships/motor-catamarans/Formula 42ft/Фото 30.12.2024, 15 43 25 (4).jpg', 'assets/ships/motor-catamarans/Formula 42ft/Фото 30.12.2024, 15 43 25 (5).jpg', 'assets/ships/motor-catamarans/Formula 42ft/Фото 30.12.2024, 15 43 25.jpg'] },
  { id: 'f15', name: 'Fountain Pajot 40ft', type: 'catamaran', guests: 10, length: '40 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/Fountain Pajot 40ft/FP2.jpg', images: ['assets/ships/motor-catamarans/Fountain Pajot 40ft/FP2.jpg', 'assets/ships/motor-catamarans/Fountain Pajot 40ft/FP4.jpg', 'assets/ships/motor-catamarans/Fountain Pajot 40ft/FP5.jpg', 'assets/ships/motor-catamarans/Fountain Pajot 40ft/FP7.jpg', 'assets/ships/motor-catamarans/Fountain Pajot 40ft/FP8.jpg'] },
  { id: 'f80', name: 'Fountaine Pajot 40ft', type: 'catamaran', guests: 12, length: '40 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Fountaine Pajot 40ft/WhatsApp Image 2022-1qq1-10 at 10.12.48.jpg', images: ['assets/ships/sailing-catamarans/Fountaine Pajot 40ft/WhatsApp Image 2022-1qq1-10 at 10.12.48.jpg', 'assets/ships/sailing-catamarans/Fountaine Pajot 40ft/WhatsApp Image 2022-1qqqqq1-10 at 10.12.48.jpg', 'assets/ships/sailing-catamarans/Fountaine Pajot 40ft/WhatsApp Image 20ee22-11-10 at 10.12.47.jpg', 'assets/ships/sailing-catamarans/Fountaine Pajot 40ft/WhatsApp Image 2dee022-11-10 at 10.12.47.jpg', 'assets/ships/sailing-catamarans/Fountaine Pajot 40ft/WhatsApp Image 2в022-11-10 at 10.12.44.jpg'] },
  { id: 'f16', name: 'GoodTime', type: 'catamaran', guests: 25, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/GoodTime/1c289704-517a-4fe0-88cf-82779d005e76.jpg', images: ['assets/ships/motor-catamarans/GoodTime/1c289704-517a-4fe0-88cf-82779d005e76.jpg', 'assets/ships/motor-catamarans/GoodTime/2ae17d86-b10c-4ffb-a5ec-5ce6c50aebc7.jpg', 'assets/ships/motor-catamarans/GoodTime/2b71ded4-f5fa-4162-ab7a-f81590aa3e74.jpg', 'assets/ships/motor-catamarans/GoodTime/7e501bb7-144e-4efd-aff1-886cc524ac44.jpg', 'assets/ships/motor-catamarans/GoodTime/7f287b9e-e298-4798-9395-cc1ed779186d.jpg'] },
  { id: 'f81', name: 'Great Shark 46ft', type: 'catamaran', guests: 25, length: '46 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Great Shark 46ft/PHOTO-2025-08-14-10-17-22.jpg', images: ['assets/ships/sailing-catamarans/Great Shark 46ft/PHOTO-2025-08-14-10-17-22.jpg', 'assets/ships/sailing-catamarans/Great Shark 46ft/PHOTO-2025-08-14-10-17-23.jpg', 'assets/ships/sailing-catamarans/Great Shark 46ft/S__4808793.jpg', 'assets/ships/sailing-catamarans/Great Shark 46ft/S__4808795.jpg', 'assets/ships/sailing-catamarans/Great Shark 46ft/S__4808796.jpg'] },
  { id: 'f107', name: 'Hanse 430 Le Figuier', type: 'yacht', guests: 8, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусная яхта', vibe_en: 'Sailing Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-yachts/Hanse 430 Le Figuier/DIS05288.jpg', images: ['assets/ships/sailing-yachts/Hanse 430 Le Figuier/DIS05288.jpg', 'assets/ships/sailing-yachts/Hanse 430 Le Figuier/DJI_0024.jpg', 'assets/ships/sailing-yachts/Hanse 430 Le Figuier/DJI_0941-2.jpg', 'assets/ships/sailing-yachts/Hanse 430 Le Figuier/DJI_0963(1).jpg', 'assets/ships/sailing-yachts/Hanse 430 Le Figuier/DJI_0968-2.jpg'] },
  { id: 'f82', name: 'Hennessy 40ft', type: 'catamaran', guests: 20, length: '40 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Hennessy 40ft/img_hennessy_40ft_01.jpg', images: ['assets/ships/sailing-catamarans/Hennessy 40ft/img_hennessy_40ft_01.jpg', 'assets/ships/sailing-catamarans/Hennessy 40ft/img_hennessy_40ft_02.jpg', 'assets/ships/sailing-catamarans/Hennessy 40ft/img_hennessy_40ft_03.jpg', 'assets/ships/sailing-catamarans/Hennessy 40ft/img_hennessy_40ft_04.jpg', 'assets/ships/sailing-catamarans/Hennessy 40ft/img_hennessy_40ft_05.jpg'] },
  { id: 'f17', name: 'Heysea 40ft', type: 'catamaran', guests: 22, length: '40 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/Heysea 40ft/WhatsApp Image Jan 7 2025 (1).jpg', images: ['assets/ships/motor-catamarans/Heysea 40ft/WhatsApp Image Jan 7 2025 (1).jpg', 'assets/ships/motor-catamarans/Heysea 40ft/WhatsApp Image Jan 7 2025 (2).jpg', 'assets/ships/motor-catamarans/Heysea 40ft/WhatsApp Image Jan 7 2025 (3).jpg', 'assets/ships/motor-catamarans/Heysea 40ft/WhatsApp Image Jan 7 2025 (4).jpg', 'assets/ships/motor-catamarans/Heysea 40ft/WhatsApp Image Jan 7 2025 (5).jpg'] },
  { id: 'f18', name: 'Hot Chilli', type: 'catamaran', guests: 14, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/Hot Chilli/Hot Chilli close up.jpg', images: ['assets/ships/motor-catamarans/Hot Chilli/Hot Chilli close up.jpg', 'assets/ships/motor-catamarans/Hot Chilli/Hot Chilli Drone.jpg'] },
  { id: 'f39', name: 'Jeaneau 34ft', type: 'yacht', guests: 8, length: '34 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Jeaneau 34ft — парусная яхта французской верфи для тех, кто хочет настоящий парус по доступной цене. Компактная, маневренная, уверенная в ходе. До 6 гостей на один или несколько дней. Две каюты, камбуз, компания друзей и ветер в паруса. Маршруты ближнего пояса: Ко Рача, Ко Хе, Ко Лон. Или просто выйти из Чалонга, поставить паруса и провести день на воде — без суеты, без шума.', description_en: 'Jeaneau 34ft is a French-built sailing yacht for those who want real sailing at an accessible price. Compact, manoeuvrable, confident under canvas. Up to 6 guests for one or several days. Two cabins, galley, a handful of friends and wind in the sails. Near-range routes: Ko Racha, Ko He, Ko Lon. Or simply cast off from Chalong, set the sails and spend a day on the water — no noise, no rush.', img: 'assets/ships/motor-yachts/Jeaneau 34ft/photo_2025-09-12_07-50-02 (2).jpg', images: ['assets/ships/motor-yachts/Jeaneau 34ft/photo_2025-09-12_07-50-02 (2).jpg', 'assets/ships/motor-yachts/Jeaneau 34ft/photo_2025-09-12_07-50-02 (3).jpg', 'assets/ships/motor-yachts/Jeaneau 34ft/photo_2025-09-12_07-50-02 (4).jpg', 'assets/ships/motor-yachts/Jeaneau 34ft/photo_2025-09-12_07-50-02.jpg', 'assets/ships/motor-yachts/Jeaneau 34ft/photo_2025-09-12_07-50-03 (2).jpg'] },
  { id: 'f83', name: 'Lagoon 38', type: 'catamaran', guests: 15, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Lagoon 38/0.jpg', images: ['assets/ships/sailing-catamarans/Lagoon 38/0.jpg', 'assets/ships/sailing-catamarans/Lagoon 38/1.jpg', 'assets/ships/sailing-catamarans/Lagoon 38/3.jpg', 'assets/ships/sailing-catamarans/Lagoon 38/4.jpg', 'assets/ships/sailing-catamarans/Lagoon 38/5.jpg'] },
  { id: 'f84', name: 'Lagoon 400S2', type: 'catamaran', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Lagoon 400S2/1_0.jpg', images: ['assets/ships/sailing-catamarans/Lagoon 400S2/1_0.jpg', 'assets/ships/sailing-catamarans/Lagoon 400S2/3.jpg', 'assets/ships/sailing-catamarans/Lagoon 400S2/7.jpg', 'assets/ships/sailing-catamarans/Lagoon 400S2/8.jpg', 'assets/ships/sailing-catamarans/Lagoon 400S2/9.jpg'] },
  { id: 'f85', name: 'Lagoon 420', type: 'catamaran', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Lagoon 420/2022-10-31 17.09.53.jpg', images: ['assets/ships/sailing-catamarans/Lagoon 420/2022-10-31 17.09.53.jpg', 'assets/ships/sailing-catamarans/Lagoon 420/2022-10-31 17.10.02.jpg', 'assets/ships/sailing-catamarans/Lagoon 420/2022-10-31 17.10.56.jpg', 'assets/ships/sailing-catamarans/Lagoon 420/2022-10-31 17.11.01.jpg', 'assets/ships/sailing-catamarans/Lagoon 420/2022-10-31 17.11.05.jpg'] },
  { id: 'f87', name: 'Lagoon 450 fly Oceanland', type: 'catamaran', guests: 20, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Lagoon 450 fly Oceanland/15968809.jpg', images: ['assets/ships/sailing-catamarans/Lagoon 450 fly Oceanland/15968809.jpg', 'assets/ships/sailing-catamarans/Lagoon 450 fly Oceanland/15968810.jpg', 'assets/ships/sailing-catamarans/Lagoon 450 fly Oceanland/15968816.jpg', 'assets/ships/sailing-catamarans/Lagoon 450 fly Oceanland/15968871 - สำเนา.jpg', 'assets/ships/sailing-catamarans/Lagoon 450 fly Oceanland/5c3eff5f2cf17.jpg'] },
  { id: 'f19', name: 'Leopard 40ft', type: 'catamaran', guests: 15, length: '40 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/Leopard 40ft/img_leopard_40_lagoon_01.jpg', images: ['assets/ships/motor-catamarans/Leopard 40ft/img_leopard_40_lagoon_01.jpg', 'assets/ships/motor-catamarans/Leopard 40ft/img_leopard_40_lagoon_02.jpg', 'assets/ships/motor-catamarans/Leopard 40ft/img_leopard_40_lagoon_03.jpg', 'assets/ships/motor-catamarans/Leopard 40ft/img_leopard_40_lagoon_04.jpg', 'assets/ships/motor-catamarans/Leopard 40ft/img_leopard_40_lagoon_05.jpg'] },
  { id: 'f20', name: 'Leopard 43', type: 'catamaran', guests: 20, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/Leopard 43/11SHASHANI-tiger-marine-charter.jpg', images: ['assets/ships/motor-catamarans/Leopard 43/11SHASHANI-tiger-marine-charter.jpg', 'assets/ships/motor-catamarans/Leopard 43/12SHASHANI-tiger-marine-charter.jpg', 'assets/ships/motor-catamarans/Leopard 43/368cc819-ba8b-4851-bcfe-7214c5ba2327.jpg', 'assets/ships/motor-catamarans/Leopard 43/93c61697-3fb0-45d5-9697-a2a9ea8e4527.jpg', 'assets/ships/motor-catamarans/Leopard 43/9f2d8a92-91c9-412a-b53b-7aabf1353c54.jpg'] },
  { id: 'f88', name: 'Leopard 50', type: 'catamaran', guests: 15, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Leopard 50/20230621_131421.jpg', images: ['assets/ships/sailing-catamarans/Leopard 50/20230621_131421.jpg', 'assets/ships/sailing-catamarans/Leopard 50/IMG-20230207-WA0002.jpg', 'assets/ships/sailing-catamarans/Leopard 50/IMG-20230322-WA0020.jpg', 'assets/ships/sailing-catamarans/Leopard 50/IMG-20230328-WA0018.jpg', 'assets/ships/sailing-catamarans/Leopard 50/IMG-20230703-WA0001.jpg'] },
  { id: 'f21', name: 'Leopard 51 La Vie', type: 'catamaran', guests: 30, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/Leopard 51 La Vie/img_leopard_51_la_vie_01.jpg', images: ['assets/ships/motor-catamarans/Leopard 51 La Vie/img_leopard_51_la_vie_01.jpg', 'assets/ships/motor-catamarans/Leopard 51 La Vie/img_leopard_51_la_vie_02.jpg', 'assets/ships/motor-catamarans/Leopard 51 La Vie/img_leopard_51_la_vie_03.jpg', 'assets/ships/motor-catamarans/Leopard 51 La Vie/img_leopard_51_la_vie_04.jpg', 'assets/ships/motor-catamarans/Leopard 51 La Vie/img_leopard_51_la_vie_05.jpg'] },
  { id: 'f22', name: 'Leopard 53ft', type: 'catamaran', guests: 35, length: '53 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/Leopard 53ft/2568-07-01 at 13.48.17.jpg', images: ['assets/ships/motor-catamarans/Leopard 53ft/2568-07-01 at 13.48.17.jpg', 'assets/ships/motor-catamarans/Leopard 53ft/2568-07-01 at 13.48.43.jpg', 'assets/ships/motor-catamarans/Leopard 53ft/2568-07-01 at 13.49.14.jpg', 'assets/ships/motor-catamarans/Leopard 53ft/5.jpg', 'assets/ships/motor-catamarans/Leopard 53ft/Image-Slider-Leopard-53.jpg'] },
  { id: 'f23', name: 'Leopard Aura 51', type: 'catamaran', guests: 35, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/Leopard Aura 51/img_Leopard_Aura_51_01.jpg', images: ['assets/ships/motor-catamarans/Leopard Aura 51/img_Leopard_Aura_51_01.jpg', 'assets/ships/motor-catamarans/Leopard Aura 51/img_Leopard_Aura_51_02.jpg', 'assets/ships/motor-catamarans/Leopard Aura 51/img_Leopard_Aura_51_03.jpg', 'assets/ships/motor-catamarans/Leopard Aura 51/img_Leopard_Aura_51_04.jpg', 'assets/ships/motor-catamarans/Leopard Aura 51/img_Leopard_Aura_51_05.jpg'] },
  { id: 'f89', name: 'Lobster', type: 'catamaran', guests: 120, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Lobster/img_lobster_01.jpg', images: ['assets/ships/sailing-catamarans/Lobster/img_lobster_01.jpg', 'assets/ships/sailing-catamarans/Lobster/img_lobster_02.jpg', 'assets/ships/sailing-catamarans/Lobster/img_lobster_03.jpg', 'assets/ships/sailing-catamarans/Lobster/img_lobster_04.jpg', 'assets/ships/sailing-catamarans/Lobster/img_lobster_05.jpg'] },
  { id: 'f24', name: 'Luxury Dream Voyager 59ft', type: 'catamaran', guests: 65, length: '59 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Luxury Dream Voyager — крупный моторный катамаран, созданный для событий. 59 футов, две широкие палубы, большая теневая зона, просторная корма для прыжков в воду. До 50 гостей под открытым небом Андаманского моря. Корпоратив, день рождения, свадьба на воде — Luxury Dream берёт любой масштаб. Обед на борту, барная стойка, звуковая система — всё настраивается под ваш запрос заранее. Четыре каюты позволяют остаться ночевать и выйти на следующий остров утром. Консьерж Azanov строит программу от и до.', description_en: 'Luxury Dream Voyager is a large motor catamaran built for events. 59 feet, two wide decks, generous shade, a broad stern platform for jumping into the water. Up to 50 guests beneath the open Andaman sky. Corporate event, birthday, wedding on the water — Luxury Dream handles any scale. Onboard lunch, bar setup, sound system — everything configured to your brief in advance. Four cabins make overnight stays possible: wake up anchored at the next island. Your Azanov concierge builds the programme end-to-end.', img: 'assets/ships/motor-catamarans/Luxury Dream Voyager 59ft/PHOTO-2025-12-01-12-45-58.jpg', images: ['assets/ships/motor-catamarans/Luxury Dream Voyager 59ft/PHOTO-2025-12-01-12-45-58.jpg', 'assets/ships/motor-catamarans/Luxury Dream Voyager 59ft/PHOTO-2025-12-01-12-45-59 (1).jpg', 'assets/ships/motor-catamarans/Luxury Dream Voyager 59ft/PHOTO-2025-12-01-12-45-59.jpg', 'assets/ships/motor-catamarans/Luxury Dream Voyager 59ft/PHOTO-2025-12-01-12-46-00.jpg', 'assets/ships/motor-catamarans/Luxury Dream Voyager 59ft/Фото 28.11.2025, 12 58 24.jpg'] },
  { id: 'f41', name: 'Majestic 48ft', type: 'yacht', guests: 22, length: '48 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Majestic 48ft/MJ 1.jpg', images: ['assets/ships/motor-yachts/Majestic 48ft/MJ 1.jpg', 'assets/ships/motor-yachts/Majestic 48ft/MJ 2.jpg', 'assets/ships/motor-yachts/Majestic 48ft/MJ 3.jpg', 'assets/ships/motor-yachts/Majestic 48ft/MJ 4.jpg', 'assets/ships/motor-yachts/Majestic 48ft/MJ 5.jpg'] },
  { id: 'f42', name: 'Mami Wata', type: 'yacht', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Mami Wata/img_mami_wata_01.jpg', images: ['assets/ships/motor-yachts/Mami Wata/img_mami_wata_01.jpg', 'assets/ships/motor-yachts/Mami Wata/img_mami_wata_02.jpg', 'assets/ships/motor-yachts/Mami Wata/img_mami_wata_03.jpg'] },
  { id: 'f108', name: 'Monica 75ft', type: 'yacht', guests: 15, length: '75 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусная яхта', vibe_en: 'Sailing Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-yachts/Monica 75ft/img_monica_75ft_01.jpg', images: ['assets/ships/sailing-yachts/Monica 75ft/img_monica_75ft_01.jpg', 'assets/ships/sailing-yachts/Monica 75ft/img_monica_75ft_02.jpg', 'assets/ships/sailing-yachts/Monica 75ft/img_monica_75ft_03.jpg', 'assets/ships/sailing-yachts/Monica 75ft/img_monica_75ft_04.jpg', 'assets/ships/sailing-yachts/Monica 75ft/img_monica_75ft_05.jpg'] },
  { id: 'f25', name: 'My Sky 53ft', type: 'catamaran', guests: 15, length: '53 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/My Sky 53ft/DJI_0521.jpg', images: ['assets/ships/motor-catamarans/My Sky 53ft/DJI_0521.jpg', 'assets/ships/motor-catamarans/My Sky 53ft/KING316683-gigapixel-standard-scale-4_00x.jpg'] },
  { id: 'f90', name: 'Myra Leopard 47', type: 'catamaran', guests: 30, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Myra Leopard 47/MYRA_1.jpg', images: ['assets/ships/sailing-catamarans/Myra Leopard 47/MYRA_1.jpg', 'assets/ships/sailing-catamarans/Myra Leopard 47/MYRA_2.jpg', 'assets/ships/sailing-catamarans/Myra Leopard 47/MYRA_3.jpg', 'assets/ships/sailing-catamarans/Myra Leopard 47/MYRA_4.jpg', 'assets/ships/sailing-catamarans/Myra Leopard 47/MYRA_5.jpg'] },
  { id: 'f91', name: 'Namaste 55ft', type: 'catamaran', guests: 45, length: '55 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Namaste 55ft/1734018311354.jpg', images: ['assets/ships/sailing-catamarans/Namaste 55ft/1734018311354.jpg', 'assets/ships/sailing-catamarans/Namaste 55ft/1734105458645.jpg', 'assets/ships/sailing-catamarans/Namaste 55ft/1734105459432.jpg', 'assets/ships/sailing-catamarans/Namaste 55ft/DJI_0221.jpg', 'assets/ships/sailing-catamarans/Namaste 55ft/IMG_3678.jpg'] },
  { id: 'f26', name: 'Party Catamaran 110ft', type: 'superyacht', guests: 150, length: '110 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Суперяхта', vibe_en: 'Superyacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Luxury superyacht charter in Phuket. Premium service, professional crew, transfer. VIP experience for events, celebrations, and private sea voyages.', img: 'assets/ships/motor-catamarans/Party Catamaran 110ft/1.jpg', images: ['assets/ships/motor-catamarans/Party Catamaran 110ft/1.jpg', 'assets/ships/motor-catamarans/Party Catamaran 110ft/2.jpg', 'assets/ships/motor-catamarans/Party Catamaran 110ft/3.jpg', 'assets/ships/motor-catamarans/Party Catamaran 110ft/4.jpg', 'assets/ships/motor-catamarans/Party Catamaran 110ft/5.jpg'] },
  { id: 'f92', name: 'Penelope Lagoon 400 S2', type: 'catamaran', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Penelope Lagoon 400 S2/901.jpg', images: ['assets/ships/sailing-catamarans/Penelope Lagoon 400 S2/901.jpg', 'assets/ships/sailing-catamarans/Penelope Lagoon 400 S2/902.jpg', 'assets/ships/sailing-catamarans/Penelope Lagoon 400 S2/903.jpg', 'assets/ships/sailing-catamarans/Penelope Lagoon 400 S2/906.jpg', 'assets/ships/sailing-catamarans/Penelope Lagoon 400 S2/arenda-katamarana-na-phukete_lagoon-40_01.jpg'] },
  { id: 'f47', name: 'Posillipo-rizzardi Technema 48', type: 'yacht', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Posillipo-Rizzardi Technema 89 — одна из самых узнаваемых итальянских моторных яхт своего времени. Классические формы итальянского яхтостроения, три палубы, пять кают. До 20 гостей на день — и вся яхта принадлежит только им. Пхи-Пхи, Пханг Нга, Краби — маршруты для яхты, которая делает их событием. Ужин на корме, закат с флайбриджа, якорная стоянка в закрытой бухте — это то, ради чего.', description_en: 'Posillipo-Rizzardi Technema 89 is one of the most recognisable Italian motor yachts of its era. Classic Italian boatbuilding lines, three decks, five cabins. Up to 20 guests per day — and the entire yacht belongs only to them. Phi Phi, Phang Nga, Krabi — routes that become events on a yacht like this. Dinner on the stern, sunset from the flybridge, anchored in a sheltered bay — this is what it\'s for.', img: 'assets/ships/motor-yachts/Posillipo-rizzardi Technema 48/20220530-DSC_6739.jpg', images: ['assets/ships/motor-yachts/Posillipo-rizzardi Technema 48/20220530-DSC_6739.jpg', 'assets/ships/motor-yachts/Posillipo-rizzardi Technema 48/20220530-DSC_6815.jpg', 'assets/ships/motor-yachts/Posillipo-rizzardi Technema 48/20220530-DSC_6816.jpg', 'assets/ships/motor-yachts/Posillipo-rizzardi Technema 48/20220530-DSC_6820.jpg', 'assets/ships/motor-yachts/Posillipo-rizzardi Technema 48/20220530-DSC_6823.jpg'] },
  { id: 'f11', name: 'Prapis', type: 'motorboat', guests: 15, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Рыбацкая лодка', vibe_en: 'Fishing Boat', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Deep-sea fishing boat in Phuket. Experienced crew, full equipment, bait included. Trolling, bottom fishing, and spinning.', img: 'assets/ships/fishing-boats/Prapis/01.jpg', images: ['assets/ships/fishing-boats/Prapis/01.jpg', 'assets/ships/fishing-boats/Prapis/02.jpg', 'assets/ships/fishing-boats/Prapis/03.jpg', 'assets/ships/fishing-boats/Prapis/04.jpg', 'assets/ships/fishing-boats/Prapis/05.jpg'] },
  { id: 'f48', name: 'Princess 42 JB 42ft', type: 'yacht', guests: 8, length: '42 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Princess 42 — британская моторная яхта с характерным дизайном и хорошей скоростью. Флайбридж с видом на 360 градусов, кормовая платформа для купания, кондиционируемый салон с диванами. Не слишком большая, чтобы быть неповоротливой — и достаточно просторная для комфортного дня. До 10 гостей. Ко Кай, Майтон, Ко Рача — полный набор пхукетских маршрутов в одном чартере. Возможность ночёвки на борту в двух каютах.', description_en: 'Princess 42 is a British motor yacht with a distinctive profile and solid speed. 360-degree flybridge views, a swim platform at the stern, an air-conditioned saloon with proper seating. Not too large to be clumsy — and spacious enough for a comfortable day on the water. Up to 10 guests. Ko Kai, Maiton, Ko Racha — the full Phuket charter menu in one booking. Overnight stays possible in two cabins.', img: 'assets/ships/motor-yachts/Princess 42 JB 42ft/DJI_0008 copy.jpg', images: ['assets/ships/motor-yachts/Princess 42 JB 42ft/DJI_0008 copy.jpg', 'assets/ships/motor-yachts/Princess 42 JB 42ft/DJI_0013 copy.jpg', 'assets/ships/motor-yachts/Princess 42 JB 42ft/DJI_0014 copy.jpg', 'assets/ships/motor-yachts/Princess 42 JB 42ft/DJI_0020 copy.jpg', 'assets/ships/motor-yachts/Princess 42 JB 42ft/DJI_0022.jpg'] },
  { id: 'f49', name: 'Princess 52ft', type: 'yacht', guests: 10, length: '52 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Princess 52ft/img_princess_52ft01.jpg', images: ['assets/ships/motor-yachts/Princess 52ft/img_princess_52ft01.jpg', 'assets/ships/motor-yachts/Princess 52ft/img_princess_52ft02.jpg', 'assets/ships/motor-yachts/Princess 52ft/img_princess_52ft03.jpg', 'assets/ships/motor-yachts/Princess 52ft/img_princess_52ft04.jpg', 'assets/ships/motor-yachts/Princess 52ft/img_princess_52ft05.jpg'] },
  { id: 'f51', name: 'Princess 78', type: 'yacht', guests: 20, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Princess 78ft — флагманская позиция британской верфи Princess в моторном сегменте. Три палубы, просторный флайбридж, четыре люкс-каюты, кормовая платформа с лестницей в море. До 20 гостей на день — и каждый получает пространство. Длинные маршруты, многодневные круизы — Princess 78ft создана именно для движения. Краби, Симиланы, Мьянма — на этой яхте расстояние не проблема. Кают-компания с кухней, столовая зона, кондиционированные каюты с полноценными ванными. Это яхта, которую не нужно объяснять. Один звонок консьержу — и старт в нужное время.', description_en: 'Princess 78ft is the flagship of the British Princess yard in the motor segment. Three decks, spacious flybridge, four luxury en-suite cabins, a stern platform with steps into the sea. Up to 20 guests per day — and everyone has space. Long routes, multi-day cruises — Princess 78ft is built for movement. Krabi, Similan Islands, Myanmar — distance is not an issue. Saloon with full galley, dining zone, air-conditioned cabins with proper bathrooms. This is a yacht that requires no explanation. One call to your concierge — departure on schedule.', img: 'assets/ships/motor-yachts/Princess 78/Princess-78_1.jpg', images: ['assets/ships/motor-yachts/Princess 78/Princess-78_1.jpg', 'assets/ships/motor-yachts/Princess 78/Princess-78_2.jpg', 'assets/ships/motor-yachts/Princess 78/Princess-78_3.jpg', 'assets/ships/motor-yachts/Princess 78/Princess-78_4.jpg', 'assets/ships/motor-yachts/Princess 78/Princess-78_5.jpg'] },
  { id: 'f52', name: 'Princess 78ft', type: 'yacht', guests: 20, length: '78 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Princess 78ft — флагманская позиция британской верфи Princess в моторном сегменте. Три палубы, просторный флайбридж, четыре люкс-каюты, кормовая платформа с лестницей в море. До 20 гостей на день — и каждый получает пространство. Длинные маршруты, многодневные круизы — Princess 78ft создана именно для движения. Краби, Симиланы, Мьянма — на этой яхте расстояние не проблема. Кают-компания с кухней, столовая зона, кондиционированные каюты с полноценными ванными. Это яхта, которую не нужно объяснять. Один звонок консьержу — и старт в нужное время.', description_en: 'Princess 78ft is the flagship of the British Princess yard in the motor segment. Three decks, spacious flybridge, four luxury en-suite cabins, a stern platform with steps into the sea. Up to 20 guests per day — and everyone has space. Long routes, multi-day cruises — Princess 78ft is built for movement. Krabi, Similan Islands, Myanmar — distance is not an issue. Saloon with full galley, dining zone, air-conditioned cabins with proper bathrooms. This is a yacht that requires no explanation. One call to your concierge — departure on schedule.', img: 'assets/ships/motor-yachts/Princess 78ft/Princess78 1.jpg', images: ['assets/ships/motor-yachts/Princess 78ft/Princess78 1.jpg', 'assets/ships/motor-yachts/Princess 78ft/Princess78 2.jpg', 'assets/ships/motor-yachts/Princess 78ft/Princess78 3.jpg', 'assets/ships/motor-yachts/Princess 78ft/Princess78 4.jpg', 'assets/ships/motor-yachts/Princess 78ft/Princess78 5.jpg'] },
  { id: 'f53', name: 'Princess F55 60ft', type: 'yacht', guests: 8, length: '60 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Princess F55 — серия F от Princess Yachts: самые динамичные модели в линейке. 55–60 футов, агрессивный флайбридж открытого типа, угловатые формы, тёмные поверхности. Это не обычная Princess — это Princess для тех, кто следит за деталями. До 12 гостей. Три каюты, открытый флайбридж с диванами и баром, широкая кормовая платформа. Скорость крейсера в корпусе суперкара.', description_en: 'Princess F55 is from the F-series range by Princess Yachts — the most dynamic line in their catalogue. 55–60 feet, aggressive open flybridge, angular surfaces, dark finishes. This isn\'t a standard Princess — it\'s a Princess for those who notice the details. Up to 12 guests. Three cabins, open flybridge with loungers and a bar, wide swim platform. Cruiser speed in a supercar body.', img: 'assets/ships/motor-yachts/Princess F55 60ft/PrincessF55 1.jpg', images: ['assets/ships/motor-yachts/Princess F55 60ft/PrincessF55 1.jpg', 'assets/ships/motor-yachts/Princess F55 60ft/PrincessF55 2.jpg', 'assets/ships/motor-yachts/Princess F55 60ft/PrincessF55 3.jpg', 'assets/ships/motor-yachts/Princess F55 60ft/PrincessF55 4.jpg', 'assets/ships/motor-yachts/Princess F55 60ft/PrincessF55 5.jpg'] },
  { id: 'f54', name: 'Princess S65', type: 'yacht', guests: 16, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Princess S65/arenda-yachti-phuket-arenda-yachti-phuket-princess-65-65X800_1.jpg', images: ['assets/ships/motor-yachts/Princess S65/arenda-yachti-phuket-arenda-yachti-phuket-princess-65-65X800_1.jpg', 'assets/ships/motor-yachts/Princess S65/arenda-yachti-phuket-arenda-yachti-phuket-princess-65-65X800_2.jpg', 'assets/ships/motor-yachts/Princess S65/arenda-yachti-phuket-arenda-yachti-phuket-princess-65-65X800_3.jpg', 'assets/ships/motor-yachts/Princess S65/arenda-yachti-phuket-arenda-yachti-phuket-princess-65-65X800_4.jpg', 'assets/ships/motor-yachts/Princess S65/arenda-yachti-phuket-arenda-yachti-phuket-princess-65-65X800_5.jpg'] },
  { id: 'f55', name: 'Princess V39', type: 'yacht', guests: 8, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Princess V39/arenda-yachti-phuket-princess-v39cess-V39_2.jpg', images: ['assets/ships/motor-yachts/Princess V39/arenda-yachti-phuket-princess-v39cess-V39_2.jpg', 'assets/ships/motor-yachts/Princess V39/arenda-yachti-phuket-princess-v39cess-V39_3.jpg', 'assets/ships/motor-yachts/Princess V39/arenda-yachti-phuket-princess-v39cess-V39_4.jpg', 'assets/ships/motor-yachts/Princess V39/arenda-yachti-phuket-princess-v39cess-V39_5.jpg', 'assets/ships/motor-yachts/Princess V39/arenda-yachti-phuket-princess-v39cess-V39_6.jpg'] },
  { id: 'f56', name: 'Riviera 58ft', type: 'yacht', guests: 12, length: '58 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Riviera 58ft/MDP-21.jpg', images: ['assets/ships/motor-yachts/Riviera 58ft/MDP-21.jpg', 'assets/ships/motor-yachts/Riviera 58ft/MDP-26.jpg', 'assets/ships/motor-yachts/Riviera 58ft/MDP-28.jpg', 'assets/ships/motor-yachts/Riviera 58ft/MDP-32.jpg', 'assets/ships/motor-yachts/Riviera 58ft/MDP-34.jpg'] },
  { id: 'f58', name: 'SJ-Alina-Symbol 57', type: 'yacht', guests: 17, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/SJ-Alina-Symbol 57/arenda_yachti_na_phukete_sj_alinaApp I9mage 2023-09-19 at 04.04.28.jpg', images: ['assets/ships/motor-yachts/SJ-Alina-Symbol 57/arenda_yachti_na_phukete_sj_alinaApp I9mage 2023-09-19 at 04.04.28.jpg', 'assets/ships/motor-yachts/SJ-Alina-Symbol 57/arenda_yachti_na_phukete_sj_alinaApp Image 2023-09-19 at 04.04.25.jpg', 'assets/ships/motor-yachts/SJ-Alina-Symbol 57/arenda_yachti_na_phukete_sj_alinaApp Image 2023-09-19 at 04.04.26.jpg', 'assets/ships/motor-yachts/SJ-Alina-Symbol 57/arenda_yachti_na_phukete_sj_alinaApp Image 202у3-09-19 at 04.04.27.jpg', 'assets/ships/motor-yachts/SJ-Alina-Symbol 57/arenda_yachti_na_phukete_sj_alinaApp Image 2у023-09-19 at 04.04.26.jpg'] },
  { id: 'f94', name: 'Satisfaction 55ft', type: 'catamaran', guests: 40, length: '55 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Satisfaction 55ft/arenda_yachti_v_msc_majesty_850466hdr.jpg', images: ['assets/ships/sailing-catamarans/Satisfaction 55ft/arenda_yachti_v_msc_majesty_850466hdr.jpg', 'assets/ships/sailing-catamarans/Satisfaction 55ft/arenda_yachti_v_msc_majesty_850468hdr.jpg', 'assets/ships/sailing-catamarans/Satisfaction 55ft/arenda_yachti_v_msc_majesty_850470hdr.jpg', 'assets/ships/sailing-catamarans/Satisfaction 55ft/arenda_yachti_v_msc_majesty_850472hdr.jpg', 'assets/ships/sailing-catamarans/Satisfaction 55ft/arenda_yachti_v_msc_majesty_850474hdr.jpg'] },
  { id: 'f60', name: 'Sealine 51', type: 'yacht', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Sealine 51/IMG_001.jpg', images: ['assets/ships/motor-yachts/Sealine 51/IMG_001.jpg', 'assets/ships/motor-yachts/Sealine 51/IMG_002.jpg', 'assets/ships/motor-yachts/Sealine 51/IMG_003.jpg', 'assets/ships/motor-yachts/Sealine 51/IMG_004.jpg', 'assets/ships/motor-yachts/Sealine 51/IMG_005.jpg'] },
  { id: 'f67', name: 'Searay 8', type: 'speedboat', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private speedboat for island tours around Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motorboats/Searay 8/0DA8DA88-BF5D-4F09-A108-B4CB947E9BD7.jpg', images: ['assets/ships/motorboats/Searay 8/0DA8DA88-BF5D-4F09-A108-B4CB947E9BD7.jpg', 'assets/ships/motorboats/Searay 8/10DCAD37-8199-49C0-A310-47D28B641E18.jpg', 'assets/ships/motorboats/Searay 8/1AC3604C-0486-4B15-8EEC-32D691EBBA97.jpg', 'assets/ships/motorboats/Searay 8/3FA64521-8EA1-4267-A608-5EC53FD0975A.jpg', 'assets/ships/motorboats/Searay 8/5D6F54FA-4EF2-4287-BB8F-D06F14394FA2.jpg'] },
  { id: 'f61', name: 'Searay Sundancer 46ft', type: 'yacht', guests: 15, length: '46 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Searay Sundancer 46ft/photo_2024-06-08_17-19-03.jpg', images: ['assets/ships/motor-yachts/Searay Sundancer 46ft/photo_2024-06-08_17-19-03.jpg', 'assets/ships/motor-yachts/Searay Sundancer 46ft/photo_2024-06-08_17-19-13.jpg', 'assets/ships/motor-yachts/Searay Sundancer 46ft/photo_2024-06-08_17-19-17.jpg', 'assets/ships/motor-yachts/Searay Sundancer 46ft/photo_2024-06-08_17-19-20.jpg', 'assets/ships/motor-yachts/Searay Sundancer 46ft/photo_2024-06-08_17-19-25.jpg'] },
  { id: 'f95', name: 'Senna Nautitech 47', type: 'catamaran', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Senna Nautitech 47/7M_(LG)_SENNA_1.jpg', images: ['assets/ships/sailing-catamarans/Senna Nautitech 47/7M_(LG)_SENNA_1.jpg', 'assets/ships/sailing-catamarans/Senna Nautitech 47/7M_(LG)_SENNA_2.jpg', 'assets/ships/sailing-catamarans/Senna Nautitech 47/7M_(LG)_SENNA_3.jpg', 'assets/ships/sailing-catamarans/Senna Nautitech 47/7M_(LG)_SENNA_4.jpg', 'assets/ships/sailing-catamarans/Senna Nautitech 47/7M_(LG)_SENNA_5.jpg'] },
  { id: 'f12', name: 'Shaina 55ft', type: 'motorboat', guests: 22, length: '55 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Рыбацкая лодка', vibe_en: 'Fishing Boat', description: 'Shaina — 55-футовая моторная яхта в хорошем состоянии с просторной открытой кормой и двумя каютами для ночёвки. Устойчивый, предсказуемый ход — без неожиданностей. До 15 гостей на день, до 4 на ночь. Ко Рача Яй, Ко Кай, Пханг Нга — Shaina уверенно ходит по классическим маршрутам. Хороший выбор для тех, кому нужна надёжная яхта среднего класса без переплаты за именной бренд.', description_en: 'Shaina is a well-maintained 55-foot motor yacht with a spacious open stern and two overnight cabins. Steady, predictable handling — no surprises. Up to 15 guests per day, up to 4 overnight. Ko Racha Yai, Ko Kai, Phang Nga — Shaina handles the classic routes with confidence. The right choice for those who need a reliable mid-range yacht without paying for a brand name.', img: 'assets/ships/fishing-boats/Shaina 55ft/DJI_0041.jpg', images: ['assets/ships/fishing-boats/Shaina 55ft/DJI_0041.jpg', 'assets/ships/fishing-boats/Shaina 55ft/DJI_0043.jpg', 'assets/ships/fishing-boats/Shaina 55ft/DJI_0044.jpg', 'assets/ships/fishing-boats/Shaina 55ft/DJI_0047.jpg', 'assets/ships/fishing-boats/Shaina 55ft/DJI_0051.jpg'] },
  { id: 'f96', name: 'Shangani', type: 'catamaran', guests: 60, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Shangani/_DSC1860.jpg', images: ['assets/ships/sailing-catamarans/Shangani/_DSC1860.jpg', 'assets/ships/sailing-catamarans/Shangani/beach-dining-kayak-2-700x465.jpg', 'assets/ships/sailing-catamarans/Shangani/beach-dining-kayak-700x465.jpg', 'assets/ships/sailing-catamarans/Shangani/bo dining table .jpg', 'assets/ships/sailing-catamarans/Shangani/DSC02255.jpg'] },
  { id: 'f63', name: 'Silentworld 129ft', type: 'superyacht', guests: 10, length: '129 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Суперяхта', vibe_en: 'Superyacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Luxury superyacht charter in Phuket. Premium service, professional crew, transfer. VIP experience for events, celebrations, and private sea voyages.', img: 'assets/ships/motor-yachts/Silentworld 129ft/img_silentworld_129ft_01.jpg', images: ['assets/ships/motor-yachts/Silentworld 129ft/img_silentworld_129ft_01.jpg', 'assets/ships/motor-yachts/Silentworld 129ft/img_silentworld_129ft_03.jpg', 'assets/ships/motor-yachts/Silentworld 129ft/img_silentworld_129ft_04.jpg', 'assets/ships/motor-yachts/Silentworld 129ft/img_silentworld_129ft_05.jpg', 'assets/ships/motor-yachts/Silentworld 129ft/img_silentworld_129ft_06.jpg'] },
  { id: 'f13', name: 'Solita', type: 'motorboat', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Рыбацкая лодка', vibe_en: 'Fishing Boat', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Sea fishing boat for Phuket waters. Experienced captain, fishing gear, bait included. Trolling to Racha islands and beyond.', img: 'assets/ships/fishing-boats/Solita/IMG_20191230_220416_495.jpg', images: ['assets/ships/fishing-boats/Solita/IMG_20191230_220416_495.jpg', 'assets/ships/fishing-boats/Solita/IMG_20191230_220420_092.jpg', 'assets/ships/fishing-boats/Solita/IMG_20191230_220423_097.jpg', 'assets/ships/fishing-boats/Solita/IMG_20191230_220425_083.jpg', 'assets/ships/fishing-boats/Solita/IMG_20191230_220426_869.jpg'] },
  { id: 'f28', name: 'Spacecat 118ft', type: 'superyacht', guests: 12, length: '118 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Суперяхта', vibe_en: 'Superyacht', description: 'Spacecat — это другая категория. 118 футов моторного катамарана, которые превращают любое мероприятие в событие. Корпоратив на 100 человек, закрытая вечеринка, свадьба на воде — Spacecat берёт любой масштаб без вопросов. Три просторные палубы, большая теневая зона, открытая корма с платформой, полноценный бар. Экипаж работает как ивент-команда: всё настроено, всё на месте, вы просто приходите. Пхукет — Пхи-Пхи — Пханг Нга. 18 узлов. До 150 гостей на день. Это не чартер — это собственный плавучий остров.', description_en: 'Spacecat is a different category entirely. 118 feet of motor catamaran that turns any event into an occasion. Corporate for 100 guests, private party, wedding on the water — Spacecat handles any scale without question. Three spacious decks, generous shade, open stern platform, a full bar setup. The crew operates like an events team: everything set, everything in place, you just arrive. Phuket — Phi Phi — Phang Nga. 18 knots. Up to 150 guests per day. This isn\'t a charter — it\'s your own floating island.', img: 'assets/ships/motor-catamarans/Spacecat 118ft/00-Spacecat Running Shot.jpg', images: ['assets/ships/motor-catamarans/Spacecat 118ft/00-Spacecat Running Shot.jpg', 'assets/ships/motor-catamarans/Spacecat 118ft/1st100 - Copy.jpg', 'assets/ships/motor-catamarans/Spacecat 118ft/1st119.jpg', 'assets/ships/motor-catamarans/Spacecat 118ft/1st149.jpg', 'assets/ships/motor-catamarans/Spacecat 118ft/1st79.jpg'] },
  { id: 'f98', name: 'Sunreef Eco E-Motion 60ft', type: 'catamaran', guests: 8, length: '60 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Sunreef Eco E-Motion — это флагман технологий в мировом яхтостроении. 60-футовый парусный катамаран на электрической тяге: солнечные панели по всей поверхности, бесшумный электромотор, нулевой след в воде. Выходите на острова — и слышите только море. До 10 гостей. Четыре просторные каюты с ванными. Пхи-Пхи, Симиланы, Краби — Sunreef идёт туда под парусом в абсолютной тишине. Экологический манифест, упакованный в премиальный дизайн. Аренда Sunreef — это выбор тех, кто думает на шаг вперёд. Роскошь, которая не оставляет следов.', description_en: 'Sunreef Eco E-Motion is the technological flagship of global yacht construction. A 60-foot sailing catamaran on electric propulsion: solar panels across every surface, silent electric drive, zero underwater footprint. Head to the islands — and hear only the sea. Up to 10 guests. Four spacious en-suite cabins. Phi Phi, Similan Islands, Krabi — Sunreef arrives under sail in absolute silence. An ecological statement wrapped in premium design. Booking a Sunreef is choosing to be ahead by one step. Luxury that leaves no trace.', img: 'assets/ships/sailing-catamarans/Sunreef Eco E-Motion 60ft/DJI_20250307142000_0029_D-Enhanced-NR.jpg', images: ['assets/ships/sailing-catamarans/Sunreef Eco E-Motion 60ft/DJI_20250307142000_0029_D-Enhanced-NR.jpg', 'assets/ships/sailing-catamarans/Sunreef Eco E-Motion 60ft/DJI_20250307144106_0003_D-Enhanced-NR.jpg', 'assets/ships/sailing-catamarans/Sunreef Eco E-Motion 60ft/DJI_20250307144216_0008_D-Enhanced-NR.jpg', 'assets/ships/sailing-catamarans/Sunreef Eco E-Motion 60ft/DJI_20250307144240_0010_D-Enhanced-NR.jpg', 'assets/ships/sailing-catamarans/Sunreef Eco E-Motion 60ft/DJI_20250307144506_0021_D-Enhanced-NR.jpg'] },
  { id: 'f109', name: 'Sunsail 41ft', type: 'yacht', guests: 6, length: '41 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусная яхта', vibe_en: 'Sailing Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-yachts/Sunsail 41ft/img_sunsail_41ft_01.jpg', images: ['assets/ships/sailing-yachts/Sunsail 41ft/img_sunsail_41ft_01.jpg', 'assets/ships/sailing-yachts/Sunsail 41ft/img_sunsail_41ft_02.jpg', 'assets/ships/sailing-yachts/Sunsail 41ft/img_sunsail_41ft_03.jpg', 'assets/ships/sailing-yachts/Sunsail 41ft/img_sunsail_41ft_04.jpg', 'assets/ships/sailing-yachts/Sunsail 41ft/img_sunsail_41ft_05.jpg'] },
  { id: 'f64', name: 'Sunseeker Manhattan 60', type: 'yacht', guests: 20, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторная яхта', vibe_en: 'Motor Yacht', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private yacht charter in Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-yachts/Sunseeker Manhattan 60/2767300_2fbcfcfa_10.jpg', images: ['assets/ships/motor-yachts/Sunseeker Manhattan 60/2767300_2fbcfcfa_10.jpg', 'assets/ships/motor-yachts/Sunseeker Manhattan 60/2767300_6a814cf3_2.jpg', 'assets/ships/motor-yachts/Sunseeker Manhattan 60/2767300_6f2eb843_20.jpg', 'assets/ships/motor-yachts/Sunseeker Manhattan 60/2767300_80b89d3b_25.jpg', 'assets/ships/motor-yachts/Sunseeker Manhattan 60/2767300_927c4ea9_28.jpg'] },
  { id: 'f99', name: 'Super X 55ft', type: 'catamaran', guests: 50, length: '55 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Super X 55ft/image_Super_X_55ft01.jpg', images: ['assets/ships/sailing-catamarans/Super X 55ft/image_Super_X_55ft01.jpg', 'assets/ships/sailing-catamarans/Super X 55ft/image_Super_X_55ft02.jpg', 'assets/ships/sailing-catamarans/Super X 55ft/image_Super_X_55ft03.jpg', 'assets/ships/sailing-catamarans/Super X 55ft/image_Super_X_55ft04.jpg', 'assets/ships/sailing-catamarans/Super X 55ft/image_Super_X_55ft05.jpg'] },
  { id: 'f100', name: 'Super Y 38ft', type: 'catamaran', guests: 20, length: '38 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Super Y 38ft/2024-03-22 160722.jpg', images: ['assets/ships/sailing-catamarans/Super Y 38ft/2024-03-22 160722.jpg', 'assets/ships/sailing-catamarans/Super Y 38ft/2024-03-22-163610-2.jpg', 'assets/ships/sailing-catamarans/Super Y 38ft/3d0dd953-f5f9-4ffb-a49c-c26ec9df06bb.jpg'] },
  { id: 'f29', name: 'Tequila 37ft', type: 'catamaran', guests: 10, length: '37 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Моторный катамаран', vibe_en: 'Motor Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/motor-catamarans/Tequila 37ft/0.jpg', images: ['assets/ships/motor-catamarans/Tequila 37ft/0.jpg', 'assets/ships/motor-catamarans/Tequila 37ft/1.jpg', 'assets/ships/motor-catamarans/Tequila 37ft/2.jpg', 'assets/ships/motor-catamarans/Tequila 37ft/3.jpg', 'assets/ships/motor-catamarans/Tequila 37ft/4.jpg'] },
  { id: 'f101', name: 'The Best 60ft', type: 'catamaran', guests: 48, length: '60 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/The Best 60ft/IMAGE 2568-03-05 14_26_24.jpg', images: ['assets/ships/sailing-catamarans/The Best 60ft/IMAGE 2568-03-05 14_26_24.jpg', 'assets/ships/sailing-catamarans/The Best 60ft/img_the_best_60ft_02.jpg', 'assets/ships/sailing-catamarans/The Best 60ft/img_the_best_60ft_03.jpg', 'assets/ships/sailing-catamarans/The Best 60ft/img_the_best_60ft_04.jpg', 'assets/ships/sailing-catamarans/The Best 60ft/img_the_best_60ft_05.jpg'] },
  { id: 'f102', name: 'The One Leopard 47ft', type: 'catamaran', guests: 35, length: '47 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/The One Leopard 47ft/01.jpg', images: ['assets/ships/sailing-catamarans/The One Leopard 47ft/01.jpg', 'assets/ships/sailing-catamarans/The One Leopard 47ft/02.jpg', 'assets/ships/sailing-catamarans/The One Leopard 47ft/03.jpg', 'assets/ships/sailing-catamarans/The One Leopard 47ft/04.jpg', 'assets/ships/sailing-catamarans/The One Leopard 47ft/05.jpg'] },
  { id: 'f69', name: 'Voyage 47ft', type: 'speedboat', guests: 30, length: '47 ft', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Катер', vibe_en: 'Speedboat', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private speedboat for island tours around Phuket. Professional crew, transfer, Russian-speaking guide. Explore Phuket, Phang Nga, Krabi in comfort — snorkeling, fruits, drinks, GoPro, insurance.', img: 'assets/ships/motorboats/Voyage 47ft/Thaimarine 2 No5.jpg', images: ['assets/ships/motorboats/Voyage 47ft/Thaimarine 2 No5.jpg', 'assets/ships/motorboats/Voyage 47ft/thaimarine2  No2.jpg', 'assets/ships/motorboats/Voyage 47ft/Thaimarine2 No4.jpg'] },
  { id: 'f103', name: 'Zero Stealth', type: 'catamaran', guests: 10, length: '—', speed: '—', price: 0, priceLabel: 'по запросу', vibe: 'Парусный катамаран', vibe_en: 'Sailing Catamaran', description: 'Индивидуальная морская экскурсия на Пхукете. Профессиональный экипаж, трансфер, русский гид. Исследуйте острова Пхукета, Пханг Нга, Краби в комфорте — снорклинг, фрукты, напитки, GoPro, страховка.', description_en: 'Private catamaran charter in Phuket. Professional crew, transfer, Russian-speaking guide. Spacious deck, island hopping, snorkeling, tropical fruits, drinks, GoPro, insurance.', img: 'assets/ships/sailing-catamarans/Zero Stealth/WhatsApp Image 2022-11-27 at 06.27.02.jpg', images: ['assets/ships/sailing-catamarans/Zero Stealth/WhatsApp Image 2022-11-27 at 06.27.02.jpg', 'assets/ships/sailing-catamarans/Zero Stealth/WhatsApp Image 2022-11-27 at 06.27.12.jpg', 'assets/ships/sailing-catamarans/Zero Stealth/WhatsApp Image 2022-11-27 at 06.27.48.jpg', 'assets/ships/sailing-catamarans/Zero Stealth/WhatsApp Image 2022-11-27 at 06.28.02.jpg', 'assets/ships/sailing-catamarans/Zero Stealth/WhatsApp Image 2022-11-27 at 06.28.14.jpg'] },
];

/* ---- DATA: VILLAS ---- */
function villaImages(code, count) {
  return Array.from({ length: count }, (_, i) =>
    `assets/houses/${code}/img_${String(i + 1).padStart(2, '0')}.jpg`);
}
const VILLAS = [
  { id: 'v1', name: 'Turquoise View', code: 'V-012', bedrooms: 9, bathrooms: 9, guests: 28, sqm: '800/950', area: 'Rawai', price: 'от 25 000 ฿/ночь', priceLabel: 'от 25 000 ฿', price_en: 'from 25,000 THB/night', priceLabel_en: 'from 25,000 THB', highlight: 'Огромная вилла 11 000 sqft, 9 спален, до 28 гостей. Инфинити-бассейн 8×4 м с джакузи, кинозал на 12 мест, игровая с бильярдом и пинг-понгом. Панорамный вид на море 180°. Рядом Rawai Beach и Nai Harn.', highlight_en: 'Huge 11,000 sqft villa, 9 bedrooms, up to 28 guests. Infinity pool 8×4 m with jacuzzi, 12-seat cinema, game room with billiards and ping-pong. 180° sea view. Near Rawai Beach and Nai Harn.', features: ['9 спален', 'Кинозал', 'Бассейн+джакузи', 'Вид на море', '28 гостей'], features_en: ['9 bedrooms', 'Cinema', 'Pool+Jacuzzi', 'Sea view', '28 guests'], img: 'assets/houses/V-012/img_01.jpg', images: villaImages('V-012', 42), transferIncluded: true },
  { id: 'v2', name: 'Diamond View Villa', code: 'V-009', bedrooms: 9, bathrooms: 9, guests: 28, sqm: '950/1250', area: 'Rawai', price: 'от 25 000 ฿/ночь', priceLabel: 'от 25 000 ฿', price_en: 'from 25,000 THB/night', priceLabel_en: 'from 25,000 THB', highlight: 'Просторная 9-спальная вилла с видом на море в Rawai. Инфинити-бассейн 12 м с джакузи, кинозал на 12 мест, игровая с 2 бильярдами и пинг-понгом. Обеденная зона на 16 гостей. Пешком до Rawai Beach.', highlight_en: 'Spacious 9-bedroom villa with sea view in Rawai. 12 m infinity pool with jacuzzi, 12-seat cinema, game room with 2 billiards and ping-pong. Dining for 16. Walk to Rawai Beach.', features: ['9+ спален', 'Инфинити-бассейн', 'Вид на океан', 'Полный штат', '28 гостей'], features_en: ['9+ bedrooms', 'Infinity pool', 'Ocean view', 'Full staff', '28 guests'], img: 'assets/houses/V-009/img_01.jpg', images: villaImages('V-009', 23), transferIncluded: true },
  { id: 'v3', name: 'Rock Pool Villa', code: 'V-017', bedrooms: 8, bathrooms: 8, guests: 16, sqm: '1600', area: 'Nai Harn', price: 'от 25 000 ฿/ночь', priceLabel: 'от 25 000 ฿', price_en: 'from 25,000 THB/night', priceLabel_en: 'from 25,000 THB', highlight: 'Вилла 8 спален, 1 км от пляжа Най-Харн. Бассейн 8×8 м с джакузи, SPA-зона с паровой сауной и массажными столами. Территория 1600 м² с тропическим садом. Умная акустика у бассейна, вилла-менеджер.', highlight_en: '8-bedroom villa, 1 km from Nai Harn Beach. 8×8 m pool with jacuzzi, SPA zone with steam sauna and massage tables. 1600 m² with tropical garden. Smart audio by pool, villa manager.', features: ['8 спален', 'Спа+сауна', 'Смарт-акустика', 'Тропсад', '16 гостей'], features_en: ['8 bedrooms', 'SPA+sauna', 'Smart audio', 'Tropical garden', '16 guests'], img: 'assets/houses/V-017/img_01.jpg', images: villaImages('V-017', 57), transferIncluded: false },
  { id: 'v4', name: 'Amber Villa', code: 'V-013', bedrooms: 7, bathrooms: 7, guests: 20, sqm: '450/650', area: 'Rawai', price: 'от 17 000 ฿/ночь', priceLabel: 'от 17 000 ฿', price_en: 'from 17,000 THB/night', priceLabel_en: 'from 17,000 THB', highlight: '7-спальная вилла 2015 года, до 20 гостей. Инфинити-бассейн 10×5 м с джакузи, игровая с ТВ 50", бильярдом и тренажёром. Полная горничная. В пешей доступности Nai Harn Beach.', highlight_en: '7-bedroom 2015 villa, up to 20 guests. 10×5 m infinity pool with jacuzzi, game room with 50" TV, billiards and gym. Full housekeeping. Walk to Nai Harn Beach.', features: ['7 спален', 'Бассейн 10×5', 'Тренажерный зал', 'Бильярд', '20 гостей'], features_en: ['7 bedrooms', 'Pool 10×5', 'Gym', 'Billiards', '20 guests'], img: 'assets/houses/V-013/img_01.jpg', images: villaImages('V-013', 27), transferIncluded: false },
  { id: 'v5', name: 'ONYX Villa', code: 'V-011', bedrooms: 4, bathrooms: 3, guests: 11, sqm: '220', area: 'Rawai', price: 'от 15 000 ฿/ночь', priceLabel: 'от 15 000 ฿', price_en: 'from 15,000 THB/night', priceLabel_en: 'from 15,000 THB', highlight: 'Частная вилла в чёрно-золотых тонах на краю эксклюзивного комплекса. Просторная гостиная и терраса у бассейна. Трансфер из аэропорта при бронировании от $3000.', highlight_en: 'Private villa in black and gold at the edge of an exclusive complex. Spacious living room and pool terrace. Airport transfer for bookings from $3000.', features: ['4 спальни', 'Бассейн+джакузи', 'Черно-золотой стиль', 'Кухня Smeg', '11 гостей'], features_en: ['4 bedrooms', 'Pool+Jacuzzi', 'Black & gold style', 'Smeg kitchen', '11 guests'], img: 'assets/houses/V-011/img_01.jpg', images: villaImages('V-011', 18), transferIncluded: true },
  { id: 'v6', name: 'Unique Villa Baan Bua', code: 'V-004', bedrooms: 4, bathrooms: 4, guests: 8, sqm: '125/175', area: 'Rawai / Nai Harn', price: 'от 10 000 ฿/ночь', priceLabel: 'от 10 000 ฿', price_en: 'from 10,000 THB/night', priceLabel_en: 'from 10,000 THB', highlight: 'Новая вилла в охраняемом поселке Baan Bua. Итальянская мебель, техника Smeg, Samsung. Кухня с посудомойкой, духовкой, индукционной плитой. Nai Harn в 5 мин на авто.', highlight_en: 'New villa in gated Baan Bua. Italian furniture, Smeg and Samsung appliances. Kitchen with dishwasher, oven and induction cooktop. Nai Harn 5 min by car.', features: ['4 спальни', '4 ванные', 'Итал. мебель', 'Smeg + Samsung', 'Rawai / Nai Harn', '8 гостей'], features_en: ['4 bedrooms', '4 bathrooms', 'Italian furniture', 'Smeg + Samsung', 'Rawai / Nai Harn', '8 guests'], img: 'assets/houses/V-004/img_01.jpg', images: villaImages('V-004', 14), transferIncluded: false },
  { id: 'v7', name: 'Topaz Villa', code: 'V-010', bedrooms: 5, bathrooms: 4, guests: 13, sqm: '350/550', area: 'Rawai', price: 'от 17 000 ฿/ночь', priceLabel: 'от 17 000 ฿', price_en: 'from 17,000 THB/night', priceLabel_en: 'from 17,000 THB', highlight: '5-спальная вилла рядом с лучшим пляжем Пхукета. Бассейн 8×4 м с джакузи, rooftop-терраса с видом на закат. Гостиная с ТВ 50", обеденная зона на 10 человек.', highlight_en: '5-bedroom villa next to Phuket\'s best beach. 8×4 m pool with jacuzzi, rooftop terrace with sunset view. Living room with 50" TV, dining for 10.', features: ['5 спален', 'Бассейн 8×4', 'Rooftop', 'Mountain view', '13 гостей'], features_en: ['5 bedrooms', 'Pool 8×4', 'Rooftop', 'Mountain view', '13 guests'], img: 'assets/houses/V-010/img_01.jpg', images: villaImages('V-010', 26), transferIncluded: false },
  { id: 'v8', name: 'GoldChariot Villa', code: 'V-014', bedrooms: 4, bathrooms: 4, guests: 8, sqm: '220', area: 'Bang Tao', price: 'от 15 000 ฿/ночь', priceLabel: 'от 15 000 ฿', price_en: 'from 15,000 THB/night', priceLabel_en: 'from 15,000 THB', highlight: 'Роскошная 4-спальная вилла в центре Банг Тао. Панорамные окна, современная кухня, приватный бассейн. 5 мин до Boat Avenue и пляжа.', highlight_en: 'Luxury 4-bedroom villa in central Bang Tao. Panoramic windows, modern kitchen, private pool. 5 min to Boat Avenue and beach.', features: ['4 спальни', 'Sea view', 'Центр Банг Тао', 'Boat Avenue', '8 гостей'], features_en: ['4 bedrooms', 'Sea view', 'Central Bang Tao', 'Boat Avenue', '8 guests'], img: 'assets/houses/V-014/img_01.jpg', images: villaImages('V-014', 21), transferIncluded: false },
  { id: 'v9', name: 'Khanitha Private Villas Bangtao', code: 'V-015', bedrooms: 3, bathrooms: 4, guests: 8, sqm: '280', area: 'Bang Tao', price: 'от 12 000 ฿/ночь', priceLabel: 'от 12 000 ฿', price_en: 'from 12,000 THB/night', priceLabel_en: 'from 12,000 THB', highlight: 'Двухэтажная вилла с 3 спальнями и 4 ванными. Светлая гостиная, кухня, приватный бассейн, терраса, парковка. Рядом пляж Бангтао и инфраструктура.', highlight_en: 'Two-story villa with 3 bedrooms and 4 bathrooms. Bright living room, kitchen, private pool, terrace, parking. Near Bang Tao beach and amenities.', features: ['3 спальни', '4 ванные', 'Garden view', 'Бассейн', '8 гостей'], features_en: ['3 bedrooms', '4 bathrooms', 'Garden view', 'Pool', '8 guests'], img: 'assets/houses/V-015/img_01.jpg', images: villaImages('V-015', 37), transferIncluded: false },
  { id: 'v10', name: 'Laguna Park 2', code: 'V-016', bedrooms: 5, bathrooms: 5, guests: 10, sqm: '500', area: 'Bang Tao', price: 'от 19 000 ฿/ночь', priceLabel: 'от 19 000 ฿', price_en: 'from 19,000 THB/night', priceLabel_en: 'from 19,000 THB', highlight: '5-спальная вилла 2019 года в Laguna. Sea view, приватный бассейн, 3 уровня. Разрешены воспитанные питомцы. Идеально для 6–8 человек.', highlight_en: '5-bedroom 2019 villa in Laguna. Sea view, private pool, 3 levels. Well-behaved pets allowed. Ideal for 6–8 guests.', features: ['5 спален', 'Sea view', '2019', 'Laguna', '10 гостей'], features_en: ['5 bedrooms', 'Sea view', '2019', 'Laguna', '10 guests'], img: 'assets/houses/V-016/img_01.jpg', images: villaImages('V-016', 25), transferIncluded: false },
  { id: 'v11', name: 'The Regent Bang Tao', code: 'V-008', bedrooms: 2, bathrooms: 2, guests: 6, sqm: '140', area: 'Bang Tao', price: 'входит в пакет', priceLabel: 'входит в пакет', price_en: 'included in package', priceLabel_en: 'included in package', highlight: 'Люксовые апартаменты 140 м² в премиум-комплексе The Regent в сердце Банг Тао. 2 спальни, полное обслуживание отеля, бассейн. 2 минуты пешком до Boat Avenue и 10 минут до пляжа Laguna.', highlight_en: 'Luxury 140 m² apartments in the premium The Regent complex in the heart of Bang Tao. 2 bedrooms, full hotel service, pool. 2 min walk to Boat Avenue and 10 min to Laguna beach.', features: ['2 спальни', '140 м²', 'Банг Тао', 'Boat Avenue', '6 гостей'], features_en: ['2 bedrooms', '140 m²', 'Bang Tao', 'Boat Avenue', '6 guests'], img: 'assets/houses/V-008/img_01.jpg', images: [...Array.from({length: 7}, (_, i) => `assets/houses/V-008/img_${String(i+1).padStart(2,'0')}.jpg`), ...Array.from({length: 20}, (_, i) => `assets/houses/V-008/img_${String(i+9).padStart(2,'0')}.jpg`)], transferIncluded: false },
];

/* ---- DATA: LOCATIONS (Excursion Tours) — все туры с thai-charters.com ---- */
let LOCATIONS = [];

/** Загрузка превью туров для главной (9 туров, ~20 KB вместо 820 KB) */
async function fetchToursPreview() {
  const container = document.getElementById('locations-grid');
  try {
    if (window.location.protocol === 'file:') {
      console.warn('AZANOV: fetch blocked on file://. Use a local server.');
      if (container) {
        container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">${typeof _t === 'function' ? _t('tours.errorLocalServer') : 'Блок туров требует локальный сервер.'}</div>`;
      }
      return;
    }
    const cb = window.AZANOV_VERSION || Math.random().toString(36).substring(7);
    const response = await fetch(`assets/tours/tours_preview.json?v=${cb}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    LOCATIONS = data.map(t => ({
      id: t.id,
      name: t.name,
      name_en: t.name_en || t.name,
      desc: t.desc || '',
      desc_en: t.desc_en || '',
      tag: t.tag || 'Tour',
      metaLabel: getTourMetaLabel({ title: t.name, description: t.desc, full_text: '', details_html: '' }),
      img: t.img,
      featured: false,
      priceLabel: t.priceLabel || ''
    }));
    renderLocations(LOCATIONS, 9);
  } catch (error) {
    console.error('Error fetching tours preview:', error);
    if (container) {
      container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted);">${typeof _t === 'function' ? _t('tours.errorLoadFailed') : 'Не удалось загрузить туры'}</div>`;
    }
  }
}

function parseTourDurationDays(tour) {
  if (!tour) return 1;
  const title = (tour.title || tour.name || '').toLowerCase();
  const desc = (tour.description || tour.desc || '').toLowerCase();
  const fullText = (tour.full_text || '').toLowerCase();
  const text = title + ' ' + desc + ' ' + fullText;
  if (/\d+\s*дн[яе]\/?\s*1\s*ночь|2дня|2\s*дня/.test(text)) return 2;
  if (/1\s*день|-\s*1\s*день/.test(text)) return 1;
  return 1;
}

function parseTourMaxPersons(tour) {
  if (!tour) return null;
  const text = (tour.full_text || tour.details_html || '').replace(/<[^>]+>/g, ' ');
  const m1 = text.match(/(?:Максимально|макс\.?)\s*(\d+)\s*(?:человек|перс)/i);
  if (m1) return parseInt(m1[1], 10);
  const m2 = text.match(/(?:Группа\s+)?до\s*(\d+)\s*человек/i);
  if (m2) return parseInt(m2[1], 10);
  return null;
}

function getTourMetaLabel(tour) {
  const maxPersons = parseTourMaxPersons(tour);
  if (maxPersons != null) return typeof _t === 'function' ? _t('tours.metaMaxPersons').replace('{n}', maxPersons) : `макс. ${maxPersons} перс`;
  const days = parseTourDurationDays(tour);
  if (typeof _t === 'function') return days === 2 ? _t('tours.metaDays2') : _t('tours.metaDay');
  return days === 2 ? '2 дня' : '1 день';
}

window.openLeadFormFromTour = function (tourId) {
  const item = (typeof LOCATIONS !== 'undefined' && LOCATIONS) ? LOCATIONS.find(l => l.id === tourId) : null;
  if (item && typeof window.openLeadForm === 'function') {
    window.openLeadForm(null, null, null, null, { item });
  }
};

async function fetchTours(skipRender = false) {
  const container = document.getElementById('locations-grid');
  try {
    // Check if running via file:// protocol (CORS will block fetch)
    if (window.location.protocol === 'file:') {
      console.warn('AZANOV WARNING: fetch() is blocked on file:// protocol. Please use a local server (e.g. Live Server, VS Code Go Live, or npx serve) to see the tours.');
      if (container) {
        const title = typeof _t === 'function' ? _t('tours.errorLocalServer') : 'Блок туров требует локальный сервер.';
        const body = typeof _t === 'function' ? _t('tours.errorLocalServerLong') : 'Браузер блокирует загрузку данных при прямом открытии HTML-файла. Пожалуйста, запустите проект через Live Server или localhost.';
        container.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted); background: rgba(0,0,0,0.2); border-radius: var(--radius-md);">
            <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
            <div class="h4" style="margin-bottom: 0.5rem; color: var(--text);">${title}</div>
            <p style="max-width: 500px; margin: 0 auto; line-height: 1.5;">${body}</p>
          </div>
        `;
      }
      return;
    }

    const cb = window.AZANOV_VERSION || Math.random().toString(36).substring(7);
    const response = await fetch(`assets/tours/tours_index.json?v=${cb}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    LOCATIONS = data.map(tour => {
      // Correct image path: assets/tours/ + tour.id + / + tour.local_images[0]
      const basePath = `assets/tours/${tour.id}/`;
      const durationDays = parseTourDurationDays(tour);
      const maxPersons = parseTourMaxPersons(tour);
      const metaLabel = getTourMetaLabel(tour);
      return {
        id: tour.id,
        name: tour.title,
        name_en: tour.title_en || tour.title,
        desc: tour.description,
        desc_en: tour.description_en || tour.description,
        tag: tour.sku || 'Tour',
        durationDays,
        maxPersons,
        metaLabel,
        img: basePath + tour.local_images[0],
        featured: tour.price > 3000,
        priceLabel: tour.price,
        rawPrice: tour.price,
        included: tour.included || [],
        included_en: tour.included_en || [],
        images: tour.local_images.map(img => basePath + img),
        itinerary: tour.itinerary || [],
        itinerary_en: tour.itinerary_en || [],
        what_to_bring: tour.what_to_bring || [],
        what_to_bring_en: tour.what_to_bring_en || [],
        cancellation: tour.cancellation || [],
        cancellation_en: tour.cancellation_en || [],
        details_html: tour.details_html || ''
      };
    });
    if (!skipRender) renderLocations();
  } catch (error) {
    console.error('Error fetching tours:', error);
    if (container) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">Не удалось загрузить туры</div>
          <p>${error.message}</p>
        </div>
      `;
    }
  }
}

/* ---- DATA: SERVICES ---- */
const SERVICES = [
  { icon: 'plane-takeoff', name: 'VIP Fast Track', name_en: 'VIP Fast Track', desc: 'Зеленый коридор, встреча у трапа', desc_en: 'Green Lane, meet at aircraft door', long: 'Персональное сопровождение от выхода из самолёта: встреча у трапа, приоритетное прохождение паспортного и таможенного контроля без очередей, VIP-трансфер на премиальном авто. Идеально для больших групп и семей с детьми. Весь процесс занимает 10–15 минут.', long_en: 'Personal escort from aircraft exit: meet at door, priority passport and customs without queues, VIP transfer in premium car. Ideal for large groups and families. Whole process takes 10–15 minutes.' },
  { icon: 'utensils', name: 'Личный шеф-повар', name_en: 'Private Chef', desc: 'Тайская и международная кухня', desc_en: 'Thai and international cuisine', long: 'Повар специализируется на тайской и международной кухне, готовит завтраки, обеды и ужины по вашему желанию. Возможны барбекю в зоне виллы, ужины на веранде с видом на море, обеды на борту яхты из свежепойманной рыбы.', long_en: 'Chef specializes in Thai and international cuisine, prepares breakfasts, lunches and dinners to your taste. BBQ at villa, dinners on terrace with sea view, yacht lunches from fresh catch.' },
  { icon: 'ship', name: 'Аренда яхт и катеров', name_en: 'Yacht & Boat Charter', desc: 'Весь флот под ваш запрос', desc_en: 'Full fleet on request', long: 'От спидботов до суперяхт — весь флот Azanov Retreat доступен под ваш маршрут. Включены трансфер до пирса, русский гид, экипаж, фрукты и напитки, снорклинг, страховка. Wi-Fi и GoPro на любой лодке.', long_en: 'From speedboats to superyachts — full Azanov Retreat fleet for your route. Transfer to pier, guide, crew, fruits and drinks, snorkeling, insurance included. Wi-Fi and GoPro on every boat.' },
  { icon: 'car', name: 'Авто и байки', name_en: 'Cars & Bikes', desc: 'Премиальный транспорт у виллы', desc_en: 'Premium transport at villa', long: 'Премиальные автомобили и байки у порога виллы. Аренда на день или весь период. Идеально для самостоятельных поездок по острову, походов в рестораны и пляжные клубы.', long_en: 'Premium cars and bikes at your villa doorstep. Rent by day or full period. Ideal for island trips, restaurants and beach clubs.' },
  { icon: 'camera', name: 'Фотограф', name_en: 'Photographer', desc: 'Проф. съёмка + дрон по запросу', desc_en: 'Pro photo + drone on request', long: 'Профессиональные съёмки на вилле, яхте или в локациях Пхукета. Дрон для панорам и аэросъёмки. В премиальные пакеты уже включена работа фотографа; для других туров — доступно как отдельная услуга.', long_en: 'Professional shoots at villa, yacht or Phuket locations. Drone for panoramas and aerial. Included in premium packages; available as add-on for other tours.' },
  { icon: 'compass', name: 'Русский гид-эксперт', name_en: 'Russian-Speaking Guide', desc: 'Местный житель, инсайдер', desc_en: 'Local resident, insider', long: 'Гид — местный житель с многолетним опытом на Пхукете. Планирует эксклюзивные маршруты, бронирует лучшие столы в ресторанах и Beach Clubs, решает любые бытовые вопросы. Ваш доверенный сопровождающий на острове.', long_en: 'Guide is a long-time Phuket resident. Plans exclusive routes, books best tables and Beach Clubs, solves any practical issues. Your trusted island companion.' },
  { icon: 'hand', name: 'Массаж на вилле', name_en: 'Villa Massage', desc: 'SPA и велнес-программы', desc_en: 'SPA and wellness programs', long: 'Тайский массаж, SPA-процедуры и велнес-программы прямо на вилле. Мастер приезжает к вам — никаких поездок. Расслабление после морской прогулки или перед ужином.', long_en: 'Thai massage, SPA and wellness at the villa. Therapist comes to you — no travel. Relax after a sea trip or before dinner.' },
  { icon: 'shield-check', name: 'Страховка и безопасность', name_en: 'Insurance & Safety', desc: 'Медицинская страховка в каждом туре', desc_en: 'Medical insurance in every tour', long: 'Медицинская страховка включена в каждый морской тур и пакетные программы. Полное покрытие на время пребывания. Дополнительно — консультации по безопасности и экстренным контактам.', long_en: 'Medical insurance included in every sea tour and package. Full coverage for your stay. Plus safety consultations and emergency contacts.' },
  { icon: 'wifi', name: 'Wi-Fi + GoPro', desc: 'Связь и контент на борту', desc_en: 'Connectivity and content on board', long: 'На всех судах — высокоскоростной Wi-Fi и зарядки для гаджетов. GoPro для подводных съёмок включена в аренду. Снимайте моменты, делитесь в соцсетях в реальном времени.', long_en: 'All vessels have high-speed Wi-Fi and charging. GoPro for underwater shots included. Capture moments, share in real time.' },
  { icon: 'key', name: 'Консьерж 24/7', desc: 'Решение любых вопросов мгновенно', desc_en: 'Instant solutions for any request', long: 'Ваш личный ассистент на острове круглые сутки. Бронирование столов, вызов вертолёта, поиск редких вещей — для него нет невыполнимых задач. WhatsApp и Telegram: ответ в течение 15 минут.', long_en: 'Your personal island assistant 24/7. Booking tables, calling a helicopter, sourcing rare items — no request too big. WhatsApp and Telegram: reply within 15 minutes.' },
];

/* ---- DATA: FAQ ---- */
const FAQ = {
  concept: {
    icon: 'sparkles',
    label: 'Концепция A to Z',
    labelLine1: 'Концепция',
    labelLine2: 'A to Z',
    items: [
      { q: 'Что именно означает сервис «от А до Я» в рамках Azanov Retreat?', q_en: 'What does the A-to-Z service mean at Azanov Retreat?', a: 'Это комплексное сопровождение от встречи в аэропорту (включая VIP Fast Track) до посадки на самолет при вылете. Команда берёт на себя всё: подбор маршрутов, аренду яхт и авто, питание, безопасность и развлечения.', a_en: 'Full escort from airport meet (including VIP Fast Track) to boarding on departure. The team handles everything: routes, yacht and car rental, meals, safety and entertainment.' },
      { q: 'Почему минимальный срок бронирования — 5 ночей?', q_en: 'Why is the minimum booking 5 nights?', a: 'Программа создана для полного погружения: 5 дней на вилле с персоналом + отдельный день морского путешествия на приватной яхте. Меньший срок не даёт почувствовать ритм острова без спешки.', a_en: 'The program is designed for full immersion: 5 days at the villa with staff + a separate sea day on a private yacht. Shorter stays don\'t let you feel the island rhythm.' },
      { q: 'Что входит в понятие «всё включено» для групповых ретритов?', q_en: 'What is included in group retreats?', a: 'Проживание на luxury-вилле, услуги личного шеф-повара, целый день на приватной яхте с обедом на борту, работа личного фотографа, все трансферы по маршруту, ежедневная уборка.', a_en: 'Luxury villa stay, personal chef, full day on private yacht with onboard lunch, personal photographer, all transfers, daily housekeeping.' },
      { q: 'Есть ли скрытые платежи, о которых нужно знать заранее?', q_en: 'Are there any hidden fees?', a: 'Нет скрытых платежей — все основные услуги включены в фиксированную стоимость пакета. Единственное исключение: электричество на некоторых виллах оплачивается отдельно по счётчику (5.5–7 бат/кВт⋅ч).', a_en: 'No hidden fees — all main services are in the fixed package price. Exception: electricity on some villas is metered separately (5.5–7 THB/kWh).' },
      { q: 'Чем Azanov Retreat отличается от стандартных VIP-экскурсий?', q_en: 'How does Azanov Retreat differ from standard VIP tours?', a: 'Полная приватность и отсутствие толпы. Стандартные операторы везут группы в автобусах. У нас — личный гид, эксклюзивные маршруты, возможность менять планы на ходу, Wi-Fi, зарядки и GoPro на любой лодке.', a_en: 'Full privacy and no crowds. Standard operators bus groups around. We offer a personal guide, exclusive routes, flexibility to change plans, Wi-Fi, charging and GoPro on every boat.' },
    ]
  },
  villas: {
    icon: 'home',
    label: 'Виллы & Проживание',
    labelLine1: 'Виллы &',
    labelLine2: 'Проживание',
    items: [
      { q: 'Какая вилла лучше всего подходит для большой группы (до 28 человек)?', q_en: 'Which villa best suits a large group (up to 28)?', a: 'Turquoise View (V-012) — 9 спален, 1000+ м², кинозал на 12 мест, инфинити-бассейн с джакузи и обеденная зона на 16 человек с видом на море. Также подходит Diamond View Villa.', a_en: 'Turquoise View (V-012) — 9 bedrooms, 1000+ m², 12-seat cinema, infinity pool with jacuzzi, dining for 16 with sea view. Diamond View Villa also works.' },
      { q: 'Что уникально в дизайне виллы ONYX?', q_en: 'What is unique about ONYX villa design?', a: 'Черно-золотой интерьер с тропическим садом, бассейн 8×4 м с джакузи, кухня Smeg, закрытая sala и полная приватность для компании до 11 человек.', a_en: 'Black and gold interior with tropical garden, 8×4 m pool with jacuzzi, Smeg kitchen, enclosed sala, full privacy for up to 11.' },
      { q: 'Какая техника установлена на виллах?', q_en: 'What appliances are in the villas?', a: 'Все виллы оснащены западными кухнями с посудомоечными машинами, духовками и полным набором посуды. На виллах Baan Bua и ONYX — премиальная техника Smeg.', a_en: 'All villas have Western kitchens with dishwashers, ovens and full cookware. Baan Bua and ONYX have premium Smeg appliances.' },
      { q: 'Входит ли персонал (горничные, повара) в стоимость проживания?', q_en: 'Is staff (housekeeping, chefs) included?', a: 'Ежедневная уборка и услуги горничной включены в большинство вилл. Личный шеф-повар включён в премиальные пакеты (Regent Bang Tao, Laguna Private Haven). На других виллах — по запросу за доп. плату.', a_en: 'Daily housekeeping is included at most villas. Personal chef is in premium packages (Regent Bang Tao, Laguna Private Haven). On other villas — on request for extra.' },
      { q: 'Нужно ли отдельно оплачивать коммунальные услуги?', q_en: 'Are utilities paid separately?', a: 'Вода и обслуживание бассейна, а также высокоскоростной Wi-Fi включены. Электричество на большинстве вилл оплачивается по счётчику (5.5–7 ฿/кВт⋅ч).', a_en: 'Water, pool maintenance and high-speed Wi-Fi are included. Electricity at most villas is metered (5.5–7 ฿/kWh).' },
    ]
  },
  fleet: {
    icon: 'ship',
    label: 'Флот & Море',
    labelLine1: 'Флот &',
    labelLine2: 'Море',
    items: [
      { q: 'Какие типы судов доступны в каталоге?', q_en: 'What vessel types are available?', a: 'Спидботы (от 12 990 ฿), рыболовные катера, моторные яхты, парусные яхты, катамараны и суперяхты — вплоть до Beach Club Yona (150 ft, от 2 000 000 ฿).', a_en: 'Speedboats (from 12,990 ฿), fishing boats, motor yachts, sailing yachts, catamarans and superyachts — up to Beach Club Yona (150 ft, from 2,000,000 ฿).' },
      { q: 'Что включено в стоимость аренды лодки?', q_en: 'What is included in boat charter?', a: 'Трансфер от виллы/отеля до пирса и обратно, профессиональный русский гид, опытный экипаж, тропические фрукты, напитки (алкогольные и безалкогольные), оборудование для снорклинга, медицинская страховка.', a_en: 'Transfer villa/hotel to pier and back, professional Russian-speaking guide, experienced crew, tropical fruits, drinks (alcoholic and soft), snorkeling gear, medical insurance.' },
      { q: 'Есть ли на борту Wi-Fi и возможность зарядить гаджеты?', q_en: 'Is there Wi-Fi and charging on board?', a: 'Да. На всех судах предусмотрены Wi-Fi (высокоскоростной) и зарядные устройства для любых гаджетов. Также предоставляется камера GoPro для подводных съёмок.', a_en: 'Yes. All vessels have high-speed Wi-Fi and charging. GoPro for underwater shots is also provided.' },
      { q: 'Можно ли заказать профессионального фотографа на яхту?', q_en: 'Can I book a professional photographer for the yacht?', a: 'Да, в премиальные пакеты (Regent Bang Tao, Laguna, Rock Pool, Quick Phuket) уже включена работа профессионального фотографа. Для других туров — доступно как отдельная услуга.', a_en: 'Yes. Premium packages (Regent Bang Tao, Laguna, Rock Pool, Quick Phuket) include a professional photographer. For other tours — available as add-on.' },
      { q: 'Можно ли организовать барбекю из свежепойманной рыбы на острове?', q_en: 'Can we have a BBQ from fresh-caught fish on an island?', a: 'Да! Во время троллинговой рыбалки наш повар может приготовить сашими из тунца прямо на борту или устроить барбекю на необитаемом острове из свежепойманной рыбы.', a_en: 'Yes! During trolling fishing our chef can make tuna sashimi on board or arrange a BBQ on a deserted island from fresh catch.' },
    ]
  },
  logistics: {
    icon: 'plane-takeoff',
    label: 'VIP-логистика',
    labelLine1: 'VIP-',
    labelLine2: 'логистика',
    items: [
      { q: 'Что такое VIP Fast Track (Зеленый коридор) и как он работает?', q_en: 'What is VIP Fast Track (Green Lane) and how does it work?', a: 'Персональное сопровождение от выхода из самолёта: встреча у трапа, приоритетное прохождение паспортного и таможенного контроля без очередей, VIP-трансфер на премиальном авто. Идеально для больших групп и семей с детьми.', a_en: 'Personal escort from aircraft exit: meet at door, priority passport and customs without queues, VIP transfer in premium car. Ideal for large groups and families.' },
      { q: 'Как организован трансфер из аэропорта?', q_en: 'How is airport transfer organized?', a: 'Личный трансфер включён во все пакеты Azanov Retreat. Для вилл ONYX и Diamond View он включён при бронировании на сумму от $3 000. По маршруту аэропорт ↔ вилла ↔ пирс ↔ аэропорт.', a_en: 'Private transfer is included in all Azanov Retreat packages. For ONYX and Diamond View villas — included for bookings from $3,000. Route: airport ↔ villa ↔ pier ↔ airport.' },
      { q: 'Что делает русский гид-эксперт?', q_en: 'What does the Russian-speaking guide do?', a: 'Гид — местный житель с многолетним опытом на Пхукете. Он планирует эксклюзивные маршруты, бронирует лучшие столы в ресторанах и Beach Clubs, решает любые бытовые вопросы и является вашим доверенным сопровождающим.', a_en: 'The guide is a long-time Phuket resident. Plans exclusive routes, books best tables at restaurants and Beach Clubs, solves any practical issues — your trusted island companion.' },
      { q: 'Как устроено питание с личным шеф-поваром?', q_en: 'How does dining with a personal chef work?', a: 'Повар специализируется на тайской и международной кухне, готовит завтраки, обеды и ужины по вашему желанию. Также возможно приготовление барбекю в зоне виллы или ужина на открытой веранде с видом на море.', a_en: 'Chef specializes in Thai and international cuisine, prepares breakfasts, lunches and dinners to your taste. BBQ at villa or dinner on terrace with sea view also possible.' },
      { q: 'Как организован Fast Track для большой группы?', q_en: 'How is Fast Track organized for large groups?', a: 'Наш персонал встречает всю группу у выхода из самолёта и сопровождает через VIP-коридор. Никаких очередей, никакой суеты — весь процесс занимает 10–15 минут. Для групп от 10 человек — групповой бас-премиум.', a_en: 'Our staff meets the whole group at the aircraft exit and escorts through the VIP corridor. No queues, no hassle — the whole process takes 10–15 minutes. For groups of 10+ — premium group bus.' },
    ]
  },
  booking: {
    icon: 'calendar-check',
    label: 'Бронирование',
    labelLine1: 'Брони',
    labelLine2: 'рование',
    items: [
      { q: 'Включена ли медицинская страховка в пакеты?', q_en: 'Is medical insurance included in packages?', a: 'Да, медицинская страховка включена в каждый морской тур и пакетные программы Azanov Retreat.', a_en: 'Yes, medical insurance is included in every sea tour and Azanov Retreat package.' },
      { q: 'Каков размер страхового депозита при заезде на виллу?', q_en: 'What is the security deposit for villa check-in?', a: 'Размер депозита зависит от объекта и согласовывается индивидуально. Для виллы Turquoise View при проведении мероприятий или съёмок требуется дополнительный залог за сохранность имущества.', a_en: 'Deposit size depends on the property and is agreed individually. For Turquoise View villa, events or filming require an extra deposit for property safety.' },
      { q: 'Разрешено ли проживание с домашними животными?', q_en: 'Are pets allowed?', a: 'На большинстве вилл — запрещено. Исключения: Topaz Villa и Laguna Park 2 — по предварительному запросу.', a_en: 'Not allowed at most villas. Exceptions: Topaz Villa and Laguna Park 2 — by prior request.' },
      { q: 'Каковы условия отмены бронирования?', q_en: 'What are the cancellation terms?', a: 'Условия отмены согласовываются индивидуально при бронировании. Рекомендуем уточнять у консьержа при подаче заявки.', a_en: 'Cancellation terms are agreed individually at booking. We recommend confirming with the concierge when submitting a request.' },
      { q: 'Как связаться с консьерж-службой в экстренной ситуации?', q_en: 'How to reach the concierge in an emergency?', a: 'Консьерж-служба Azanov Retreat работает 24/7. WhatsApp: +66 6-3541-2949 (Тахиржан). Прямой контакт (Амин Азанов): +7 913 128-00-88. Telegram: @AzanovRetreat (t.me/AzanovRetreat)', a_en: 'Azanov Retreat concierge is available 24/7. WhatsApp: +66 6-3541-2949. Direct: +7 913 128-00-88. Telegram: @AzanovRetreat (t.me/AzanovRetreat)' },
    ]
  },
};

/* ---- DATA: AZBUKA ---- */
const AZBUKA = [
  { letter: 'А', icon: 'shield-check', title: 'Авансы', short: 'Никаких скрытых платежей', long: 'В Azanov Retreat мы называем цену единожды. Никаких доплат за топливо, уборку, воду, трансферы или снорклинг-маски. Полная прозрачность от первой переписки до вашего вылета.' },
  { letter: 'Б', icon: 'file-text', title: 'Бюрократия', short: 'Берем на себя', long: 'Мы оформляем все страховки, контракты и разрешения на морские выходы самостоятельно. Вы не тратите ни минуты своего драгоценного отпуска на документы.' },
  { letter: 'В', icon: 'gem', title: 'Всё включено', short: 'Без компромиссов', long: 'Наша концепция All-Inclusive — это полное покрытие всех базовых и премиальных нужд. Фрукты, напитки, оборудование, гид, трансферы и страховка — всё это уже включено в чек.' },
  { letter: 'Г', icon: 'compass', title: 'Гид-эксперт', short: 'Свой человек на Пхукете', long: 'Русскоговорящий гид — местный житель. Он не читает лекции по бумажке, а показывает Пхукет так, как показал бы лучшим друзьям. Только проверенные локации.' },
  { letter: 'Д', icon: 'clock', title: 'Доступность', short: 'Связь 24/7', long: 'Наш консьерж на связи с вами круглые сутки. Срочно захотели массаж на виллу в 2 часа ночи или изменить маршрут яхты на завтра? Достаточно одного сообщения в WhatsApp.' },
  { letter: 'Е', icon: 'utensils', title: 'Еда и напитки', short: 'Шедевр на борту', long: 'Обеды на яхтах, пикники на уединенных пляжах или личный повар на вилле. В пакетные туры включено питание уровня топовых ресторанов.' },
  { letter: 'Ё', icon: 'sparkles', title: 'Ёмкость услуг', short: 'От трансфера до виллы', long: 'Мы закрываем 100% потребностей в роскошном отдыхе. Виллы, яхты, автомобили и сервис мирового уровня.' },
  { letter: 'Ж', icon: 'heart', title: 'Желания', short: 'Исполняем мечты', long: 'Мы стерли границу между желанием и реальностью. Ваша задача — отдыхать, наша — предугадывать, что сделает ваш день еще более совершенным.' },
  { letter: 'З', icon: 'sun', title: 'Закаты', short: 'Лучший вид', long: 'С палубы роскошной яхты или инфинити-бассейна виллы — мы знаем точки, откуда открываются самые потрясающие виды на уходящее солнце.' },
  { letter: 'И', icon: 'user-check', title: 'Индивидуальность', short: 'Полный кастом', long: 'У нас нет шаблонных решений. Каждый маршрут, каждая услуга адаптируется под ваши интересы, ритм жизни и пожелания.' },
  { letter: 'К', icon: 'key', title: 'Консьерж', short: 'Решение любых вопросов', long: 'Ваш личный ассистент на острове. Бронирование лучших столов, вызов вертолета, поиск редких вещей — для него нет невыполнимых задач.' },
  { letter: 'Л', icon: 'map', title: 'Локации', short: 'Секретные острова', long: 'Мы знаем пляжи без туристов, скрытые лагуны и нетронутые коралловые рифы. Вы увидите Таиланд, о котором другие только мечтают.' },
  { letter: 'М', icon: 'music', title: 'Музыка', short: 'Твоя атмосфера', long: 'Мощные аудиосистемы на виллах и яхтах, караоке и DJ по запросу. Музыкальное сопровождение вашего отдыха всегда на высшем уровне.' },
  { letter: 'Н', icon: 'bed', title: 'Ночлег', short: 'Сон королей', long: 'Премиальное постельное белье, ортопедические матрасы, идеальная тишина и климат-контроль — на наших виллах ваш сон ничто не потревожит.' },
  { letter: 'О', icon: 'anchor', title: 'Острова', short: 'Симфония Андамана', long: 'Пи-Пи, Симиланы, Рача, Джеймс Бонд и десятки других островов доступны вам на скорости наших яхт и спидботов.' },
  { letter: 'П', icon: 'lock', title: 'Приватность', short: 'Абсолютное спокойствие', long: 'Наши виллы изолированы от посторонних глаз. Никаких чужих людей, только ваша компания и море.' },
  { letter: 'Р', icon: 'leaf', title: 'Релакс', short: 'Только отдых', long: 'Spa-процедуры, тайский массаж прямо на вилле, медитации под шум волн. Полное восстановление сил.' },
  { letter: 'С', icon: 'car', title: 'Скорость', short: 'VIP Fast Track', long: 'Зеленый коридор в аэропорту, лучшие спидботы и премиум-трансферы. Мы экономим ваше время для отдыха.' },
  { letter: 'Т', icon: 'plane-takeoff', title: 'Трансфер', short: 'От двери до борту', long: 'VIP-трансферы включены во все наши пакеты. Встречаем у трапа самолета и довозим прямо до виллы или пирса.' },
  { letter: 'У', icon: 'smile', title: 'Улыбки', short: 'Искренний сервис', long: 'Тайское гостеприимство в сочетании с европейскими стандартами сервиса. Искренняя забота о каждом госте.' },
  { letter: 'Ф', icon: 'camera', title: 'Фотограф', short: 'Сохраняем моменты', long: 'Профессиональные съемки, дроны, подводная камера GoPro — всё для того, чтобы ваш отдых остался не только в памяти, но и на потрясающих кадрах.' },
  { letter: 'Х', icon: 'star', title: 'Харизма', short: 'Яркие впечатления', long: 'Наш экипаж и гиды — это люди с невероятной харизмой, которые превращают морскую прогулку в истинный праздник.' },
  { letter: 'Ц', icon: 'tag', title: 'Ценность', short: 'Выше стоимости', long: 'Мы не гонимся за дешевизной, мы создаем ценность. Эмоции и уровень комфорта, которые вы получаете, многократно превосходят ожидания.' },
  { letter: 'Ч', icon: 'watch', title: 'Часы', short: 'Гибкий график', long: 'Мы подстраиваем расписание под вас. Захотели поспать подольше? Мы просто сдвинем выход в море.' },
  { letter: 'Ш', icon: 'chef-hat', title: 'Шеф-повар', short: 'Кулинарное искусство', long: 'Личный повар на вилле приготовит блюда любой кухни мира. От свежайшего сашими на борту яхты до изысканного ужина на веранде.' },
  { letter: 'Щ', icon: 'sun-dim', title: 'Щедрость', short: 'Безлимитные опции', long: 'Мы не считаем каждую бутылку воды или километр пути. Включено достаточно для комфортного отдыха всей группы.' },
  { letter: 'Э', icon: 'zap', title: 'Эмоции', short: 'То, ради чего', long: 'Все эти виллы и яхты — лишь инструменты. Наша главная цель — ваши яркие эмоции, которые останутся с вами навсегда.' },
  { letter: 'Ю', icon: 'check-circle', title: 'Ювелирная точность', short: 'В каждой детали', long: 'Тщательное планирование, идеальный тайминг и безупречное исполнение. Мы не допускаем ошибок.' },
  { letter: 'Я', icon: 'ship', title: 'Яхты', short: 'Лучший флот', long: 'От скоростных катеров до плавучего клуба Beach Club Yona. Наш флот — гордость Azanov Retreat.' }
];

const AZBUKA_EN = [
  { letter: 'A', icon: 'shield-check', title: 'All-Inclusive', short: 'No hidden fees, ever', long: 'At Azanov Retreat we name the price once. Fuel, cleaning, water, transfers, snorkeling gear — all covered from first message to your departure.' },
  { letter: 'B', icon: 'file-text', title: 'Bureaucracy-Free', short: 'We handle every document', long: 'Insurance, contracts, and marine permits are our problem, not yours. Not a single minute of your holiday goes to paperwork.' },
  { letter: 'C', icon: 'key', title: 'Concierge', short: '24/7 personal assistant', long: 'Your personal island assistant around the clock. Book the best tables, call a helicopter, source rare items — no request is too big. WhatsApp reply within 15 minutes.' },
  { letter: 'D', icon: 'map', title: 'Destinations', short: 'Secret islands await', long: 'We know beaches with no tourists, hidden lagoons and untouched coral reefs. You will see Thailand others only dream about.' },
  { letter: 'E', icon: 'lock', title: 'Exclusivity', short: 'Your group, your island', long: 'Full privacy and zero crowds. Standard operators pack tourists into buses. We offer a private guide, exclusive routes, and the freedom to change plans on the fly.' },
  { letter: 'F', icon: 'ship', title: 'Fleet', short: '109 vessels, one call', long: 'From speedboats to superyachts — the entire Azanov fleet is available for your route. Guide, crew, fruits, drinks, snorkeling, insurance all included.' },
  { letter: 'G', icon: 'compass', title: 'Guide', short: 'Local insider, not a script', long: 'Our Russian-speaking guide is a long-time Phuket resident. He shows you the island the way he would show his closest friends — only verified, off-the-map spots.' },
  { letter: 'H', icon: 'home', title: 'Home Away', short: 'Villa life, hotel service', long: 'Premium linens, orthopedic mattresses, perfect quiet, climate control. Our villas offer a sleep nothing will disturb.' },
  { letter: 'I', icon: 'user-check', title: 'Individuality', short: 'Full custom, every time', long: 'We have no template solutions. Every itinerary and every service is adapted to your interests, pace of life, and personal wishes.' },
  { letter: 'J', icon: 'heart', title: 'Joy', short: "That's the whole point", long: 'Villas and yachts are just tools. Our real goal is the vivid emotions that stay with you forever.' },
  { letter: 'K', icon: 'chef-hat', title: 'Kitchen', short: 'Culinary art on demand', long: 'A private chef at the villa cooks any cuisine in the world — from fresh sashimi on the yacht to a candlelit dinner on the terrace overlooking the sea.' },
  { letter: 'L', icon: 'star', title: 'Luxury', short: 'Above every expectation', long: "We don't chase cheap. We create value. The emotions and comfort level you receive vastly exceed what you imagined." },
  { letter: 'M', icon: 'music', title: 'Music', short: "Your vibe, your soundtrack", long: "Powerful sound systems on villas and yachts, karaoke and DJ on request. Your retreat's musical backdrop is always at the highest level." },
  { letter: 'N', icon: 'plane-takeoff', title: 'No Queues', short: 'VIP Fast Track everywhere', long: 'Green Lane at the airport, the fastest speedboats, and premium transfers. We save your time so you can spend it on rest.' },
  { letter: 'O', icon: 'anchor', title: 'Ocean', short: 'Symphony of the Andaman', long: 'Phi Phi, Similan Islands, Racha, James Bond Island and dozens more — all reachable at the speed of our yachts and speedboats.' },
  { letter: 'P', icon: 'lock', title: 'Privacy', short: 'Absolute tranquility', long: 'Our villas are shielded from outside eyes. No strangers — just your group and the sea.' },
  { letter: 'Q', icon: 'check-circle', title: 'Quality', short: "Jeweller's precision", long: 'Meticulous planning, perfect timing, flawless execution. We do not make mistakes.' },
  { letter: 'R', icon: 'leaf', title: 'Relaxation', short: 'Pure rest', long: 'Spa treatments, Thai massage at the villa, meditation to the sound of waves. Complete restoration.' },
  { letter: 'S', icon: 'sun', title: 'Sunset', short: 'The best view on earth', long: 'From a luxury yacht deck or infinity pool — we know exactly where the most breathtaking views of the setting sun are.' },
  { letter: 'T', icon: 'car', title: 'Transfer', short: 'Door to deck', long: 'VIP transfers are included in all packages. We meet you at the aircraft steps and deliver you directly to the villa or pier.' },
  { letter: 'U', icon: 'smile', title: 'Unlimited', short: 'No penny-counting', long: "We don't count water bottles or kilometers. There's enough of everything for the comfortable enjoyment of your whole group." },
  { letter: 'V', icon: 'home', title: 'Villas', short: 'From boutique to legendary', long: 'A premium collection — from intimate 4-bedroom homes to legendary 9-bedroom residences for 28 guests with cinema rooms and infinity pools.' },
  { letter: 'W', icon: 'heart', title: 'Wishes', short: 'We make them real', long: "We erased the line between desire and reality. Your job is to relax; ours is to anticipate what will make your day even more perfect." },
  { letter: 'X', icon: 'star', title: 'Xtra Mile', short: "Beyond what's expected", long: 'Our crew and guides have incredible charisma, turning a boat ride into a true celebration — every single time.' },
  { letter: 'Y', icon: 'ship', title: 'Yachts', short: 'The finest fleet', long: 'From speedboats to the floating club Beach Club Yona. Our fleet is the pride of Azanov Retreat.' },
  { letter: 'Z', icon: 'check-circle', title: 'Zero Compromise', short: 'The Azanov promise', long: 'This is our non-negotiable standard. Maximum quality, zero compromise — on every retreat, for every guest.' }
];

function getAzbukaList() {
  return (window.i18n && window.i18n.lang === 'en') ? AZBUKA_EN : AZBUKA;
}

/* ---- DATA: TESTIMONIALS ---- */
const TESTIMONIALS = [
  { initials: 'АК', initials_en: 'AK', name: 'Александра К.', name_en: 'Alexandra K.', detail: 'Семья, Turquoise View • Январь 2026', detail_en: 'Family, Turquoise View • January 2026', stars: 5, text: 'С маленьким ребёнком на катере — это было лучшее решение. Мы принадлежали только себе. Гид думал на шаг вперёд, а вилла была просто сказкой.', text_en: 'Taking a speedboat with a small child was the best decision. We had the whole boat to ourselves. The guide was always one step ahead, and the villa was pure magic.' },
  { initials: 'МD', initials_en: 'MD', name: 'Михаил Д.', name_en: 'Mikhail D.', detail: 'Корпоратив, 18 человек • Декабрь 2025', detail_en: 'Corporate, 18 people • December 2025', stars: 5, text: 'Организовали корпоратив на вилле Rock Pool. Fast Track в аэропорту — это отдельный кайф, команда прошла границу за 10 минут. Всё "от А до Я" — это не маркетинг, это реально так.', text_en: 'Organized a corporate retreat at Rock Pool villa. Fast Track at the airport was phenomenal, the team cleared immigration in 10 minutes. Everything "from A to Z" is not just marketing, it’s real.' },
  { initials: 'НС', initials_en: 'NS', name: 'Наталья С.', name_en: 'Natalia S.', detail: 'Свадьба, ONYX Villa • Февраль 2026', detail_en: 'Wedding, ONYX Villa • February 2026', stars: 5, text: 'Романтический ужин на борту яхты, фотограф поймал лучшие кадры нашей жизни, а вилла ONYX — это произведение искусства. Ни одной накладки за 7 ночей.', text_en: 'A romantic dinner aboard a yacht, the photographer captured the best moments of our lives, and the ONYX villa is a work of art. Not a single hiccup during our 7 nights.' },
  { initials: 'ИВ', initials_en: 'IV', name: 'Игорь В.', name_en: 'Igor V.', detail: 'Regent Bang Tao Escape • Март 2026', detail_en: 'Regent Bang Tao Escape • March 2026', stars: 5, text: 'Апартаменты в The Regent, катамаран на Пхи-Пхи, фотограф — это уровень, которого я нигде больше не встречал. Консьерж решал любые вопросы, локация в центре Банг Тао идеальна.', text_en: 'Apartments at The Regent, catamaran to Phi Phi, the photographer — a level of service I have never seen anywhere else. The concierge solved every issue, and the location in Bang Tao is perfect.' },
  { initials: 'ЕП', initials_en: 'EP', name: 'Елена П.', name_en: 'Elena P.', detail: 'Семья, Rock Pool • Ноябрь 2025', detail_en: 'Family, Rock Pool • November 2025', stars: 5, text: 'Первый раз с детьми в Таиланде — переживали. Но консьерж всё организовал: трансфер, виза, няня на пару вечеров. Дети в восторге от снорклинга.', text_en: 'First time in Thailand with kids — we were nervous. But the concierge organized everything: transfers, visas, a nanny for a few evenings. The kids loved the snorkeling.' },
  { initials: 'ДС', initials_en: 'DS', name: 'Дмитрий С.', name_en: 'Dmitry S.', detail: 'Медовый месяц, ONYX • Октябрь 2025', detail_en: 'Honeymoon, ONYX • October 2025', stars: 5, text: 'Заказывали романтический ужин на пляже — свечи, морепродукты, шампанское. Сюрприз для жены удался на все сто.', text_en: 'Ordered a romantic dinner on the beach — candles, seafood, champagne. The surprise for my wife was an absolute success.' },
  { initials: 'ОЛ', initials_en: 'OL', name: 'Ольга Л.', name_en: 'Olga L.', detail: 'Laguna Private Haven • Сентябрь 2025', detail_en: 'Laguna Private Haven • September 2025', stars: 5, text: 'Шестеро друзей, 14 ночей на вилле в Laguna Park. Катамаран, экскурсии, фотограф на каждый выезд — всё как в мечтах. Уже планируем повторить.', text_en: 'Six friends, 14 nights at a villa in Laguna Park. Catamaran, excursions, photographer for every trip — a dream come true. We are already planning to come back.' },
  { initials: 'АМ', initials_en: 'AM', name: 'Андрей М.', name_en: 'Andrey M.', detail: 'Бизнес-ретрит, 12 человек • Август 2025', detail_en: 'Business Retreat, 12 people • August 2025', stars: 5, text: 'Собрали команду на вилле — тимбилдинг на яхте, ужины, массаж. Продуктивность выросла, все заряжены. Рекомендую для корпоративов.', text_en: 'Gathered the team at a villa — team building on a yacht, dinners, massages. Productivity soared, everyone is energized. Highly recommended for corporate events.' },
  { initials: 'МК', initials_en: 'MK', name: 'Мария К.', name_en: 'Maria K.', detail: 'Семья, Turquoise View • Июль 2025', detail_en: 'Family, Turquoise View • July 2025', stars: 5, text: 'Бабушка 70 лет — переживали за перелёт. Fast Track сэкономил нервы, вилла с лифтом — идеально. Спасибо за внимание к деталям.', text_en: 'Brought our 70-year-old grandmother — we were worried about the flight. Fast Track saved our nerves, and the villa with an elevator was perfect. Thanks for the attention to detail.' },
  { initials: 'СВ', initials_en: 'SV', name: 'Сергей В.', name_en: 'Sergey V.', detail: 'Рыбалка, катер • Июнь 2025', detail_en: 'Fishing, Speedboat • June 2025', stars: 5, text: 'Рыбалка на спидботе — поймали тунца и барракуду. Гид знал все места. Вечером шеф приготовил наш улов — незабываемо.', text_en: 'Speedboat fishing — we caught tuna and barracuda. The guide knew all the best spots. In the evening, the chef cooked our catch — an unforgettable experience.' },
  { initials: 'ТН', initials_en: 'TN', name: 'Татьяна Н.', name_en: 'Tatiana N.', detail: 'Девушки, Beach Club Yona • Май 2025', detail_en: 'Girls trip, Beach Club Yona • May 2025', stars: 5, text: 'День на плавучем клубе — это что-то нереальное. Музыка, коктейли, закат. Фотограф сделал сотни кадров. Вернёмся обязательно.', text_en: 'A day on the floating beach club is unreal. Music, cocktails, the sunset. The photographer took hundreds of shots. We will definitely be back.' },
  { initials: 'ВГ', initials_en: 'VG', name: 'Виктор Г.', name_en: 'Victor G.', detail: 'Юбилей, Rock Pool • Апрель 2025', detail_en: 'Anniversary, Rock Pool • April 2025', stars: 5, text: 'Организовали 50-летие отца на вилле. Торт, шарики, ужин на веранде с видом на океан. Отец плакал от счастья.', text_en: 'Organized my father\'s 50th birthday at the villa. Cake, balloons, dinner on the veranda overlooking the ocean. My father cried tears of happiness.' },
];

/* ============================================================
   RENDER FUNCTIONS
   ============================================================ */

function renderPackages() {
  const container = document.getElementById('packages-grid');
  if (!container) return;
  const imgs = (pkg) => (pkg.images && pkg.images.length) ? pkg.images : [pkg.img];
  container.innerHTML = PACKAGES.map(pkg => {
    const images = imgs(pkg);
    const singleImage = images.length <= 1;
    return `
    <article class="package-card ${pkg.id === 'regent' ? 'package-card--imperial' : ''}" data-package-id="${pkg.id}" onclick="openItemModal('package', '${pkg.id}')">
      <div class="package-card__gallery ${singleImage ? 'package-card__gallery--single' : ''}">
        <div class="package-carousel">
          ${!singleImage ? `<button type="button" class="package-carousel__arrow package-carousel__arrow--prev" aria-label="${typeof _t === 'function' ? _t('aria.prevPhoto') : 'Предыдущее фото'}" onclick="event.stopPropagation();packageCarouselPrev('${pkg.id}', this)"><i data-lucide="chevron-left"></i></button>` : ''}
          <div class="package-carousel__main">
            <img src="${ImgUtils.toThumb(images[0])}" alt="${pkg.name}" loading="lazy" data-carousel-main>
          </div>
          ${!singleImage ? `<button type="button" class="package-carousel__arrow package-carousel__arrow--next" aria-label="${typeof _t === 'function' ? _t('aria.nextPhoto') : 'Следующее фото'}" onclick="event.stopPropagation();packageCarouselNext('${pkg.id}', this)"><i data-lucide="chevron-right"></i></button>` : ''}
          ${!singleImage ? `<div class="package-carousel__thumbs">
          ${images.map((url, idx) => `
            <button type="button" class="package-carousel__thumb ${idx === 0 ? 'active' : ''}" onclick="event.stopPropagation();packageCarouselGo('${pkg.id}', ${idx}, this)" aria-label="${typeof _t === 'function' ? _t('aria.photoN').replace('{n}', idx + 1) : 'Фото ' + (idx + 1)}">
              <img src="${ImgUtils.toThumb(url)}" alt="">
            </button>
          `).join('')}
        </div></div>` : ''}${singleImage ? '</div>' : ''}
        <div class="package-card__badge-img">
          <span class="badge badge-${pkg.badgeType}">${_d(pkg, 'badge')}</span>
        </div>
      </div>
      <div class="package-card__body" style="color:#EEF4F6;background:#0D1E2A">
        <div>
          <div class="package-card__name">${pkg.name}</div>
          <div class="package-card__subtitle">${_d(pkg, 'subtitle')}</div>
          ${(pkg.guests != null || pkg.bedrooms != null || pkg.area) ? `
          <div class="package-meta-icons package-meta-icons--card">
            ${pkg.guests != null ? `<span class="package-meta-item"><i data-lucide="users" class="icon-teal"></i> ${_t('card.upTo')} ${pkg.guests} ${_t('card.guests')}</span>` : ''}
            ${pkg.bedrooms != null ? `<span class="package-meta-item"><i data-lucide="bed" class="icon-teal"></i> ${pkg.bedrooms} ${_t('card.bedrooms')}</span>` : ''}
            ${pkg.area ? `<span class="package-meta-item"><i data-lucide="maximize" class="icon-teal"></i> ${pkg.area}</span>` : ''}
            <span class="package-meta-item"><i data-lucide="tag" class="icon-teal"></i> ${pkg.name}</span>
          </div>
          ` : ''}
          <div class="package-card__price">
            <span class="package-card__price-label">${typeof _t === 'function' ? _t('packages.from') : 'от'}</span>
            <span class="package-card__price-value">${_d(pkg, 'priceLabel')}</span>
            <span class="package-card__price-nights">${_d(pkg, 'nights')}</span>
          </div>
          <button class="btn btn-primary package-card__order-btn" onclick="event.stopPropagation();openLeadForm('${pkg.id}')">${_t('packages.order')}</button>
        </div>
        <ul class="package-card__included">
          ${pkg.included.map((i, idx) => `<li>${typeof i === 'string' ? ((window.i18n && window.i18n.lang === 'en' && Array.isArray(pkg.included_en) && pkg.included_en[idx]) ? pkg.included_en[idx] : i) : _d(i, 'short')}</li>`).join('')}
        </ul>
      </div>
    </article>
  `;
  }).join('');
  if (window.lucide) lucide.createIcons();
}

function packageCarouselPrev(pkgId, btn) {
  const card = document.querySelector(`.package-card[data-package-id="${pkgId}"]`);
  if (!card) return;
  const pkg = PACKAGES.find(p => p.id === pkgId);
  const images = (pkg?.images && pkg.images.length) ? pkg.images : (pkg ? [pkg.img] : []);
  const mainImg = card.querySelector('[data-carousel-main]');
  const thumbs = card.querySelectorAll('.package-carousel__thumb');
  if (!mainImg || !thumbs.length) return;
  const idx = Array.from(thumbs).findIndex(t => t.classList.contains('active'));
  const nextIdx = idx <= 0 ? images.length - 1 : idx - 1;
  mainImg.src = ImgUtils.toThumb(images[nextIdx]);
  thumbs.forEach((t, i) => t.classList.toggle('active', i === nextIdx));
}

function packageCarouselNext(pkgId, btn) {
  const card = document.querySelector(`.package-card[data-package-id="${pkgId}"]`);
  if (!card) return;
  const pkg = PACKAGES.find(p => p.id === pkgId);
  const images = (pkg?.images && pkg.images.length) ? pkg.images : (pkg ? [pkg.img] : []);
  const mainImg = card.querySelector('[data-carousel-main]');
  const thumbs = card.querySelectorAll('.package-carousel__thumb');
  if (!mainImg || !thumbs.length) return;
  const idx = Array.from(thumbs).findIndex(t => t.classList.contains('active'));
  const nextIdx = (idx + 1) % images.length;
  mainImg.src = ImgUtils.toThumb(images[nextIdx]);
  thumbs.forEach((t, i) => t.classList.toggle('active', i === nextIdx));
}

function packageCarouselGo(pkgId, idx, thumbBtn) {
  const card = document.querySelector(`.package-card[data-package-id="${pkgId}"]`);
  if (!card) return;
  const pkg = PACKAGES.find(p => p.id === pkgId);
  const images = (pkg?.images && pkg.images.length) ? pkg.images : (pkg ? [pkg.img] : []);
  const mainImg = card.querySelector('[data-carousel-main]');
  const thumbs = card.querySelectorAll('.package-carousel__thumb');
  if (!mainImg || !thumbs.length || idx >= images.length) return;
  mainImg.src = ImgUtils.toThumb(images[idx]);
  thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
}

function renderFleet(filter = 'all', priceMin = 0, priceMax = Infinity, sort = 'expensive', limit = Infinity) {
  const container = document.getElementById('fleet-grid');
  if (!container) return;
  let filtered = FLEET.filter(y => {
    const typeMatch = filter === 'all' || y.type === filter;
    const priceMatch = y.price >= priceMin && y.price <= priceMax;
    return typeMatch && priceMatch;
  });
  filtered = [...filtered].sort((a, b) => sort === 'expensive' ? b.price - a.price : a.price - b.price);
  const totalCount = filtered.length;
  if (totalCount === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted)">${typeof _t === 'function' ? _t('fleet.noResults') : 'По выбранным фильтрам ничего не найдено'}</div>`;
    return;
  }
  const toShow = limit === Infinity ? filtered : filtered.slice(0, limit);
  const typeLabels = { speedboat: _t('fleet.filter.speedboat'), catamaran: _t('fleet.filter.catamaran'), motorboat: _t('fleet.filter.motorboat'), yacht: _t('fleet.filter.yacht'), superyacht: _t('fleet.filter.superyacht') };
  container.innerHTML = toShow.map(y => `
    <article class="yacht-card" data-type="${y.type}" data-price="${y.price}" onclick="openItemModal('yacht', '${y.id}')" style="cursor:pointer">
      <div class="yacht-card__img">
        <img src="${ImgUtils.toThumb(y.img)}" alt="${y.name}" loading="lazy">
        <span class="yacht-card__vibe badge badge-teal">${typeLabels[y.type] || fleetVibe(y)}</span>
        <span class="yacht-card__all-in">All-Inclusive</span>
      </div>
      <div class="yacht-card__body">
        <div class="yacht-card__name">${y.name}</div>
        <div class="yacht-card__specs">
          <span class="yacht-card__spec"><i data-lucide="users" class="icon-xs"></i> ${typeof _t === 'function' ? _t('card.upTo') + ' ' + y.guests + ' ' + _t('card.guests') : 'до ' + y.guests + ' гостей'}</span>
          <span class="yacht-card__spec"><i data-lucide="maximize" class="icon-xs"></i> ${y.length}</span>
          <span class="yacht-card__spec"><i data-lucide="zap" class="icon-xs"></i> ${y.speed}</span>
        </div>
        <div class="yacht-card__price-row">
          <span class="yacht-card__price">${(typeof _t === 'function' ? _t('card.from') || 'от' : 'от')} ${_d(y, 'priceLabel').replace('от ', '')}</span>
          <span class="yacht-card__price-unit">${typeof _t === 'function' ? _t('fleet.perDay') : '/ день'}</span>
        </div>
      </div>
      <div class="yacht-card__footer">
        <button class="btn btn-primary" style="flex:1" onclick="event.stopPropagation();openLeadForm(null,'${(y.name || '').replace(/'/g, "\\'")}',null,null,null,{maxGuests:${y.guests ?? 28}})">${_t('fleet.wantYacht')}</button>
        <button class="btn btn-ghost btn-icon" title="${typeof _t === 'function' ? _t('aria.details') : 'Подробнее'}" onclick="event.stopPropagation();openItemModal('yacht', '${y.id}')"><i data-lucide="external-link" class="icon-sm"></i></button>
      </div>
    </article>
  `).join('');
  if (window.lucide) lucide.createIcons();
  return { shown: toShow.length, total: totalCount };
}

/** Маппинг фич виллы на иконки Lucide (единый шаблон с яхтами) */
function getVillaFeatureIcon(label) {
  const s = (label || '').toLowerCase();
  if (s.includes('спален') || s.includes('спальн')) return 'bed';
  if (s.includes('гостей')) return 'users';
  if (s.includes('спа') || s.includes('сауна')) return 'bath';
  if (s.includes('бассейн') || s.includes('джакузи')) return 'waves';
  if (s.includes('кинозал')) return 'film';
  if (s.includes('тренажер') || s.includes('зал')) return 'dumbbell';
  if (s.includes('бильярд')) return 'circle-dot';
  if (s.includes('вид') && (s.includes('море') || s.includes('океан'))) return 'mountain';
  if (s.includes('инфинити')) return 'waves';
  if (s.includes('акустик') || s.includes('музык')) return 'music';
  if (s.includes('тропсад') || s.includes('сад')) return 'trees';
  if (s.includes('штат') || s.includes('персонал')) return 'users';
  if (s.includes('smeg') || s.includes('кухн')) return 'chef-hat';
  if (s.includes('мебель') || s.includes('итал')) return 'armchair';
  if (s.includes('найхарн') || s.includes('пляж') || s.includes('мин')) return 'map-pin';
  if (s.includes('стиль') || s.includes('золот')) return 'sparkles';
  return 'check';
}

function renderVillas(limit = Infinity) {
  const container = document.getElementById('villas-grid');
  if (!container) return;
  const toShow = limit === Infinity ? VILLAS : VILLAS.slice(0, limit);
  const bedLabel = (n) => (n === 1 ? _t('card.bedroom') : _t('card.bedrooms'));
  container.innerHTML = toShow.map(v => `
    <article class="villa-card" onclick="openItemModal('villa', '${v.id}')" style="cursor:pointer">
      <div class="villa-card__img">
        <img src="${ImgUtils.toThumb(v.img)}" alt="${v.name}" loading="lazy">
        <span class="villa-card__vibe badge badge-teal">${v.bedrooms} ${bedLabel(v.bedrooms)}</span>
        <span class="villa-card__all-in">All-Inclusive</span>
      </div>
      <div class="villa-card__body">
        <div class="villa-card__name">${v.name}</div>
        <div class="villa-card__specs">
          <span class="villa-card__spec"><i data-lucide="users" class="icon-xs"></i> ${_t('card.upTo')} ${v.guests} ${_t('card.guests')}</span>
          <span class="villa-card__spec"><i data-lucide="bed" class="icon-xs"></i> ${v.bedrooms} ${_t('card.bedrooms')}</span>
          <span class="villa-card__spec"><i data-lucide="bath" class="icon-xs"></i> ${v.bathrooms} ${_t('card.bathrooms')}</span>
          <span class="villa-card__spec"><i data-lucide="maximize" class="icon-xs"></i> ${v.sqm} м²</span>
        </div>
        <div class="villa-card__price-row">
          <span class="villa-card__price">${_d(v, 'priceLabel') || _d(v, 'price')}</span>
          <span class="villa-card__price-unit">${(_d(v, 'priceLabel') || _d(v, 'price')) && (_d(v, 'priceLabel') || _d(v, 'price')) !== 'по запросу' ? ' ' + _t('card.perNight') : ''}</span>
        </div>
      </div>
      <div class="villa-card__footer">
        <button class="btn btn-primary" style="flex:1" onclick="event.stopPropagation();openLeadForm(null,null,'${(v.name || '').replace(/'/g, "\\'")}')">${_t('card.inquire')}</button>
        <button class="btn btn-ghost btn-icon" title="${typeof _t === 'function' ? _t('aria.details') : 'Подробнее'}" onclick="event.stopPropagation();openItemModal('villa', '${v.id}')"><i data-lucide="external-link" class="icon-sm"></i></button>
      </div>
    </article>
  `).join('');
  if (window.lucide) lucide.createIcons();
  return { shown: toShow.length, total: VILLAS.length };
}

function renderLocations(locations = LOCATIONS, limit = Infinity) {
  const container = document.getElementById('locations-grid');
  if (!container) return;

  const data = locations && locations.length > 0 ? locations : LOCATIONS;
  if (!data || data.length === 0) {
    // Only show "Loading" if we haven't hit an error or handled specifically in fetchTours
    if (!container.innerHTML || container.querySelector('.skeleton')) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted)">${typeof _t === 'function' ? _t('tours.loading') : 'Загрузка туров...'}</div>`;
    }
    return;
  }
  const toShow = limit === Infinity ? data : data.slice(0, limit);
  container.innerHTML = toShow.map((loc) => {
    const safeName = (loc.name || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const metaLabel = loc.metaLabel || '1 день';
    return `
    <div class="location-card ${loc.featured ? 'location-card--featured' : ''}">
      <div class="location-card__photo" onclick="openItemModal('tour', '${loc.id}')" role="button" tabindex="0" aria-label="${typeof _t === 'function' ? _t('aria.tourDetails').replace('{name}', safeName) : 'Подробнее о туре ' + safeName}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openItemModal('tour','${loc.id}');}">
        <div class="location-card__bg" style="background-image:url('${ImgUtils.toThumb(loc.img)}')"></div>
        <div class="location-card__overlay"></div>
        <div class="location-card__arrow-hint"><i data-lucide="arrow-right" class="icon-sm"></i></div>
      </div>
      <div class="location-card__content">
        <div class="location-card__tag">
          <span class="badge badge-teal">${metaLabel}</span>
        </div>
        <div class="location-card__name">${_d(loc, 'name')}</div>
        <div class="location-card__desc">${_d(loc, 'desc')}</div>
        <div class="location-card__price" style="margin-top: 0.5rem; font-weight: 600; color: var(--teal-light)">${loc.rawPrice ? ((typeof _t === 'function' ? _t('card.from') || 'от' : 'от') + ' ' + loc.rawPrice + ' ฿') : (loc.priceLabel ? loc.priceLabel.replace('от', typeof _t === 'function' ? _t('card.from') || 'от' : 'от') : '')}</div>
        <div class="location-card__footer">
          <button type="button" class="btn btn-primary" style="flex:1" onclick="event.stopPropagation();openLeadFormFromTour('${loc.id}')" aria-label="${typeof _t === 'function' ? _t('modal.order') + ' ' + safeName : 'Заказать тур ' + safeName}">${typeof _t === 'function' ? _t('modal.order') : 'Заказать'}</button>
          <button type="button" class="btn btn-ghost" onclick="event.stopPropagation();openItemModal('tour', '${loc.id}')" aria-label="${typeof _t === 'function' ? _t('aria.tourExplore').replace('{name}', safeName) : 'Изучить подробнее о туре ' + safeName}"><i data-lucide="arrow-right" class="icon-sm"></i></button>
        </div>
      </div>
    </div>
  `;
  }).join('');
  if (window.lucide) lucide.createIcons();
  return { shown: toShow.length, total: data.length };
}

function renderServices() {
  const container = document.getElementById('services-grid');
  if (!container) return;
  container.innerHTML = SERVICES.map(s => {
    const safe = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    return `
    <div class="service-item" data-service-name="${safe(s.name)}" onclick="openServiceModal(this.dataset.serviceName)" role="button" tabindex="0" aria-label="${typeof _t === 'function' ? _t('aria.serviceDetails').replace('{name}', safe(s.name)) : 'Подробнее о ' + safe(s.name)}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openServiceModal(this.dataset.serviceName);}">
      <div class="service-item__icon"><i data-lucide="${s.icon}"></i></div>
      <div class="service-item__name">${s.name}</div>
      <div class="service-item__desc">${_d(s, 'desc')}</div>
    </div>
  `;
  }).join('');
  if (window.lucide) lucide.createIcons();
}

function renderFAQ() {
  const tabsEl = document.getElementById('faq-tabs');
  const bodyEl = document.getElementById('faq-body');
  if (!tabsEl || !bodyEl) return;
  const cats = Object.entries(FAQ);
  tabsEl.innerHTML = cats.map(([key, cat], i) => {
    const l1 = _t('faq.cats.' + key + '.line1') || cat.labelLine1 || cat.label;
    const l2 = _t('faq.cats.' + key + '.line2') || cat.labelLine2 || '';
    return `<button class="faq-tab faq-tab--square ${i === 0 ? 'active' : ''}" onclick="switchFAQTab('${key}',this)">
      <span class="faq-tab__icon"><i data-lucide="${cat.icon || 'circle'}"></i></span>
      <span class="faq-tab__text"><span class="faq-tab__line1">${l1}</span>${l2 ? `<span class="faq-tab__line2">${l2}</span>` : ''}</span>
    </button>`;
  }).join('');
  bodyEl.innerHTML = cats.map(([key, cat], i) => `
    <div class="faq-category ${i === 0 ? 'active' : ''}" data-cat="${key}">
      ${cat.items.map(item => `
        <div class="faq-item">
          <button type="button" class="faq-question" onclick="toggleFAQ(this)">
            <span class="faq-question__text">${_d(item, 'q')}</span>
            <span class="faq-question__icon" aria-hidden="true"><i data-lucide="plus" class="icon-sm transition-icon"></i></span>
          </button>
          <div class="faq-answer"><p>${_d(item, 'a')}</p></div>
        </div>
      `).join('')}
    </div>
  `).join('');
  if (window.lucide) lucide.createIcons();
}

function switchFAQTab(key, btn) {
  document.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.faq-category').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.querySelector(`.faq-category[data-cat="${key}"]`)?.classList.add('active');
}
function toggleFAQ(el) {
  const item = el.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  el.closest('.faq-category').querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-slider');
  const navContainer = document.getElementById('testimonials-nav');
  if (!container) return;

  container.innerHTML = TESTIMONIALS.map((t, i) => `
    <article class="testimonial-card" id="testimonial-card-${i}">
      <div class="testimonial-stars">${'★'.repeat(t.stars)}</div>
      <p class="testimonial-text">${_d(t, 'text')}</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${_d(t, 'initials')}</div>
        <div>
          <div class="testimonial-name">${_d(t, 'name')}</div>
          <div class="testimonial-detail">${_d(t, 'detail')}</div>
        </div>
      </div>
    </article>
  `).join('');

  if (navContainer) {
    navContainer.innerHTML = TESTIMONIALS.map((_, i) => `
      <button type="button" class="testimonials-nav-btn ${i === 0 ? 'active' : ''}" data-index="${i}" onclick="scrollToTestimonial(${i})">${i + 1}</button>
    `).join('');
  }

  if (window.lucide) lucide.createIcons();
  setTimeout(() => initTestimonialsSlider(), 100);
}

function scrollToTestimonial(index) {
  const card = document.getElementById(`testimonial-card-${index}`);
  const slider = document.getElementById('testimonials-slider');
  if (card && slider) {
    const scrollLeft = card.offsetLeft - slider.offsetLeft - (slider.clientWidth / 2) + (card.offsetWidth / 2);
    slider.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
  }
}

function initTestimonialsSlider() {
  const slider = document.getElementById('testimonials-slider');
  const navBtns = document.querySelectorAll('.testimonials-nav-btn');
  if (!slider || !navBtns.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.id.replace('testimonial-card-', ''), 10);
        navBtns.forEach(btn => {
          const btnIdx = parseInt(btn.dataset.index, 10);
          btn.classList.toggle('active', btnIdx === idx);
        });
      }
    });
  }, { root: slider, threshold: 0.6 });

  document.querySelectorAll('.testimonial-card').forEach(card => observer.observe(card));
}

/* ============================================================
   PACKAGE MODAL
   ============================================================ */
function openAzbukaModal(letter) {
  const list = getAzbukaList();
  const item = list.find(a => a.letter === letter);
  if (!item) return;
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-content').innerHTML = `
    <span class="modal-handle"></span>
    <div class="modal-header">
      <div>
        <div class="azbuka-modal-letter">${item.letter}</div>
        <div class="h3" style="display:flex;align-items:center;gap:0.75rem"><i data-lucide="${item.icon}" class="teal"></i> ${item.title}</div>
        <div class="label-upper" style="margin-top:0.5rem;color:var(--gold)">${item.short}</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div style="background:var(--surface);border-radius:var(--radius-md);padding:1.5rem;margin-top:1.5rem;line-height:1.6;font-size:1.05rem;color:var(--text)">
      ${item.long}
    </div>
    <div style="margin-top:2rem;text-align:center">
      <button class="btn btn-primary-lg" onclick="closeModal();openLeadForm('retreat')">${_t('philosophy.cta')}</button>
    </div>
  `;
  overlay.classList.add('open');
  if (window.lucide) lucide.createIcons();
}

function openServiceModal(serviceName) {
  const item = SERVICES.find(s => s.name === serviceName);
  if (!item) return;
  const overlay = document.getElementById('modal-overlay');
  const longText = (_d(item, 'long') || _d(item, 'desc') || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const safeName = item.name.replace(/'/g, "\\'");
  document.getElementById('modal-content').innerHTML = `
    <span class="modal-handle"></span>
    <div class="modal-header">
      <div>
        <div class="h3" style="display:flex;align-items:center;gap:0.75rem"><i data-lucide="${item.icon}" class="teal"></i> ${_d(item, 'name')}</div>
        <div class="label-upper" style="margin-top:0.5rem;color:var(--gold)">${_d(item, 'desc')}</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div style="background:var(--surface);border-radius:var(--radius-md);padding:1.5rem;margin-top:1.5rem;line-height:1.6;font-size:1.05rem;color:var(--text)">
      ${longText}
    </div>
    <div style="margin-top:2rem;text-align:center">
      <button class="btn btn-primary-lg" onclick="closeModal();openLeadForm(null,null,null,'${safeName}')">Заказать услугу</button>
    </div>
  `;
  overlay.classList.add('open');
  if (window.lucide) lucide.createIcons();
}

function openFastTrackDetailModal() {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-content').innerHTML = `
    <span class="modal-handle"></span>
    <div class="modal-header">
      <div>
        <div class="h3" style="display:flex;align-items:center;gap:0.75rem"><i data-lucide="plane" class="teal"></i> VIP Fast Track — Зелёный коридор</div>
        <div class="label-upper" style="margin-top:0.5rem;color:var(--teal)">Сколько времени можно сэкономить</div>
      </div>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div style="background:var(--surface);border-radius:var(--radius-md);padding:1.25rem;margin-top:1rem;line-height:1.55;font-size:0.95rem;color:var(--text)">
      <p style="margin:0 0 0.75rem">В обычные дни — 1–2 часа. В высокий сезон очереди в аэропорту могут занимать <strong>3–4 часа</strong>. С зелёным коридором весь процесс — <strong>10–15 минут</strong>.</p>
      <p style="margin:0;font-size:0.85rem;color:var(--teal);font-weight:600">Только плюсы:</p>
      <ul class="modal-included modal-included--compact" style="margin-top:0.4rem;margin-bottom:0">
        <li><i data-lucide="check" class="icon-xs teal"></i> Встреча у трапа самолёта</li>
        <li><i data-lucide="check" class="icon-xs teal"></i> Приоритетный паспортный контроль без очередей</li>
        <li><i data-lucide="check" class="icon-xs teal"></i> VIP-трансфер на премиальном авто</li>
        <li><i data-lucide="check" class="icon-xs teal"></i> Для групп от 10 человек — премиум-бас</li>
      </ul>
    </div>
    <div style="margin-top:1.5rem;text-align:center">
      <button class="btn btn-teal" onclick="closeModal();openLeadForm(null,null,null,'Fast Track')">Запросить Fast Track</button>
    </div>
  `;
  overlay.classList.add('open');
  if (window.lucide) lucide.createIcons();
}

// Global state for gallery
let currentGalleryImages = [];
let currentGalleryIndex = 0;
let itemModalStep = 1;
let currentItemModalData = null; // { type, id, item }

function itemModalGoToCalculator() {
  itemModalStep = 2;
  document.getElementById('item-modal-step-1').style.display = 'none';
  const step2 = document.getElementById('item-modal-step-2');
  step2.style.display = 'flex';

  // Populate tiny photo and title
  if (currentItemModalData?.item) {
    const img = currentItemModalData.item.images?.[0] || currentItemModalData.item.img;
    document.getElementById('item-modal-tiny-photo').src = img;
    document.getElementById('item-modal-tiny-photo').alt = currentItemModalData.item.name || '';
    document.getElementById('item-modal-calc-title').textContent = currentItemModalData.item.name || '';
  }

  // Move lead form into step 2 and init
  const leadWrapper = document.querySelector('.lead-form-wrapper');
  const leadContainer = document.getElementById('item-modal-lead-container');
  if (leadWrapper && leadContainer && leadWrapper.parentNode !== leadContainer) {
    leadContainer.appendChild(leadWrapper);
    leadWrapper.style.boxShadow = 'none';
    leadWrapper.style.border = 'none';
    const closeZone = document.querySelector('.lead-modal-close-zone');
    if (closeZone) closeZone.style.display = 'none';
  }

  const origOverlay = document.getElementById('lead-modal-overlay');
  if (origOverlay) origOverlay.id = 'lead-modal-overlay-temp';
  if (currentItemModalData?.type === 'package') {
    window.openLeadForm(currentItemModalData.id);
  } else if (currentItemModalData?.type === 'yacht') {
    window.openLeadForm(null, currentItemModalData.item?.name || '', null, null, null, { yachtItem: currentItemModalData.item });
  } else if (currentItemModalData?.type === 'villa') {
    window.openLeadForm(null, null, currentItemModalData.item?.name || '');
  } else if (currentItemModalData?.type === 'tour') {
    window.openLeadForm(null, null, null, null, { item: currentItemModalData.item });
  } else {
    window.openLeadForm();
  }
  if (origOverlay) origOverlay.id = 'lead-modal-overlay';

  if (window.lucide) lucide.createIcons();
}

function itemModalGoToDetail() {
  itemModalStep = 1;
  document.getElementById('item-modal-step-2').style.display = 'none';
  document.getElementById('item-modal-step-1').style.display = '';

  // Move lead form back to lead modal overlay
  const leadWrapper = document.querySelector('.lead-form-wrapper');
  const leadModalInner = document.querySelector('.lead-modal-inner');
  if (leadWrapper && leadModalInner && leadWrapper.parentNode?.id === 'item-modal-lead-container') {
    leadModalInner.insertBefore(leadWrapper, leadModalInner.firstElementChild);
    leadWrapper.style.boxShadow = '';
    leadWrapper.style.border = '';
    const closeZone = document.querySelector('.lead-modal-close-zone');
    if (closeZone) closeZone.style.display = '';
  }

  if (window.lucide) lucide.createIcons();
}

// Package detail popover: show villa/yacht info when selecting package (no full modal)
function showPackageDetailPopover(pkgId, kind, ev) {
  ev.stopPropagation();
  const pkg = PACKAGES.find(p => p.id === pkgId);
  if (!pkg) return;
  const popover = document.getElementById('package-detail-popover');
  const body = document.getElementById('package-detail-popover-body');
  if (!popover || !body) return;

  let html = '';
  if (kind === 'villa' && pkg.villaIds?.length) {
    const villas = pkg.villaIds.map(id => VILLAS.find(v => v.id === id)).filter(Boolean).slice(0, 3);
    html = villas.map(v => `
      <div class="package-detail-card package-detail-card--clickable" onclick="hidePackageDetailPopover();closeItemModal();openItemModal('villa','${v.id}')" style="cursor:pointer">
        ${v.img ? `<img src="${v.img}" alt="${v.name}" class="package-detail-card__img" loading="lazy">` : ''}
        <div class="package-detail-card__title">${v.name}</div>
        <div class="package-detail-card__meta">${v.bedrooms} ${_t('modal.bedrooms').toLowerCase()} • ${_t('card.upTo')} ${v.guests} ${_t('card.guests')} • ${v.area}</div>
        <div class="package-detail-card__desc">${_d(v, 'highlight')}</div>
        <div class="body-sm" style="margin-top:0.5rem;color:var(--teal);font-weight:600">${_t('card.inquire')} →</div>
      </div>
    `).join('');
    if (pkg.villaIds.length > 3) html += `<div class="package-detail-card__more muted">${_t('modal.moreOf').replace('{n}', pkg.villaIds.length - 3)}</div>`;
  } else if (kind === 'yacht' && pkg.yachtIds?.length) {
    const yachts = pkg.yachtIds.map(id => FLEET.find(f => f.id === id)).filter(Boolean).slice(0, 3);
    html = yachts.map(y => `
      <div class="package-detail-card package-detail-card--clickable" onclick="hidePackageDetailPopover();closeItemModal();openItemModal('yacht','${y.id}')" style="cursor:pointer">
        <img src="${y.img}" alt="${y.name}" class="package-detail-card__img">
        <div class="package-detail-card__title">${y.name}</div>
        <div class="package-detail-card__meta">${_t('card.upTo')} ${y.guests} ${_t('card.guests')} • ${y.length} • ${y.speed}</div>
        <div class="package-detail-card__desc">${fleetVibe(y)}</div>
        <div class="body-sm" style="margin-top:0.5rem;color:var(--teal);font-weight:600">${_t('card.inquire')} →</div>
      </div>
    `).join('');
    if (pkg.yachtIds.length > 3) html += `<div class="package-detail-card__more muted">${_t('modal.moreOf').replace('{n}', pkg.yachtIds.length - 3)}</div>`;
  }
  if (!html) return;
  body.innerHTML = html;
  popover.classList.add('open');
  setTimeout(() => document.addEventListener('click', hidePackageDetailPopoverOnce), 0);
}

function hidePackageDetailPopover() {
  const popover = document.getElementById('package-detail-popover');
  if (popover) popover.classList.remove('open');
  document.removeEventListener('click', hidePackageDetailPopoverOnce);
}

function hidePackageDetailPopoverOnce(ev) {
  const popover = document.getElementById('package-detail-popover');
  if (popover && !popover.contains(ev.target) && !ev.target.closest('.package-meta-villa-thumb, .package-meta-yacht-thumb')) {
    hidePackageDetailPopover();
    document.removeEventListener('click', hidePackageDetailPopoverOnce);
  }
}

function openIncludedItemPopover(pkgId, itemIndex) {
  const pkg = PACKAGES.find(p => p.id === pkgId);
  if (!pkg || !pkg.included) return;
  const isVillaOrYachtDup = (i) => typeof i === 'string' && (i === pkg.villa || i === pkg.yacht || (i.startsWith('Вилла ') && pkg.villa && i.slice(6) === pkg.villa));
  const filtered = pkg.included.filter(i => typeof i === 'object' || !isVillaOrYachtDup(i));
  const inc = filtered[itemIndex];
  if (!inc || typeof inc !== 'object' || !inc.popupTitle || !inc.popupDesc) return;
  const popover = document.getElementById('included-item-popover');
  const titleEl = document.getElementById('included-item-popover-title');
  const bodyEl = document.getElementById('included-item-popover-body');
  if (!popover || !titleEl || !bodyEl) return;
  titleEl.textContent = _d(inc, 'popupTitle');
  bodyEl.textContent = _d(inc, 'popupDesc');
  popover.classList.add('open');
}

function closeIncludedItemPopover() {
  const popover = document.getElementById('included-item-popover');
  if (popover) popover.classList.remove('open');
}

function openObjectInfoPopover(pkgId, kind) {
  const pkg = PACKAGES.find(p => p.id === pkgId);
  if (!pkg) return;
  const popover = document.getElementById('object-info-popover');
  const titleEl = document.getElementById('object-info-popover-title');
  const bodyEl = document.getElementById('object-info-popover-body');
  const galleryEl = document.getElementById('object-info-popover-gallery');
  if (!popover || !titleEl || !bodyEl || !galleryEl) return;

  let title = '';
  let desc = '';
  let images = [];

  if (kind === 'villa') {
    const v = pkg.villaIds?.length ? VILLAS.find(x => x.id === pkg.villaIds[0]) : null;
    title = v ? v.name : (pkg.villa || _t('modal.villa'));
    desc = v ? _d(v, 'highlight') : (pkg.villa || '');
    images = v && v.images?.length ? v.images : (pkg.images || [pkg.img] || []);
  } else if (kind === 'yacht') {
    const y = pkg.yachtIds?.length ? FLEET.find(x => x.id === pkg.yachtIds[0]) : null;
    title = y ? y.name : (pkg.yacht || _t('modal.yacht'));
    desc = y ? `${fleetVibe(y)}. ${_t('card.upTo')} ${y.guests} ${_t('card.guests')}, ${y.length}, ${y.speed}.` : (pkg.yacht || '');
    images = (y && y.images?.length) ? y.images : (pkg.yachtImages || []);
  } else if (kind === 'excursion') {
    title = _t('modal.excursions');
    desc = pkg.excursion || _t('modal.excursions');
    // Use pre-defined excursion images to avoid showing villa photos
    images = pkg.excursionImages || [];
  }

  titleEl.textContent = title;
  bodyEl.textContent = desc;
  const imgs = Array.isArray(images) ? images.slice(0, 6) : [];
  galleryEl.innerHTML = imgs.map((src, i) =>
    `<img src="${ImgUtils.toThumb(src)}" alt="" loading="lazy" onclick="objectInfoGalleryExpand(${i})">`
  ).join('');
  objectInfoPopoverImages = imgs;
  popover.classList.add('open');
  if (window.lucide) lucide.createIcons();
}

let objectInfoPopoverImages = [];
let objectInfoPopoverIndex = 0;

function objectInfoGalleryExpand(idx) {
  if (!objectInfoPopoverImages.length) return;
  currentGalleryImages = objectInfoPopoverImages;
  currentGalleryIndex = idx;
  document.getElementById('fs-gallery-img').src = ImgUtils.toFull(currentGalleryImages[idx]);
  updateFsGalleryCounter();
  document.getElementById('fs-gallery-prev').style.display = currentGalleryImages.length > 1 ? 'flex' : 'none';
  document.getElementById('fs-gallery-next').style.display = currentGalleryImages.length > 1 ? 'flex' : 'none';
  document.getElementById('fs-gallery-counter').style.display = currentGalleryImages.length > 1 ? 'block' : 'none';
  document.getElementById('fullscreen-gallery-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeObjectInfoPopover() {
  const popover = document.getElementById('object-info-popover');
  if (popover) popover.classList.remove('open');
}

function setPackageAccordionTab(idx) {
  const accordion = document.querySelector('.package-accordion');
  if (!accordion) return;
  const tabs = accordion.querySelectorAll('.package-accordion__tab');
  const panels = accordion.querySelectorAll('.package-accordion__panel');
  tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
  panels.forEach((p, i) => p.classList.toggle('active', i === idx));
  if (window.lucide) lucide.createIcons();
}

async function fetchTourById(id) {
  try {
    const cb = window.AZANOV_VERSION || Math.random().toString(36).substring(7);
    const res = await fetch(`assets/tours/${id}/tour.json?v=${cb}`);
    if (!res.ok) return null;
    const t = await res.json();
    const basePath = `assets/tours/${id}/`;
    const durationDays = parseTourDurationDays(t);
    const maxPersons = parseTourMaxPersons(t);
    const metaLabel = getTourMetaLabel(t);
    return {
      id: t.id,
      name: t.title,
      name_en: t.title_en || t.title,
      desc: t.description,
      desc_en: t.description_en || t.description,
      tag: t.sku || 'Tour',
      durationDays,
      maxPersons,
      metaLabel,
      img: basePath + (t.local_images && t.local_images[0] ? t.local_images[0] : 'images/photo-1.jpg'),
      priceLabel: `от ${t.price} ฿`,
      included: t.included || [],
      included_en: t.included_en || [],
      images: (t.local_images || []).map(img => basePath + img),
      itinerary: t.itinerary || [],
      itinerary_en: t.itinerary_en || [],
      what_to_bring: t.what_to_bring || [],
      what_to_bring_en: t.what_to_bring_en || [],
      cancellation: t.cancellation || [],
      cancellation_en: t.cancellation_en || [],
      details_html: t.details_html || ''
    };
  } catch {
    return null;
  }
}

async function openItemModal(type, id) {
  let item;
  let titleHTML = '';
  let infoHTML = '';
  let leadFormTypeParams = '';

  if (type === 'package') {
    item = PACKAGES.find(p => p.id === id);
    if (!item) return;
    const guests = item.guests ?? 28;
    const bedrooms = item.bedrooms ?? 9;
    const area = item.area || '';
    const firstVilla = item.villaIds?.length ? VILLAS.find(v => v.id === item.villaIds[0]) : null;
    const firstYacht = item.yachtIds?.length ? FLEET.find(f => f.id === item.yachtIds[0]) : null;
    titleHTML = `
      <span class="badge badge-${item.badgeType}" style="margin-bottom:0.5rem">${_d(item, 'badge')}</span>
      <div class="h3">${item.name}</div>
      <div class="body-sm muted">${_d(item, 'subtitle')}</div>
      <div class="package-meta-icons">
        <span class="package-meta-item"><i data-lucide="users" class="icon-teal"></i> ${_t('card.upTo')} ${guests} ${_t('card.guests')}</span>
        <span class="package-meta-item"><i data-lucide="bed" class="icon-teal"></i> ${bedrooms} ${_t('card.bedrooms')}</span>
        ${area ? `<span class="package-meta-item"><i data-lucide="maximize" class="icon-teal"></i> ${area}</span>` : ''}
        <span class="package-meta-item"><i data-lucide="tag" class="icon-teal"></i> ${item.name}</span>
      </div>
      <div class="package-meta-objects">
        ${item.villa ? `
        <button type="button" class="package-meta-object" onclick="openObjectInfoPopover('${item.id}', 'villa')" title="${(item.villa || '').replace(/"/g, '&quot;')}">
          <i data-lucide="home" class="package-meta-object__icon"></i>
          <span class="package-meta-object__label">${_t('modal.villa')}: ${item.villa}</span>
        </button>
        ` : ''}
        ${item.yacht ? `
        <button type="button" class="package-meta-object" onclick="openObjectInfoPopover('${item.id}', 'yacht')" title="${(item.yacht || '').replace(/"/g, '&quot;')}">
          <i data-lucide="ship" class="package-meta-object__icon"></i>
          <span class="package-meta-object__label">${_t('modal.yacht')}: ${item.yacht}</span>
        </button>
        ` : ''}
        ${item.excursion ? `
        <button type="button" class="package-meta-object" onclick="openObjectInfoPopover('${item.id}', 'excursion')" title="${(item.excursion || '').replace(/"/g, '&quot;')}">
          <i data-lucide="map-pin" class="package-meta-object__icon"></i>
          <span class="package-meta-object__label">${_t('modal.excursions')}: ${item.excursion}</span>
        </button>
        ` : ''}
      </div>
    `;
    const isVillaOrYachtDup = (i) => typeof i === 'string' && (i === item.villa || i === item.yacht || (i.startsWith('Вилла ') && item.villa && i.slice(6) === item.villa));
    const includedFiltered = item.included.filter(i => typeof i === 'object' || !isVillaOrYachtDup(i));
    const includedList = includedFiltered;
    const moreCount = 0;
    const pickIncludedIcon = (short) => {
      const s = (short || '').toLowerCase();
      if (s.includes('проживание') || s.includes('вилла') || s.includes('апартамент')) return 'home';
      if (s.includes('уборка')) return 'sparkles';
      if (s.includes('трансфер')) return 'car';
      if (s.includes('катамаран') || s.includes('яхта') || s.includes('катер')) return 'ship';
      if (s.includes('экскурсия') || s.includes('пханг') || s.includes('краби') || s.includes('mantra') || s.includes('hanuman')) return 'map-pin';
      if (s.includes('фотограф')) return 'camera';
      if (s.includes('консьерж') || s.includes('менеджер')) return 'key';
      if (s.includes('бассейн') || s.includes('spa')) return 'waves';
      if (s.includes('электричество') || s.includes('вода')) return 'zap';
      if (s.includes('welcome')) return 'gift';
      return 'sparkle';
    };
    const includedButtonsHTML = includedList.map((i, listIdx) => {
      const short = typeof i === 'string' ? ((window.i18n && window.i18n.lang === 'en' && Array.isArray(item.included_en)) ? (item.included_en[includedFiltered.indexOf(i)] || i) : i) : _d(i, 'short');
      const clickable = typeof i === 'object' && i.popupTitle && i.popupDesc;
      const icon = (typeof i === 'object' && i.icon) || pickIncludedIcon(short);
      const idx = includedFiltered.indexOf(i);
      if (clickable) {
        return `<button type="button" class="included-btn" onclick="openIncludedItemPopover('${item.id}', ${idx})">
          <i data-lucide="${icon}" class="included-btn__icon"></i>
          <span class="included-btn__label" title="${short.replace(/"/g, '&quot;')}">${short}</span>
          <i data-lucide="chevron-right" class="included-btn__chevron"></i>
        </button>`;
      }
      return `<div class="included-btn included-btn--static">
        <i data-lucide="${icon}" class="included-btn__icon"></i>
        <span class="included-btn__label" title="${short.replace(/"/g, '&quot;')}">${short}</span>
      </div>`;
    }).join('');
    const programList = (item.program || []);
    const programMore = 0;
    const sellingList = (item.sellingPoints || []);
    const extrasList = (item.extras || []);
    const extrasMore = 0;
    const panelIncluded = `
      <div class="included-buttons">
        ${includedButtonsHTML}
      </div>
      ${moreCount > 0 ? `<div class="muted" style="font-size:0.75rem;margin-top:0.35rem">${_t('modal.moreItems').replace('{n}', moreCount)}</div>` : ''}
    `;
    const panelProgram = programList.length ? `
      <ul class="modal-included modal-included--compact package-accordion__list">
        ${programList.map(p => `<li><span class="muted" style="font-size:0.7rem">${_t('modal.day')} ${p.day}</span> ${_d(p, 'title')}</li>`).join('')}
        ${programMore > 0 ? `<li class="muted" style="font-size:0.75rem">${_t('modal.moreDays').replace('{n}', programMore)}</li>` : ''}
      </ul>
    ` : `<div class="muted" style="font-size:0.8rem">—</div>`;
    const sellingListEn = (item.sellingPoints_en || []);
    const panelSelling = sellingList.length ? `
      <ul class="modal-included modal-included--compact package-accordion__list">
        ${sellingList.map((s, i) => `<li><i data-lucide="check" class="icon-xs"></i><span>${(window.i18n && window.i18n.lang === 'en' && sellingListEn[i]) ? sellingListEn[i] : s}</span></li>`).join('')}
      </ul>
    ` : `<div class="muted" style="font-size:0.8rem">—</div>`;
    const extrasListEn = (item.extras_en || []);
    const panelExtras = extrasList.length ? `
      <div style="display:flex;align-items:flex-start;gap:0.6rem;background:linear-gradient(135deg,rgba(255,214,0,0.18),rgba(255,180,0,0.10));border:1.5px solid rgba(255,200,0,0.45);border-radius:var(--radius-md);padding:0.75rem 0.9rem;margin-bottom:0.8rem">
        <span style="flex-shrink:0;width:1.5rem;height:1.5rem;background:rgba(255,200,0,0.25);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-top:0.05rem">
          <i data-lucide="tag" style="width:0.8rem;height:0.8rem;color:#d4a000;stroke-width:2.5"></i>
        </span>
        <div>
          <div style="font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#c49000;margin-bottom:0.2rem">${_t('modal.extrasBannerTitle')}</div>
          <div style="font-size:0.78rem;line-height:1.45;color:rgba(220,180,0,0.85)">${_t('modal.extrasBannerText')}</div>
        </div>
      </div>
      <ul class="modal-included modal-included--compact package-accordion__list">
        ${extrasList.map((e, i) => `<li><span>${(window.i18n && window.i18n.lang === 'en' && extrasListEn[i]) ? extrasListEn[i] : e}</span></li>`).join('')}
        ${extrasMore > 0 ? `<li class="muted" style="font-size:0.75rem">${_t('modal.moreOnRequest')}</li>` : ''}
      </ul>
    ` : `<div class="muted" style="font-size:0.8rem">—</div>`;
    infoHTML = `
      <div style="background:var(--surface);border-radius:var(--radius-md);padding:0.75rem 1rem;margin-bottom:0.75rem">
        <div class="body-sm muted" style="margin-bottom:0.15rem;font-size:0.7rem">${_t('modal.packageCost')}</div>
        <div style="font-size:1.4rem;font-weight:700;color:var(--teal)">${item.priceLabel}</div>
        <div class="body-sm muted" style="font-size:0.75rem;margin-bottom:0.75rem">${_d(item, 'nights')} • ${_t('card.groupUpTo')} ${guests} ${_t('card.persons')}</div>
        <button class="btn btn-primary btn-full" onclick="closeItemModal();openLeadForm('${item.id}')">${_t('card.book')}</button>
      </div>
      <p class="body-sm muted" style="margin-bottom:0.6rem;font-size:0.85rem;line-height:1.45">${_d(item, 'description')}</p>
      <div class="package-accordion">
        <div class="package-accordion__tabs">
          <button type="button" class="package-accordion__tab active" onclick="setPackageAccordionTab(0)" data-tab="0">${_t('modal.included')}</button>
          <button type="button" class="package-accordion__tab" onclick="setPackageAccordionTab(1)" data-tab="1">${_t('modal.program')}</button>
          <button type="button" class="package-accordion__tab" onclick="setPackageAccordionTab(2)" data-tab="2">${_t('modal.advantages')}</button>
          <button type="button" class="package-accordion__tab" onclick="setPackageAccordionTab(3)" data-tab="3">${_t('modal.extras')}</button>
        </div>
        <div class="package-accordion__content">
          <div class="package-accordion__panel active" data-panel="0">${panelIncluded}</div>
          <div class="package-accordion__panel" data-panel="1">${panelProgram}</div>
          <div class="package-accordion__panel" data-panel="2">${panelSelling}</div>
          <div class="package-accordion__panel" data-panel="3">${panelExtras}</div>
        </div>
      </div>
      <div class="package-detail-popover" id="package-detail-popover">
        <div class="package-detail-popover__backdrop" onclick="hidePackageDetailPopover()"></div>
        <div class="package-detail-popover__content">
          <button type="button" class="package-detail-popover__close" onclick="hidePackageDetailPopover()" aria-label="${_t('modal.close')}">×</button>
          <div id="package-detail-popover-body"></div>
        </div>
      </div>
    `;
    leadFormTypeParams = `'${item.id}'`;
  } else if (type === 'yacht') {
    item = FLEET.find(y => y.id === id);
    if (!item) return;
    titleHTML = `
      <span class="badge badge-teal" style="margin-bottom:0.4rem">${fleetVibe(item)}</span>
      <div class="h3" style="font-size:1.5rem">${item.name}</div>
    `;
    const rawDesc = (fleetDesc(item) || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const desc = rawDesc.replace(/\. ([А-ЯA-Z])/g, '.<br>$1');
    infoHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:0.75rem">
        ${[['users', _t('modal.guests'), `${_t('card.upTo')} ${item.guests}`], ['maximize', _t('modal.length'), item.length], ['zap', _t('modal.speed'), item.speed]].map(([ic, l, v]) => `
          <div style="background:var(--surface);padding:0.6rem;border-radius:var(--radius-sm);text-align:center">
            <div style="font-size:1.25rem;margin-bottom:0.15rem;color:var(--teal)"><i data-lucide="${ic}"></i></div>
            <div class="label-upper" style="font-size:0.6rem;margin-bottom:0.2rem">${l}</div>
            <div style="font-weight:700;font-size:0.9rem">${v}</div>
          </div>
        `).join('')}
      </div>
      ${desc ? `<p class="body-sm muted" style="font-size:0.85rem;line-height:1.55;margin-bottom:0.75rem">${desc}</p>` : ''}
      <div style="background:linear-gradient(135deg,rgba(64,224,208,0.1),rgba(0,51,68,0.3));border:1px solid var(--border-teal);border-radius:var(--radius-md);padding:0.75rem 1rem;margin-bottom:0">
        <div class="label-upper" style="margin-bottom:0.3rem;font-size:0.65rem">${_t('modal.allInclusiveCost')}</div>
        <div style="font-size:1.5rem;font-weight:700;color:var(--teal)">${item.priceLabel}</div>
        <div class="body-sm muted" style="font-size:0.75rem;margin-bottom:0.75rem">${_t('modal.yachtIncludes')}</div>
        <button class="btn btn-primary btn-full" onclick="closeItemModal();openLeadForm(null,'${item.name.replace(/'/g, "\\'")}',null,null,null,{maxGuests:${item.guests ?? 28}})">${_t('card.book')}</button>
      </div>
    `;
    leadFormTypeParams = `null, '${item.name}'`;
  } else if (type === 'villa') {
    item = VILLAS.find(v => v.id === id);
    if (!item) return;
    titleHTML = `
      <span class="badge badge-white" style="margin-bottom:0.4rem">${item.code}</span>
      <div class="h3" style="font-size:1.5rem">${item.name}</div>
      <div class="body-sm muted" style="font-size:0.8rem">${item.area}</div>
    `;
    const villaFeatures = item.features.slice(0, 6);
    infoHTML = `
      <div style="background:var(--surface);border-radius:var(--radius-md);padding:0.75rem 1rem;margin-bottom:0.75rem">
        <div class="body-sm muted" style="margin-bottom:0.15rem;font-size:0.7rem">${_t('modal.cost')}</div>
        <div style="font-size:1.4rem;font-weight:700;color:var(--teal)">${_d(item, 'price')}</div>
        <div class="body-sm muted" style="font-size:0.75rem;margin-bottom:0.75rem">${item.bedrooms} ${_t('modal.bedrooms').toLowerCase()} • ${_t('card.upTo')} ${item.guests} ${_t('card.guests')}</div>
        <button class="btn btn-primary btn-full" onclick="closeItemModal();openLeadForm(null,null,'${item.name.replace(/'/g, "\\'")}')"> ${_t('card.book')}</button>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem;margin-bottom:0.75rem">
        <div style="background:var(--surface);padding:0.6rem;border-radius:var(--radius-sm);text-align:center">
          <div style="font-size:1.25rem;margin-bottom:0.15rem;color:var(--teal)"><i data-lucide="bed"></i></div>
          <div class="label-upper" style="font-size:0.6rem;margin-bottom:0.2rem">${_t('modal.bedrooms')}</div>
          <div style="font-weight:700;font-size:0.9rem">${item.bedrooms}</div>
        </div>
        <div style="background:var(--surface);padding:0.6rem;border-radius:var(--radius-sm);text-align:center">
          <div style="font-size:1.25rem;margin-bottom:0.15rem;color:var(--teal)"><i data-lucide="users"></i></div>
          <div class="label-upper" style="font-size:0.6rem;margin-bottom:0.2rem">${_t('modal.guests')}</div>
          <div style="font-weight:700;font-size:0.9rem">${_t('card.upTo')} ${item.guests}</div>
        </div>
      </div>
      <p class="body-sm muted" style="margin-bottom:0.6rem;font-size:0.85rem;line-height:1.45">${_d(item, 'highlight')}</p>
      <div class="body-sm" style="font-weight:700;margin-bottom:0.4rem;color:var(--text);font-size:0.8rem">${_t('villas.features')}:</div>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:0">
        ${(window.i18n && window.i18n.lang === 'en' && item.features_en ? item.features_en : item.features).slice(0, 6).map(f => `<span class="badge badge-teal" style="font-size:0.7rem;padding:0.25rem 0.5rem">${f}</span>`).join('')}
        ${item.features.length > 6 ? `<span class="badge" style="font-size:0.65rem;opacity:0.8">+${item.features.length - 6}</span>` : ''}
      </div>
    `;
    leadFormTypeParams = `null, null, '${item.name}'`;
  } else if (type === 'tour') {
    item = LOCATIONS.find(t => t.id === id);
    // Fetch full data if it's a partial "preview" item or missing entirely
    if (!item || !item.itinerary || item.itinerary.length === 0) {
      const fullItem = await fetchTourById(id);
      if (!fullItem) return;
      if (item) {
        // Merge full data into existing location object (to keep _en fields if we added them to preview)
        Object.assign(item, fullItem);
      } else {
        item = fullItem;
        LOCATIONS.push(item);
      }
    }
    titleHTML = `
      <span class="badge badge-teal" style="margin-bottom:0.4rem">${item.tag}</span>
      <div class="h3" style="font-size:1.5rem">${_d(item, 'name')}</div>
    `;
    const isEn = window.i18n && window.i18n.lang === 'en';
    const rawIncluded = (item.included || []).slice(0, 8);
    const includedList = isEn && item.included_en && item.included_en.length ? item.included_en.slice(0, 8) : rawIncluded;

    const rawItinerary = (item.itinerary || []).slice(0, 10);
    const itineraryList = isEn && item.itinerary_en && item.itinerary_en.length ? item.itinerary_en.slice(0, 10) : rawItinerary;

    const rawWhatToBring = item.what_to_bring || [];
    const whatToBringList = isEn && item.what_to_bring_en && item.what_to_bring_en.length ? item.what_to_bring_en : rawWhatToBring;

    const rawCancellation = item.cancellation || [];
    const cancellationList = isEn && item.cancellation_en && item.cancellation_en.length ? item.cancellation_en : rawCancellation;

    const panelIncluded = `
      <ul class="modal-included modal-included--compact package-accordion__list">
        ${includedList.map(i => `<li><i data-lucide="check" class="icon-xs"></i><span>${i}</span></li>`).join('')}
      </ul>
    `;
    const panelProgram = itineraryList.length ? `
      <ul class="modal-included modal-included--compact package-accordion__list">
        ${itineraryList.map(p => `<li><span class="muted" style="font-size:0.7rem">${p.time}</span> ${p.text}</li>`).join('')}
      </ul>
    ` : `<div class="muted" style="font-size:0.8rem">—</div>`;
    const panelBring = whatToBringList.length ? `
      <ul class="modal-included modal-included--compact package-accordion__list">
        ${whatToBringList.map(b => `<li><i data-lucide="info" class="icon-xs"></i><span>${b}</span></li>`).join('')}
      </ul>
    ` : `<div class="muted" style="font-size:0.8rem">—</div>`;
    const panelCancel = cancellationList.length ? `
      <ul class="modal-included modal-included--compact package-accordion__list">
        ${cancellationList.map(c => `<li><span>${c}</span></li>`).join('')}
      </ul>
    ` : `<div class="muted" style="font-size:0.8rem">—</div>`;

    infoHTML = `
      <div style="background:var(--surface);border-radius:var(--radius-md);padding:0.75rem 1rem;margin-bottom:0.75rem">
        <div class="body-sm muted" style="margin-bottom:0.15rem;font-size:0.7rem">${_t('modal.tourCost')}</div>
        <div style="font-size:1.4rem;font-weight:700;color:var(--teal)">${item.priceLabel}</div>
        <div class="body-sm muted" style="font-size:0.75rem;margin-bottom:0.75rem">${_t('modal.tourPerDay')}</div>
        <button class="btn btn-primary btn-full" onclick="closeItemModal();openLeadForm(null,null,null,'${_t('form.tourPrefix')}${item.name.replace(/'/g, "\\'")}')"> ${_t('modal.order')}</button>
      </div>
      <p class="body-sm muted" style="margin-bottom:0.6rem;font-size:0.85rem;line-height:1.45">${_d(item, 'desc')}</p>
      <div class="package-accordion">
        <div class="package-accordion__tabs">
          <button type="button" class="package-accordion__tab active" onclick="setPackageAccordionTab(0)" data-tab="0">${_t('modal.included')}</button>
          <button type="button" class="package-accordion__tab" onclick="setPackageAccordionTab(1)" data-tab="1">${_t('modal.program')}</button>
          <button type="button" class="package-accordion__tab" onclick="setPackageAccordionTab(2)" data-tab="2">${_t('modal.whatToBring')}</button>
          <button type="button" class="package-accordion__tab" onclick="setPackageAccordionTab(3)" data-tab="3">${_t('modal.cancellation')}</button>
        </div>
        <div class="package-accordion__content">
          <div class="package-accordion__panel active" data-panel="0">${panelIncluded}</div>
          <div class="package-accordion__panel" data-panel="1">${panelProgram}</div>
          <div class="package-accordion__panel" data-panel="2">${panelBring}</div>
          <div class="package-accordion__panel" data-panel="3">${panelCancel}</div>
        </div>
      </div>
    `;
    leadFormTypeParams = `null, null, null, '${_t('form.tourPrefix')}${item.name.replace(/'/g, "\\'")}'`;
  }

  // Store for step 2
  currentItemModalData = { type, id, item };

  // Reset to step 1
  itemModalStep = 1;
  document.getElementById('item-modal-step-1').style.display = '';
  document.getElementById('item-modal-step-2').style.display = 'none';

  // Populate info column (compact for zero-scroll)
  const infoEl = document.getElementById('item-modal-info');
  const contentEl = document.querySelector('.item-modal-content');
  if (contentEl) {
    contentEl.style.color = '#EEF4F6';
    contentEl.style.backgroundColor = '#0D1E2A';
  }
  infoEl.style.color = '#EEF4F6';
  infoEl.innerHTML = `
    <div style="margin-bottom:1rem;">${titleHTML}</div>
    ${infoHTML}
  `;

  // Provide fallback image array if missing (keep full URLs for fullscreen)
  currentGalleryImages = item.images && item.images.length > 0 ? item.images : [item.img];
  currentGalleryIndex = 0;

  // Update main gallery image — medium size (full loads ONLY in fullscreen)
  document.getElementById('item-gallery-main-img').src = ImgUtils.toMedium(currentGalleryImages[0]);

  // Render thumbs + show/hide arrows
  const thumbsContainer = document.getElementById('item-gallery-thumbs');
  const thumbsWrap = thumbsContainer?.parentElement;
  const prevBtn = document.getElementById('item-gallery-prev');
  const nextBtn = document.getElementById('item-gallery-next');
  const thumbsStripPrev = document.getElementById('item-gallery-thumbs-prev');
  const thumbsStripNext = document.getElementById('item-gallery-thumbs-next');
  const multi = currentGalleryImages.length > 1;
  if (multi) {
    if (thumbsWrap) thumbsWrap.style.display = 'flex';
    thumbsContainer.innerHTML = currentGalleryImages.map((imgUrl, idx) => `
      <button type="button" class="gallery-thumb ${idx === 0 ? 'active' : ''}" data-idx="${idx}" onclick="event.stopPropagation();setGalleryImage(${idx})" aria-label="${typeof _t === 'function' ? _t('aria.photoN').replace('{n}', idx + 1) : 'Фото ' + (idx + 1)}">
        <img src="${ImgUtils.toThumb(imgUrl)}" alt="">
      </button>
    `).join('');
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
    const showThumbsArrows = currentGalleryImages.length > 6;
    if (thumbsStripPrev) thumbsStripPrev.style.display = showThumbsArrows ? 'flex' : 'none';
    if (thumbsStripNext) thumbsStripNext.style.display = showThumbsArrows ? 'flex' : 'none';
  } else {
    if (thumbsWrap) thumbsWrap.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (thumbsStripPrev) thumbsStripPrev.style.display = 'none';
    if (thumbsStripNext) thumbsStripNext.style.display = 'none';
  }

  const overlay = document.getElementById('item-modal-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
}

function closeItemModal() {
  hidePackageDetailPopover();
  closeIncludedItemPopover();
  closeObjectInfoPopover();
  document.getElementById('item-modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  if (itemModalStep === 2) {
    const leadWrapper = document.querySelector('.lead-form-wrapper');
    const leadModalInner = document.querySelector('.lead-modal-inner');
    if (leadWrapper && leadModalInner && leadWrapper.parentNode?.id === 'item-modal-lead-container') {
      leadModalInner.insertBefore(leadWrapper, leadModalInner.firstElementChild);
      leadWrapper.style.boxShadow = '';
      leadWrapper.style.border = '';
      const closeZone = document.querySelector('.lead-modal-close-zone');
      if (closeZone) closeZone.style.display = '';
    }
    itemModalStep = 1;
  }
}

/* ============================================================
   GALLERY JS LOGIC
   ============================================================ */
function setGalleryImage(idx) {
  currentGalleryIndex = idx;
  document.getElementById('item-gallery-main-img').src = ImgUtils.toMedium(currentGalleryImages[idx]);

  // Update active state on thumbs
  const thumbs = document.querySelectorAll('.gallery-thumb');
  thumbs.forEach((t, i) => {
    if (i === idx) t.classList.add('active');
    else t.classList.remove('active');
  });

  scrollThumbIntoView(idx);
}

function scrollThumbIntoView(idx) {
  const thumb = document.querySelector(`.gallery-thumb[data-idx="${idx}"]`);
  if (thumb) {
    thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

function scrollThumbsLeft() {
  const thumbs = document.getElementById('item-gallery-thumbs');
  if (thumbs) thumbs.scrollBy({ left: -120, behavior: 'smooth' });
}

function scrollThumbsRight() {
  const thumbs = document.getElementById('item-gallery-thumbs');
  if (thumbs) thumbs.scrollBy({ left: 120, behavior: 'smooth' });
}

function itemGalleryPrev() {
  currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
  setGalleryImage(currentGalleryIndex);
}

function itemGalleryNext() {
  currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
  setGalleryImage(currentGalleryIndex);
}

function openFullscreenGallery() {
  const overlay = document.getElementById('fullscreen-gallery-overlay');
  // Full-size loads ONLY here — not before, saves memory and bandwidth
  document.getElementById('fs-gallery-img').src = ImgUtils.toFull(currentGalleryImages[currentGalleryIndex]);
  updateFsGalleryCounter();

  // Show/Hide prev next buttons based on count
  document.getElementById('fs-gallery-prev').style.display = currentGalleryImages.length > 1 ? 'flex' : 'none';
  document.getElementById('fs-gallery-next').style.display = currentGalleryImages.length > 1 ? 'flex' : 'none';
  document.getElementById('fs-gallery-counter').style.display = currentGalleryImages.length > 1 ? 'block' : 'none';

  overlay.classList.add('open');

  // Listen for keyboard
  document.addEventListener('keydown', handleFsGalleryKeyboard);

  // Listen for backdrop click to close
  overlay.addEventListener('click', handleFsGalleryBackdropClick);
}

function closeFullscreenGallery() {
  const overlay = document.getElementById('fullscreen-gallery-overlay');
  overlay.classList.remove('open');

  // Clear full-size src to free memory — loads again only when fullscreen reopens
  const fsImg = document.getElementById('fs-gallery-img');
  if (fsImg) fsImg.src = '';

  document.removeEventListener('keydown', handleFsGalleryKeyboard);
  overlay.removeEventListener('click', handleFsGalleryBackdropClick);
}

function handleFsGalleryBackdropClick(e) {
  if (e.target.id === 'fullscreen-gallery-overlay') {
    closeFullscreenGallery();
  }
}

function fsGalleryNext(e) {
  if (e) e.stopPropagation();
  currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
  updateFsView();
}

function fsGalleryPrev(e) {
  if (e) e.stopPropagation();
  currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
  updateFsView();
}

function updateFsView() {
  document.getElementById('fs-gallery-img').src = ImgUtils.toFull(currentGalleryImages[currentGalleryIndex]);
  updateFsGalleryCounter();
  setGalleryImage(currentGalleryIndex); // Sync underlying thumbnail state too
}

function updateFsGalleryCounter() {
  document.getElementById('fs-gallery-counter').innerText = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;
}

function handleFsGalleryKeyboard(e) {
  if (e.key === 'Escape') closeFullscreenGallery();
  if (e.key === 'ArrowRight') fsGalleryNext();
  if (e.key === 'ArrowLeft') fsGalleryPrev();
}

/* ============================================================
   AZBUKA MODAL (Kept for Old logic)
   ============================================================ */
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

/* ============================================================
   INIT ALL RENDERS
   ============================================================ */
function renderAzbuka() {
  const container = document.getElementById('azbuka-grid');
  const navContainer = document.getElementById('azbuka-nav');
  if (!container) return;
  const list = getAzbukaList();

  container.innerHTML = list.map(item => `
    <article class="azbuka-card" id="azbuka-card-${item.letter}" onclick="openAzbukaModal('${item.letter}')">
      <div class="azbuka-card__bg-letter">${item.letter}</div>
      <div class="azbuka-card__icon"><i data-lucide="${item.icon}"></i></div>
      <div class="azbuka-card__title"><span class="azbuka-card__letter">${item.letter}</span> ${item.title}</div>
      <div class="azbuka-card__short">${item.short}</div>
      <div class="azbuka-card__more">${_t('azbuka.readMore')} <i data-lucide="arrow-right" class="icon-xs"></i></div>
    </article>
  `).join('');

  if (navContainer) {
    navContainer.innerHTML = list.map((item, i) => `
      <button class="azbuka-nav-btn ${i === 0 ? 'active' : ''}" data-letter="${item.letter}" onclick="scrollToAzbuka('${item.letter}')">
        ${item.letter}
      </button>
    `).join('');
  }

  if (window.lucide) lucide.createIcons();

  // Initialize slider interactions
  setTimeout(() => initAzbukaSlider(), 100);
}

function scrollToAzbuka(letter) {
  const card = document.getElementById(`azbuka-card-${letter}`);
  const slider = document.getElementById('azbuka-grid');
  if (card && slider) {
    const scrollLeft = card.offsetLeft - slider.offsetLeft - (slider.clientWidth / 2) + (card.offsetWidth / 2);
    slider.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }
}

function initAzbukaSlider() {
  const slider = document.getElementById('azbuka-grid');
  const prevBtn = document.getElementById('azbuka-prev');
  const nextBtn = document.getElementById('azbuka-next');
  if (!slider) return;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      slider.scrollBy({ left: -360, behavior: 'smooth' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slider.scrollBy({ left: 360, behavior: 'smooth' });
    });
  }

  const navBtns = document.querySelectorAll('.azbuka-nav-btn');
  if (!navBtns.length) return;

  const observer = new IntersectionObserver((entries) => {
    // Only care about cards firmly entering view
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.id.replace('azbuka-card-', '');
        navBtns.forEach(btn => {
          if (btn.dataset.letter === activeId) {
            btn.classList.add('active');
            // Auto scroll nav to keep active letter visible
            const nav = document.getElementById('azbuka-nav');
            if (nav) {
              const scrollLeft = btn.offsetLeft - nav.offsetLeft - (nav.clientWidth / 2) + (btn.offsetWidth / 2);
              nav.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
          } else {
            btn.classList.remove('active');
          }
        });
      }
    });
  }, {
    root: slider,
    threshold: 0.6
  });

  document.querySelectorAll('.azbuka-card').forEach(card => observer.observe(card));

  // Add drag-to-scroll for the nav bar
  const navContainer = document.getElementById('azbuka-nav');
  if (navContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;

    navContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      navContainer.style.cursor = 'grabbing';
      startX = e.pageX - navContainer.offsetLeft;
      scrollLeft = navContainer.scrollLeft;
    });
    navContainer.addEventListener('mouseleave', () => {
      isDown = false;
      navContainer.style.cursor = 'grab';
    });
    navContainer.addEventListener('mouseup', () => {
      isDown = false;
      navContainer.style.cursor = 'grab';
    });
    navContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - navContainer.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast
      navContainer.scrollLeft = scrollLeft - walk;
    });
  }
}

function initComponents() {
  const isHomePage = !!document.getElementById('packages');
  const isFleetPage = !!document.getElementById('fleet-more-btn');
  let fleetLimit = isHomePage ? 9 : Infinity;
  if (isFleetPage) fleetLimit = 9;
  window.PACKAGES = PACKAGES;
  window.FLEET = FLEET;
  renderPackages();
  const fleetResult = renderFleet('all', 0, Infinity, 'expensive', fleetLimit);
  renderVillas(isHomePage ? 9 : Infinity);
  const isToursPage = !!document.getElementById('tours-more-btn');
  if (isHomePage) {
    fetchToursPreview();
  } else if (document.getElementById('locations-grid')) {
    if (isToursPage) {
      fetchTours(true).then(() => {
        let toursLimit = 9;
        const moreBtn = document.getElementById('tours-more-btn');
        if (moreBtn) {
          moreBtn.addEventListener('click', () => {
            toursLimit += 9;
            const result = renderLocations(LOCATIONS, toursLimit);
            if (result) {
              moreBtn.style.display = result.shown >= result.total ? 'none' : '';
              moreBtn.textContent = result.shown >= result.total ? '' : (typeof _t === 'function' ? _t('common.viewMore').replace('{n}', result.total - result.shown) : `Смотреть ещё (${result.total - result.shown})`);
            }
          });
        }
        const result = renderLocations(LOCATIONS, 9);
        if (result && moreBtn) {
          moreBtn.style.display = result.shown >= result.total ? 'none' : '';
          moreBtn.textContent = result.shown >= result.total ? '' : (typeof _t === 'function' ? _t('common.viewMore').replace('{n}', result.total - result.shown) : `Смотреть ещё (${result.total - result.shown})`);
        }
      });
    } else {
      fetchTours();
    }
  }
  renderServices();
  renderFAQ();
  renderTestimonials();
  renderAzbuka();

  function getFleetSort() {
    const sortBtn = document.querySelector('.filter-btn[data-fleet-sort].active');
    return sortBtn ? sortBtn.dataset.fleetSort : 'expensive';
  }

  function applyFleetFilters() {
    const typeBtn = document.querySelector('.filter-btn[data-fleet-filter].active');
    const type = typeBtn ? typeBtn.dataset.fleetFilter : 'all';
    const { priceMin, priceMax } = getFleetPriceRange();
    const sort = getFleetSort();
    const result = renderFleet(type, priceMin, priceMax, sort, fleetLimit);
    if (isFleetPage && result) updateFleetMoreButton(result);
  }

  // Fleet filter: type buttons
  document.querySelectorAll('.filter-btn[data-fleet-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-fleet-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFleetFilters();
    });
  });

  // Fleet sort: expensive / cheap
  document.querySelectorAll('.filter-btn[data-fleet-sort]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-fleet-sort]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFleetFilters();
    });
  });

  // Fleet filter: price range slider
  const PRICE_MAX_VAL = 2000000;
  const priceMinEl = document.getElementById('price-min');
  const priceMaxEl = document.getElementById('price-max');
  const priceFromLabel = document.getElementById('price-from-label');
  const priceToLabel = document.getElementById('price-to-label');
  const priceRangeFill = document.getElementById('price-range-fill');

  function getFleetPriceRange() {
    const min = priceMinEl ? parseInt(priceMinEl.value) || 0 : 0;
    const max = priceMaxEl ? parseInt(priceMaxEl.value) || PRICE_MAX_VAL : PRICE_MAX_VAL;
    return { priceMin: min, priceMax: max === PRICE_MAX_VAL ? Infinity : max };
  }

  function formatPrice(val) {
    return val.toLocaleString('ru-RU') + ' ฿';
  }

  function updatePriceLabelsAndFill() {
    const min = parseInt(priceMinEl?.value) || 0;
    const max = parseInt(priceMaxEl?.value) || PRICE_MAX_VAL;
    if (priceFromLabel) priceFromLabel.textContent = `${_t('card.from')} ${formatPrice(min)}`;
    if (priceToLabel) priceToLabel.textContent = `${_t('card.upTo')} ${formatPrice(max)}`;
    if (priceRangeFill) {
      const left = (min / PRICE_MAX_VAL) * 100;
      const right = (max / PRICE_MAX_VAL) * 100;
      priceRangeFill.style.setProperty('--fill-left', `${left}%`);
      priceRangeFill.style.setProperty('--fill-right', `${right}%`);
    }
  }

  function applyFleetPriceFilter() {
    const typeBtn = document.querySelector('.filter-btn[data-fleet-filter].active');
    const type = typeBtn ? typeBtn.dataset.fleetFilter : 'all';
    const { priceMin, priceMax } = getFleetPriceRange();
    const sort = getFleetSort();
    const result = renderFleet(type, priceMin, priceMax, sort, fleetLimit);
    if (isFleetPage && result) updateFleetMoreButton(result);
  }

  function updateFleetMoreButton(result) {
    const moreBtn = document.getElementById('fleet-more-btn');
    if (!moreBtn) return;
    moreBtn.style.display = result.shown >= result.total ? 'none' : '';
    moreBtn.textContent = result.shown >= result.total ? '' : (typeof _t === 'function' ? _t('common.viewMore').replace('{n}', result.total - result.shown) : `Смотреть ещё (${result.total - result.shown})`);
  }
  if (isFleetPage) {
    if (fleetResult) updateFleetMoreButton(fleetResult);
    const moreBtn = document.getElementById('fleet-more-btn');
    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        fleetLimit += 9;
        applyFleetFilters();
      });
    }
  }

  if (priceMinEl && priceMaxEl) {
    updatePriceLabelsAndFill();
    [priceMinEl, priceMaxEl].forEach(input => {
      input.addEventListener('input', () => {
        let min = parseInt(priceMinEl.value);
        let max = parseInt(priceMaxEl.value);
        if (min > max) {
          if (input === priceMinEl) priceMaxEl.value = min;
          else priceMinEl.value = max;
        }
        updatePriceLabelsAndFill();
        applyFleetPriceFilter();
      });
    });
  }

  // Modal close on overlay click
  document.getElementById('modal-overlay')?.addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });

  // Item modal close on overlay (backdrop) click
  document.getElementById('item-modal-overlay')?.addEventListener('click', function (e) {
    if (e.target === this) closeItemModal();
  });

  // Navbar scroll effect
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) nav?.classList.add('nav--scrolled');
    else nav?.classList.remove('nav--scrolled');
  }, { passive: true });

  // Nav active state by section in view or hash
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  const sectionIds = ['packages', 'fleet', 'villas', 'concierge', 'faq'];

  function setNavActive() {
    const hash = window.location.hash.slice(1);
    if (hash && sectionIds.includes(hash)) {
      navLinks.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + hash);
      });
      return;
    }
    const vh = window.innerHeight;
    let best = null;
    let bestScore = -1;
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      if (visible > 0 && visible > bestScore) {
        bestScore = visible;
        best = id;
      }
    });
    if (best) {
      navLinks.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + best);
      });
    }
  }

  setNavActive();
  window.addEventListener('scroll', setNavActive, { passive: true });
  window.addEventListener('hashchange', setNavActive);
}
