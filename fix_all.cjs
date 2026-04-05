const fs = require('fs');
const path = require('path');

const toursDir = path.join(__dirname, 'assets', 'tours');
const dirs = [
  'similan-islands',
  'exploring',
  'carnival-magic',
  'phi-phi-bamboo',
  'phi-phi-maiton',
  'phi-phi-maya-bamboo',
  'siam-niramit',
  'phi-phi-khai'
];

const allTours = [];

dirs.forEach(dir => {
  const tourPath = path.join(toursDir, dir, 'tour.json');
  if (fs.existsSync(tourPath)) {
    const tourData = JSON.parse(fs.readFileSync(tourPath, 'utf8'));
    
    // Find actual images
    const imagesDir = path.join(toursDir, dir, 'images');
    if (fs.existsSync(imagesDir)) {
      const actualImages = fs.readdirSync(imagesDir)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort((a, b) => {
          // Attempt smart sorting (e.g., photo-1 vs photo-10)
          return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});
        })
        .map(f => 'images/' + f);
        
      if (actualImages.length > 0) {
        tourData.local_images = actualImages;
      }
    }
    
    fs.writeFileSync(tourPath, JSON.stringify(tourData, null, 2));
    allTours.push(tourData);
    console.log(`Updated images for ${dir}`);
  }
});

fs.writeFileSync(path.join(toursDir, 'tours_index.json'), JSON.stringify(allTours, null, 2));
console.log('Rebuilt tours_index.json');

const previewData = allTours.map(tour => {
  return {
    id: tour.id,
    name: tour.title,
    name_en: tour.title_en || tour.title,
    desc: tour.description || "",
    desc_en: tour.description_en || "",
    tag: tour.sku || "Tour",
    img: tour.local_images && tour.local_images.length > 0 ? `assets/tours/${tour.id}/${tour.local_images[0]}` : "",
    priceLabel: tour.price ? `от ${tour.price} ฿` : ""
  };
});

fs.writeFileSync(path.join(toursDir, 'tours_preview.json'), JSON.stringify(previewData, null, 2));
console.log('Rebuilt tours_preview.json');
