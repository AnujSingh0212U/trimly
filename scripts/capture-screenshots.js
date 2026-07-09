const { chromium } = require("@playwright/test");
const path = require("path");

async function capture() {
  const outDir = path.join(__dirname, "..", "public", "screenshots");
  const fs = require("fs");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const shots = [
    { url: "http://localhost:3000", name: "landing" },
    { url: "http://localhost:3000/pricing", name: "pricing" },
    { url: "http://localhost:3000/about", name: "about" },
    { url: "http://localhost:3000/gone", name: "expired-link" },
  ];

  for (const shot of shots) {
    await page.goto(shot.url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(outDir, `${shot.name}.png`),
      fullPage: shot.name === "landing",
    });
    console.log(`Captured ${shot.name}`);
  }

  await browser.close();
  console.log("Done");
}

capture().catch(console.error);
