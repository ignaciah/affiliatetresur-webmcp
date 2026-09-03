
const MOCK_PRODUCTS = [
  {
    id: "prod_01",
    title: "Raspberry Pi 4 Model B (4GB)",
    category: "Hardware",
    price: 55.00,
    discount: "15% OFF",
    rating: 4.8,
    affiliateUrl: "https://affiliatetresur.com/ref/rpi4",
    summary: "Ideal micro-computer for edge automation, IoT gateways, and headless servers."
  },
  {
    id: "prod_02",
    title: "Argon ONE V2 Aluminum Case with Power Button",
    category: "Accessories",
    price: 28.50,
    discount: "10% OFF",
    rating: 4.9,
    affiliateUrl: "https://affiliatetresur.com/ref/argon-one",
    summary: "Heavy-duty passive and active cooling case with full-sized HDMI ports."
  },
  {
    id: "prod_03",
    title: "Motorola Razr Foldable Smartphone",
    category: "Mobile",
    price: 599.99,
    discount: "20% OFF",
    rating: 4.5,
    affiliateUrl: "https://affiliatetresur.com/ref/moto-razr",
    summary: "Compact foldable form factor with OLED external display."
  },
  {
    id: "prod_04",
    title: "Ergonomic Dual-Motor Standing Desk Frame",
    category: "Office",
    price: 189.00,
    discount: "25% OFF",
    rating: 4.7,
    affiliateUrl: "https://affiliatetresur.com/ref/desk-frame",
    summary: "Heavy-duty electric sit-stand desk frame with memory height presets."
  },
  {
    id: "prod_05",
    title: "Wireless OBD2 Car Diagnostic Scanner",
    category: "Automotive",
    price: 34.99,
    discount: "20% OFF",
    rating: 4.6,
    affiliateUrl: "https://affiliatetresur.com/ref/obd2-scanner",
    summary: "Bluetooth automotive code reader and real-time engine sensor diagnostic tool for cars and trucks."
  },
  {
    id: "prod_06",
    title: "Dual Dash Cam Front and Rear 4K",
    category: "Automotive",
    price: 119.00,
    discount: "15% OFF",
    rating: 4.8,
    affiliateUrl: "https://affiliatetresur.com/ref/dash-cam",
    summary: "Ultra HD car dash camera with night vision, parking monitor, and loop recording."
  },
  {
    id: "prod_07",
    title: "Portable Car Jump Starter with Air Compressor",
    category: "Automotive",
    price: 79.99,
    discount: "18% OFF",
    rating: 4.7,
    affiliateUrl: "https://affiliatetresur.com/ref/jump-starter",
    summary: "Compact 2000A peak emergency car battery jump box with built-in 150 PSI digital tire inflator."
  }
];

function queryCatalog(searchTerm = "", maxBudget = null) {
  const term = searchTerm.toLowerCase().trim();
  const budget = maxBudget ? parseFloat(maxBudget) : Infinity;

  return MOCK_PRODUCTS.filter(item => {
    const matchesText = !term || 
      item.title.toLowerCase().includes(term) || 
      item.summary.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term);
    const matchesPrice = isNaN(budget) || item.price <= budget;
    return matchesText && matchesPrice;
  });
}

function renderDeals(deals) {
  const container = document.getElementById("resultsContainer");
  if (!deals || deals.length === 0) {
    container.innerHTML = `<div class="deal-card"><p style="margin:0; color:var(--muted);">No deals found matching your criteria.</p></div>`;
    return;
  }

  container.innerHTML = deals.map(deal => `
    <div class="deal-card">
      <div class="deal-meta">
        <span>${deal.category} • ★ ${deal.rating}</span>
        <span style="color: #4ade80; font-weight: bold;">${deal.discount}</span>
      </div>
      <h3>${deal.title}</h3>
      <p style="color: var(--muted); font-size: 0.95rem; margin: 0 0 1rem 0;">${deal.summary}</p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 1.25rem; font-weight: bold;">$${deal.price.toFixed(2)}</span>
        <a href="${deal.affiliateUrl}" target="_blank" rel="noopener noreferrer" class="deal-link">View Deal &rarr;</a>
      </div>
    </div>
  `).join("");
}

const dealForm = document.getElementById("dealSearchForm");

dealForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(dealForm);
  const query = formData.get("query") || "";
  const maxPrice = formData.get("maxPrice") || null;

  const results = queryCatalog(query, maxPrice);

  if (e.agentInvoked) {
    e.respondWith({
      success: true,
      query,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      totalResults: results.length,
      deals: results
    });
    return;
  }

  renderDeals(results);
});

if (typeof navigator !== "undefined" && "modelContext" in navigator) {
  try {
    navigator.modelContext.registerTool({
      name: "get_trending_deals",
      description: "Fetch top trending discounts and promotional deals across all categories on affiliatetresur.",
      inputSchema: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Maximum number of items to return (default 5)" }
        }
      },
      execute: async ({ limit = 5 }) => {
        const topDeals = MOCK_PRODUCTS.slice(0, limit);
        return { success: true, count: topDeals.length, deals: topDeals };
      }
    });
  } catch (err) {
    console.debug("WebMCP programmatic registration note:", err);
  }
}
