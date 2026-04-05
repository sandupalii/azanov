const fs = require('fs');

try {
  const indexPath = 'assets/tours/tours_index.json';
  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

  const previewData = indexData.map(tour => {
    return {
      id: tour.id,
      name: tour.title,
      name_en: tour.title_en || tour.title,
      desc: tour.description || "",
      desc_en: tour.description_en || "",
      tag: tour.sku || "Tour",
      img: `assets/tours/${tour.id}/${tour.local_images[0]}`,
      priceLabel: tour.price ? `от ${tour.price} ฿` : ""
    };
  });

  fs.writeFileSync('assets/tours/tours_preview.json', JSON.stringify(previewData, null, 2));
  console.log('Fixed tours_preview.json with', previewData.length, 'tours!');
} catch (e) {
  console.error("Error:", e);
}
