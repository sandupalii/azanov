import urllib.request
import re

url = "https://thai-charters.com/category/speedboat/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    html = response.read().decode('utf-8')

product_pattern = re.compile(r'<li[^>]*class="[^"]*boat[^"]*"[^>]*>(.*?)</li>', re.DOTALL | re.IGNORECASE)
products = product_pattern.findall(html)

for html_chunk in products[:5]:
    title_m = re.search(r'<h[23][^>]*class="[^"]*title[^"]*"[^>]*>(?:<a[^>]*>)?(.*?)(?:</a>)?</h[23]>', html_chunk, re.IGNORECASE)
    price_m = re.search(r'<bdi>.*?([\d,]+).*?</bdi>', html_chunk, re.IGNORECASE)
    
    title = title_m.group(1).strip() if title_m else "Unknown"
    price = price_m.group(1).strip() if price_m else "Unknown"
    print(f"Title: {title} | Price: {price}")
    print("--- snippet ---")
    print(html_chunk[:300]) # Print beginning of chunk
    print("===============")
