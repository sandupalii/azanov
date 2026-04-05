const fs = require('fs');
const path = require('path');

const componentsJsPath = path.join(__dirname, 'js/components.js');
const pricesJsonPath = path.join(__dirname, 'scripts/thai_charters_prices_speeds.json');

const pricesData = JSON.parse(fs.readFileSync(pricesJsonPath, 'utf8'));
let componentsJs = fs.readFileSync(componentsJsPath, 'utf8');

let updatedCount = 0;

// The structure of FLEET is const FLEET = [ ... ];
// We will use a regex to match name: '...', priceLabel: '...', etc.
// But it's easier to evaluate the array, update it, and stringify it back.
// Since it's a JS file with other constants, we can parse it by extracting the FLEET array.
// But there are functions inside components.js. 

// Better approach: regex replace on JS string directly.
for (const [shipName, shipData] of Object.entries(pricesData)) {
    if (!shipData.price) continue;
    
    // We want to match objects that have: name: 'ShipName'
    // To handle quotes, we match name: 'ShipName' or name: "ShipName"
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const namePattern = escapeRegExp(shipName);
    
    // Regex explanation:
    // Match something like:
    // name: 'ShipName',
    // ...
    // price: 0,
    // priceLabel: 'по запросу'
    // Or whatever it is currently.
    
    // We will do a generic replacement:
    // Find the object bounds for the ship if possible.
}

// Actually, evaluating the `const FLEET` might be easier, but we lose comments.
// Let's use a simple state machine.

const lines = componentsJs.split('\n');
let insideFleet = false;
let currentShipObjStartIndex = -1;
let currentShipName = null;
let currentShipHasPriceUpdated = false;

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
        
        if (line.includes('{')) {
            // start of obj
        }
        
        let matchName = line.match(/name:\s*['"](.*?)['"]/);
        if (matchName) {
            currentShipName = matchName[1];
        }
        
        if (currentShipName && pricesData[currentShipName]) {
            if (line.match(/price:\s*\d+/)) {
                lines[i] = line.replace(/price:\s*\d+/, `price: ${pricesData[currentShipName].price}`);
            } else if (line.match(/price:\s*null/)) {
                lines[i] = line.replace(/price:\s*null/, `price: ${pricesData[currentShipName].price}`);
            }
            
            if (line.match(/priceLabel:\s*['"].*?['"]/)) {
                lines[i] = line.replace(/priceLabel:\s*['"].*?['"]/, `priceLabel: '${pricesData[currentShipName].priceLabel}'`);
                updatedCount++;
            }
        }
        
        if (line.includes('},')) {
            currentShipName = null;
        }
    }
}

fs.writeFileSync(componentsJsPath, lines.join('\n'), 'utf8');
console.log(`Updated ${updatedCount} ships with new prices in components.js`);
