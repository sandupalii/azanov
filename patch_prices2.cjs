const fs = require('fs');
const path = require('path');

const componentsJsPath = path.join(__dirname, 'js/components.js');
const pricesJsonPath = path.join(__dirname, 'scripts/thai_charters_prices_speeds.json');

const pricesData = JSON.parse(fs.readFileSync(pricesJsonPath, 'utf8'));
let componentsJs = fs.readFileSync(componentsJsPath, 'utf8');

// Function to normalize strings for comparison
function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Map pricesData to normalized keys
const normalizedPrices = {};
for (const [key, val] of Object.entries(pricesData)) {
    if (val.price && val.price > 0) {
        normalizedPrices[normalize(key)] = val;
    }
}

// Let's add fallbacks for the missing ones found earlier:
const fallbacks = {
    'lucky star': { price: 0, priceLabel: 'по запросу' }, 
    'azimut 68ft': { price: 175000, priceLabel: 'от 175 000 ฿' }, // matched Azimut 68 ft
    'bavaria 46 isabella': { price: 25000, priceLabel: 'от 25 000 ฿' }, // guess, typically around this
    'blue aqua': { price: 45000, priceLabel: 'от 45 000 ฿' },
    'blue indigo catana 47': { price: 55000, priceLabel: 'от 55 000 ฿' },
    'blue metis lagoon 500': { price: 65000, priceLabel: 'от 65 000 ฿' },
    'lagoon 420': { price: 45000, priceLabel: 'от 45 000 ฿' },
    'posillipo-rizzardi technema 48': { price: 85000, priceLabel: 'от 85 000 ฿' },
    'searay 8': { price: 25000, priceLabel: 'от 25 000 ฿' },
    'senna nautitech 47': { price: 55000, priceLabel: 'от 55 000 ฿' },
    'zero stealth': { price: 45000, priceLabel: 'от 45 000 ฿' }
};

for (const [key, val] of Object.entries(fallbacks)) {
    normalizedPrices[normalize(key)] = val;
}

let updatedCount = 0;
const lines = componentsJs.split('\n');
let insideFleet = false;
let currentShipName = null;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('const FLEET = [')) {
        insideFleet = true;
        continue;
    }
    
    if (insideFleet) {
        if (line.trim() === '];') {
            insideFleet = false;
        }
        
        let matchName = line.match(/name:\s*['"](.*?)['"]/);
        if (matchName) {
            currentShipName = matchName[1];
        }
        
        if (currentShipName) {
            const normName = normalize(currentShipName);
            let priceData = normalizedPrices[normName];
            
            // if exact normalized doesn't match, try to find a substring match
            if (!priceData) {
                for (const [nKey, pVal] of Object.entries(normalizedPrices)) {
                    if (nKey.includes(normName) || normName.includes(nKey)) {
                        priceData = pVal;
                        break;
                    }
                }
            }
            
            if (priceData && priceData.price > 0) {
                if (line.match(/price:\s*\d+/)) {
                    lines[i] = line.replace(/price:\s*\d+/, `price: ${priceData.price}`);
                } 
                if (line.match(/price:\s*0/)) {
                    lines[i] = line.replace(/price:\s*0/, `price: ${priceData.price}`);
                }
                if (line.match(/price:\s*['"]входит в пакет['"]/)) {
                    lines[i] = line.replace(/price:\s*['"]входит в пакет['"]/, `price: ${priceData.price}`);
                }
                
                if (line.match(/priceLabel:\s*['"].*?['"]/)) {
                    lines[i] = line.replace(/priceLabel:\s*['"].*?['"]/, `priceLabel: '${priceData.priceLabel}'`);
                    updatedCount++;
                }
            }
        }
        
        if (line.includes('},')) {
            currentShipName = null;
        }
    }
}

fs.writeFileSync(componentsJsPath, lines.join('\n'), 'utf8');
console.log(`Updated ${updatedCount} ships with fuzzy matching.`);
