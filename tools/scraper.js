import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

// 1. Helper Global
const cleanText = (text) => {
  if (!text) return null;
  const cleaned = text
    .replace(/\n/g, " ")
    .replace(/\s\s+/g, " ")
    .replace(
      /\[(Activate: Main|Once Per Turn|On Play|When Attacking|Main|Your Turn|Opponent's Turn|Blocker|Rush|Banish|Double Attack)]/g,
      "[$1]",
    )
    .trim();
  return cleaned === "" || cleaned === "-" ? null : cleaned;
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function scrapePack(packId) {
  const url = `https://en.onepiece-cardgame.com/cardlist/?series=${packId}`;
  const dir = "./data/english";

  // Pastikan folder tujuan ada
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    console.log(`🚀 Navigating to ${url}...`);
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    // Tunggu network idle agar gambar ter-load
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const content = await page.content();
    const $ = cheerio.load(content);
    const cards = [];

    $(".resultCol > a.modalOpen").each((i, el) => {
      // 1. Ambil Gambar dari tag <a> ini (el)
      const imgTag = $(el).find("img");
      let rawImgPath = imgTag.attr("data-src") || imgTag.attr("src");

      // 2. Ambil Data Teks dari tag <dl> yang ada TEPAT di bawahnya (next sibling)
      const dataContainer = $(el).next("dl.modalCol");

      if (rawImgPath) {
        rawImgPath = rawImgPath.trim().replace(/^(\.\.\/|\.\/)/, "");
      }

      // Helper internal menggunakan dataContainer, bukan el
      const getNum = (selector) => {
        const val = dataContainer.find(selector).text().trim();
        if (val.includes("Power")) {
          const result = val.split("Power")[1];
          return result === "-" ? 0 : result;
        }
        if (val.includes("Cost")) {
          const result = val.split("Cost")[1];
          return result === "-" ? 0 : result;
        }
        if (val.includes("Counter")) {
          const result = val.split("Counter")[1];
          return result === "-" ? 0 : result;
        }
        return;
      };

      const cleanArray = (selector) => {
        return dataContainer
          .find(selector)
          .text()
          .replace(/Attribute|Color|Type/g, "")
          .replace(/\n/g, "")
          .trim()
          .split("/")
          .map((s) => s.trim())
          .filter((s) => s !== "" && s !== "-")
          .trim();
      };

      const infoSpans = dataContainer.find(".infoCol span");
      const rarity = $(infoSpans[1]).text().trim();
      const category = $(infoSpans[2]).text().trim();
      const cardData = {
        id: dataContainer.attr("id"), // Ambil ID langsung dari atribut id <dl>
        pack_id: packId,
        name: dataContainer.find(".cardName").text().trim(),
        rarity: rarity,
        category: category,
        img_url: rawImgPath ? `../${rawImgPath}` : null,
        img_full_url: rawImgPath
          ? `https://en.onepiece-cardgame.com/${rawImgPath}`
          : null,
        colors: cleanArray(".color"),
        cost: getNum(".cost"),
        attributes: cleanArray(".attribute"),
        power: getNum(".power"),
        counter: getNum(".counter"),
        types: cleanArray(".feature"),
        effect: cleanText(dataContainer.find(".text").text()),
        trigger: cleanText(dataContainer.find(".trigger").text()),
      };

      if (cardData.name) {
        // Pastikan bukan elemen kosong
        cards.push(cardData);
      }
    });

    fs.writeFileSync(
      path.join(dir, `cards_${packId}.json`),
      JSON.stringify(cards, null, 2),
    );
    console.log(`✅ Success: ${packId} (${cards.length} cards)`);
  } catch (error) {
    console.error(`❌ Error scraping ${packId}:`, error.message);
  } finally {
    await browser.close();
  }
}

async function scrapeMultiplePacks(packList) {
  console.log(`🔥 Starting scrape for ${packList.length} packs...`);
  for (const packId of packList) {
    await scrapePack(packId);
    console.log(`Cooldown...`);
    await delay(3000); // Jeda lebih lama agar aman (3 detik)
  }
  console.log("🏁 Mission Accomplished! Cek folder data/english");
}

const targetPacks = [
  "569022",
  "569023",
  "569024",
  "569025",
  "569026",
  "569027",
  "569028",
  "569029",
  "569111",
  "569112",
  "569113",
  "569114",
  "569115",
  "569302",
];

scrapeMultiplePacks(targetPacks);
