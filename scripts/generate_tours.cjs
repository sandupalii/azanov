
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MD_PATH = path.join(ROOT, 'assets/tours/tours-2026.md');
const INDEX_OUT = path.join(ROOT, 'assets/tours/tours_index.json');
const PREVIEW_OUT = path.join(ROOT, 'assets/tours/tours_preview.json');
const IMG_DIR = path.join(ROOT, 'assets/tours/azanvtravel-tours');

const md = fs.readFileSync(MD_PATH, 'utf8');

// Get all available image numbers
const availableImages = new Set(
  fs.readdirSync(IMG_DIR)
    .filter(f => /^\d+\.jpg$/.test(f))
    .map(f => parseInt(f))
);

// Split into tour blocks by ### N.
const tourBlocks = md.split(/\n(?=### \d+\.)/).filter(b => /^### \d+\./.test(b.trim()));

function slug(num, title) {
  const s = title.toLowerCase()
    .replace(/[^a-z0-9а-яё\s]/gi, '')
    .replace(/\s+/g, '-')
    .substring(0, 40)
    .replace(/-+$/, '');
  return `t${String(num).padStart(2, '0')}-${s.replace(/[а-яё]/gi, '') || 'tour'}`.replace(/-{2,}/g,'-').replace(/-$/,'');
}

function extract(block, label) {
  const re = new RegExp(`\\*\\*${label}\\*\\*:?\\s*(.+?)(?=\\n\\n|\\n\\*\\*|$)`, 's');
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

function extractPrice(block) {
  const lines = block.split('\n').filter(l => /^-\s/.test(l));
  // Find first numeric price
  for (const l of lines) {
    const nums = l.match(/(\d[\d\s]+)/g);
    if (nums) {
      const first = parseInt(nums[0].replace(/\s/g, ''));
      if (first > 0) return first;
    }
  }
  return 0;
}

function extractPriceLabel(block) {
  const lines = block.split('\n').filter(l => /^-\s/.test(l));
  if (!lines.length) return 'По запросу';
  const first = lines[0].replace(/^-\s*/, '').trim();
  // Extract just the first price pair
  const m = first.match(/(\d[\d\s]+(?:\/[\d\s]+)?)/);
  return m ? `от ${m[1].split('/')[0].trim()} ฿` : 'По запросу';
}

function extractIncluded(block, lang='ru') {
  const label = lang === 'ru' ? "What's Included RU" : "What's Included EN";
  const val = extract(block, label);
  if (!val) return [];
  return val.split(',').map(s => s.trim()).filter(Boolean);
}

const tours = [];

for (const block of tourBlocks) {
  const numMatch = block.match(/^### (\d+)\./);
  if (!numMatch) continue;
  const num = parseInt(numMatch[1]);

  const titleRuMatch = block.match(/\*\*Heading RU:\*\*\s*(.+)/);
  const titleEnMatch = block.match(/\*\*Heading EN:\*\*\s*(.+)/);
  const descRuMatch = block.match(/\*\*Short Description RU:\*\*\s*(.+)/);
  const descEnMatch = block.match(/\*\*Short Description EN:\*\*\s*(.+)/);
  const fullRuMatch = block.match(/\*\*Full Description RU:\*\*\s*([\s\S]+?)(?=\n\*\*)/);
  const fullEnMatch = block.match(/\*\*Full Description EN:\*\*\s*([\s\S]+?)(?=\n\*\*)/);

  if (!titleRuMatch) continue;

  const titleRu = titleRuMatch[1].trim();
  const titleEn = titleEnMatch ? titleEnMatch[1].trim() : titleRu;
  const descRu = descRuMatch ? descRuMatch[1].trim() : '';
  const descEn = descEnMatch ? descEnMatch[1].trim() : descRu;
  const fullRu = fullRuMatch ? fullRuMatch[1].trim() : descRu;
  const fullEn = fullEnMatch ? fullEnMatch[1].trim() : descEn;

  const price = extractPrice(block);
  const priceLabel = extractPriceLabel(block);
  const includedRu = extractIncluded(block, 'ru');
  const includedEn = extractIncluded(block, 'en');

  // Find image: use tour number if available, else skip
  const imgNum = String(num).padStart(2, '0');
  const imgFile = `${num}.jpg`;
  const hasImage = availableImages.has(num);
  const imgPath = `assets/tours/azanvtravel-tours/${imgNum}.jpg`;

  // Build price breakdown lines
  const priceLines = block.split('\n')
    .filter(l => /^-\s/.test(l))
    .map(l => l.replace(/^-\s*/, '').trim());

  // Generate SKU from number + first letters of english title
  const sku = 'T' + String(num).padStart(2, '0');

  const id = slug(num, titleEn);

  const waText = encodeURIComponent(`Здравствуйте, интересует тур *${titleRu}*, пожалуйста, свяжитесь со мной`);
  const detailsHtml = `<a href="https://wa.me/66951905999?text=${waText}" target="_blank" rel="noreferrer noopener">Быстрый заказ</a><br /><br /><strong style="font-size: 20px;">${titleRu}</strong><br /><span style="font-size: 18px;">${fullRu}</span><br /><br /><strong style="font-size: 20px;">Стоимость:</strong><br />${priceLines.map(l => `<span style="font-size: 18px;">${l}</span>`).join('<br />')}`;

  const imgNums = [];
  if (hasImage) imgNums.push(imgFile);

  tours.push({
    id,
    title: titleRu,
    description: descRu,
    price,
    old_price: null,
    sku,
    local_images: hasImage ? [imgFile] : ['01.jpg'],
    details_html: detailsHtml,
    price_adult: priceLabel,
    price_child: '',
    child_age: '',
    extra_charges: [],
    days: 'По запросу',
    itinerary: [],
    notes: 'Программа может меняться в связи с погодными условиями.',
    included: includedRu,
    cancellation: [
      'При неявке — 100% без возврата',
      'Отмена менее 24ч — возврат не осуществляется',
      'Отмена менее 72ч — возврат 50%',
      'Отмена более 72ч — удерживается 10%'
    ],
    what_to_bring: ['Солнцезащитный крем', 'Купальник', 'Полотенце', 'Фотоаппарат', 'Наличные'],
    title_en: titleEn,
    description_en: descEn,
    itinerary_en: [],
    included_en: includedEn,
    what_to_bring_en: ['Sunscreen', 'Swimwear', 'Towel', 'Camera', 'Cash'],
    cancellation_en: [
      'No-show — 100% charged, no refund',
      'Cancellation < 24h — no refund',
      'Cancellation < 72h — 50% refund',
      'Cancellation > 72h — 10% processing fee'
    ],
    child_age_en: '',
    extra_charges_en: [],
    _num: num,
    _hasImage: hasImage
  });
}

// Write tours_index.json
fs.writeFileSync(INDEX_OUT, JSON.stringify(tours, null, 2));
console.log(`✅ tours_index.json written with ${tours.length} tours`);

// Build tours_preview.json — pick 9 good tours with images
const withImages = tours.filter(t => t._hasImage && t.price > 0);
const preview = [1, 4, 17, 20, 35, 37, 15, 23, 54].map(num => {
  const t = tours.find(x => x._num === num) || withImages[0];
  if (!t) return null;
  const imgNum = String(t._num).padStart(2, '0');
  return {
    id: t.id,
    name: t.title,
    name_en: t.title_en,
    desc: t.description,
    desc_en: t.description_en,
    tag: t.sku,
    img: `assets/tours/azanvtravel-tours/${imgNum}.jpg`,
    priceLabel: t.price_adult
  };
}).filter(Boolean);

fs.writeFileSync(PREVIEW_OUT, JSON.stringify(preview, null, 2));
console.log(`✅ tours_preview.json written with ${preview.length} entries`);

// Summary
console.log('\nTours generated:');
tours.forEach(t => console.log(`  [${String(t._num).padStart(2,'0')}] ${t.sku} — ${t.title.substring(0,50)} | img:${t._hasImage?'✓':'✗'} | price:${t.price}`));
