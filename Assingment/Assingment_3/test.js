// Automated API test suite for the Inventory Management System.
// Starts the server on port 3099, runs all tests, cleans up, and exits.
// Uses only Node.js built-ins (http module) — no extra packages needed.

process.env.MONGO_URI = "mongodb://localhost:27017/inventoryDB";
process.env.PORT = "3099";

const http = require("http");

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: "localhost",
      port: 3099,
      path,
      method,
      headers: { "Content-Type": "application/json" },
    };
    const req = http.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, body: raw });
        }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

const results = [];
let passed = 0;
let failed = 0;

function test(name, actualStatus, expectedStatus, condition, actualBody) {
  const ok = actualStatus === expectedStatus && condition;
  if (ok) passed++;
  else failed++;
  results.push({ test: name, expected: expectedStatus, actual: actualStatus, pass: ok, body: actualBody });
  const mark = ok ? "✅ PASS" : "❌ FAIL";
  console.log(`${mark}  [${actualStatus}]  ${name}`);
  if (!ok) console.log("        body:", JSON.stringify(actualBody));
}

async function run() {
  await new Promise((r) => setTimeout(r, 1500));

  const UNIQUE = `TEST-${Date.now()}`;
  let createdId = null;
  let extraIds = [];

  // A. CREATE PRODUCT

  let r = await request("POST", "/api/products", {
    name: "Test Mouse",
    sku: UNIQUE + "-A",
    category: "Electronics",
    price: 500,
    quantity: 50,
    reorderLevel: 10,
    supplier: "SupplierX",
  });
  test("A1: Create valid product", r.status, 201, r.body._id !== undefined, r.body);
  createdId = r.body._id;

  r = await request("POST", "/api/products", {
    sku: UNIQUE + "-MISSING",
    category: "Electronics",
    price: 100,
    quantity: 5,
    reorderLevel: 2,
    supplier: "S",
  });
  test("A2: Create — missing required field (name)", r.status, 400, true, r.body);

  r = await request("POST", "/api/products", {
    name: "Bad Product",
    sku: UNIQUE + "-BAD",
    category: "Test",
    price: -50,
    quantity: 10,
    reorderLevel: 5,
    supplier: "S",
  });
  test("A3: Create — invalid value (negative price)", r.status, 400, true, r.body);

  r = await request("POST", "/api/products", {
    name: "Duplicate",
    sku: UNIQUE + "-A",
    category: "Electronics",
    price: 200,
    quantity: 10,
    reorderLevel: 5,
    supplier: "S",
  });
  test("A4: Create — duplicate SKU", r.status, 400, r.body.message.toLowerCase().includes("sku"), r.body);

  // B. GET ALL PRODUCTS

  r = await request("POST", "/api/products", {
    name: "Test Keyboard",
    sku: UNIQUE + "-B",
    category: "Electronics",
    price: 800,
    quantity: 3,
    reorderLevel: 5,
    supplier: "SupplierY",
  });
  if (r.body._id) extraIds.push(r.body._id);

  r = await request("POST", "/api/products", {
    name: "Test Notebook",
    sku: UNIQUE + "-C",
    category: "Stationery",
    price: 40,
    quantity: 100,
    reorderLevel: 20,
    supplier: "PaperCo",
  });
  if (r.body._id) extraIds.push(r.body._id);

  r = await request("GET", "/api/products", null);
  test("B1: Get all products", r.status, 200, Array.isArray(r.body.products) && r.body.total !== undefined, r.body);

  r = await request("GET", "/api/products?category=Stationery", null);
  test("B2: Filter by category=Stationery", r.status, 200,
    r.body.products.every(p => p.category.toLowerCase() === "stationery"), r.body);

  r = await request("GET", "/api/products?search=Test+Notebook", null);
  test("B3: Search by name", r.status, 200,
    r.body.products.some(p => p.name.toLowerCase().includes("notebook")), r.body);

  r = await request("GET", "/api/products?sortBy=price&order=asc&category=Electronics", null);
  const prices = r.body.products.map(p => p.price);
  const sorted = [...prices].sort((a, b) => a - b);
  test("B4: Sort by price asc", r.status, 200, JSON.stringify(prices) === JSON.stringify(sorted), r.body);

  r = await request("GET", "/api/products?sortBy=quantity&order=desc", null);
  const qtys = r.body.products.map(p => p.quantity);
  const sortedQ = [...qtys].sort((a, b) => b - a);
  test("B5: Sort by quantity desc", r.status, 200, JSON.stringify(qtys) === JSON.stringify(sortedQ), r.body);

  r = await request("GET", "/api/products?page=1&limit=2", null);
  test("B6: Pagination page=1 limit=2", r.status, 200,
    r.body.products.length <= 2 && r.body.limit === 2 && r.body.page === 1, r.body);

  r = await request("GET", "/api/products?page=0", null);
  test("B7: Invalid page=0 rejected", r.status, 400, true, r.body);

  r = await request("GET", "/api/products?limit=-1", null);
  test("B8: Invalid limit=-1 rejected", r.status, 400, true, r.body);

  r = await request("GET", "/api/products?limit=999", null);
  test("B9: limit=999 rejected (max 100)", r.status, 400, true, r.body);

  r = await request("GET", "/api/products?category=Electronics&sortBy=price&order=asc&page=1&limit=5", null);
  test("B10: Combined filter+sort+pagination", r.status, 200,
    Array.isArray(r.body.products) && r.body.page === 1 && r.body.limit === 5, r.body);

  // C. GET SINGLE PRODUCT

  r = await request("GET", `/api/products/${createdId}`, null);
  test("C1: Get single product by ID", r.status, 200, r.body._id === createdId, r.body);

  const sv = r.body.stockValue;
  test("C2: stockValue = price * quantity", r.status, 200,
    sv === r.body.price * r.body.quantity, r.body);

  r = await request("GET", "/api/products/not-a-valid-id", null);
  test("C3: Invalid ID format → 400", r.status, 400, true, r.body);

  r = await request("GET", "/api/products/000000000000000000000000", null);
  test("C4: Non-existent ID → 404", r.status, 404, true, r.body);

  // D. UPDATE PRODUCT

  r = await request("PUT", `/api/products/${createdId}`, { price: 650, supplier: "UpdatedSupplier" });
  test("D1: Update valid fields", r.status, 200, r.body.price === 650 && r.body.supplier === "UpdatedSupplier", r.body);

  r = await request("PUT", `/api/products/${createdId}`, { price: -999 });
  test("D2: Update — negative price rejected by validator", r.status, 400, true, r.body);

  r = await request("PUT", "/api/products/badid", { price: 100 });
  test("D3: Update — invalid ID → 400", r.status, 400, true, r.body);

  r = await request("PUT", "/api/products/000000000000000000000000", { price: 100 });
  test("D4: Update — non-existent ID → 404", r.status, 404, true, r.body);

  // E. DELETE PRODUCT

  r = await request("POST", "/api/products", {
    name: "Delete Me",
    sku: UNIQUE + "-DEL",
    category: "Test",
    price: 10,
    quantity: 1,
    reorderLevel: 0,
    supplier: "S",
  });
  const deleteId = r.body._id;

  r = await request("DELETE", `/api/products/${deleteId}`, null);
  test("E1: Delete existing product", r.status, 200, r.body.message !== undefined, r.body);

  r = await request("DELETE", "/api/products/badid", null);
  test("E2: Delete — invalid ID → 400", r.status, 400, true, r.body);

  r = await request("DELETE", "/api/products/000000000000000000000000", null);
  test("E3: Delete — non-existent ID → 404", r.status, 404, true, r.body);

  // F. STOCK ADJUSTMENT

  r = await request("GET", `/api/products/${createdId}`, null);
  const qtyBefore = r.body.quantity;

  r = await request("PATCH", `/api/products/${createdId}/stock`, { change: 20 });
  test("F1: Increase stock by 20", r.status, 200, r.body.quantity === qtyBefore + 20, r.body);

  r = await request("PATCH", `/api/products/${createdId}/stock`, { change: -5 });
  test("F2: Decrease stock by 5", r.status, 200, r.body.quantity === qtyBefore + 20 - 5, r.body);

  r = await request("PATCH", `/api/products/${createdId}/stock`, { change: -99999 });
  test("F3: Stock below zero rejected", r.status, 400, r.body.message.toLowerCase().includes("insufficient"), r.body);

  r = await request("PATCH", `/api/products/${createdId}/stock`, { change: 0 });
  test("F4: Zero change rejected", r.status, 400, true, r.body);

  r = await request("PATCH", `/api/products/${createdId}/stock`, {});
  test("F5: Missing change field rejected", r.status, 400, true, r.body);

  r = await request("PATCH", `/api/products/${createdId}/stock`, { change: "ten" });
  test("F6: Non-numeric change rejected", r.status, 400, true, r.body);

  r = await request("PATCH", `/api/products/${createdId}/stock`, { change: 1e309 });
  test("F7: Infinity/null change rejected", r.status, 400, true, r.body);

  r = await request("GET", `/api/products/${createdId}`, null);
  const expectedQty = qtyBefore + 20 - 5;
  test("F8: DB quantity persisted correctly", r.status, 200, r.body.quantity === expectedQty, r.body);

  // G. LOW-STOCK REPORT

  r = await request("GET", "/api/products/low-stock", null);
  test("G1: Low-stock endpoint returns array", r.status, 200, Array.isArray(r.body), r.body);

  const allLow = r.body.every(p => p.quantity <= p.reorderLevel);
  test("G2: All returned products have qty <= reorderLevel", r.status, 200, allLow, r.body);

  const kbId = extraIds[0];
  const keyboardInLow = r.body.some(p => p._id === kbId);
  test("G3: Low-stock correctly includes qty(3) <= reorderLevel(5) product", r.status, 200, keyboardInLow, r.body);

  const nbId = extraIds[1];
  const notebookInLow = r.body.some(p => p._id === nbId);
  test("G4: Low-stock correctly excludes qty(100) > reorderLevel(20) product", r.status, 200, !notebookInLow, r.body);

  // H. CATEGORY SUMMARY

  r = await request("GET", "/api/products/summary", null);
  test("H1: Summary endpoint returns array", r.status, 200, Array.isArray(r.body), r.body);

  const statSummary = r.body.find(s => s.category === "Stationery");
  test("H2: Stationery category exists in summary", r.status, 200, statSummary !== undefined, r.body);

  if (statSummary) {
    test("H3: Stationery totalInventoryValue includes test notebook (40×100=4000)",
      r.status, 200, statSummary.totalInventoryValue >= 4000, statSummary);

    test("H4: Summary has required fields (totalProducts, totalQuantity, totalInventoryValue, averagePrice)",
      r.status, 200,
      statSummary.totalProducts !== undefined &&
      statSummary.totalQuantity !== undefined &&
      statSummary.totalInventoryValue !== undefined &&
      statSummary.averagePrice !== undefined,
      statSummary);
  }

  const elecSummary = r.body.find(s => s.category === "Electronics");
  test("H5: Electronics category exists in summary", r.status, 200, elecSummary !== undefined, r.body);
  if (elecSummary) {
    test("H6: Electronics totalProducts >= 2", r.status, 200, elecSummary.totalProducts >= 2, elecSummary);
  }

  console.log("\n--- Cleaning up test records ---");
  const toDelete = [createdId, ...extraIds].filter(Boolean);
  for (const id of toDelete) {
    const dr = await request("DELETE", `/api/products/${id}`, null);
    console.log(`  Deleted ${id}: ${dr.status}`);
  }

  console.log(`\n${"=".repeat(55)}`);
  console.log(`  TOTAL: ${passed + failed}   PASSED: ${passed}   FAILED: ${failed}`);
  console.log(`${"=".repeat(55)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

require("./server.js");
run().catch((err) => {
  console.error("Test runner error:", err.message);
  process.exit(1);
});
