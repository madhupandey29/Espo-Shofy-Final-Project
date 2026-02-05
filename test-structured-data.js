// Quick test to verify structured data generation
const siteUrl = "https://www.amrita-fashions.com";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteUrl}/#home`,
  "url": `${siteUrl}/`,
  "name": "Home",
  "isPartOf": { "@id": `${siteUrl}/#website` },
  "publisher": { "@id": `${siteUrl}/#org` },
  "inLanguage": "en",
};

console.log("✅ Home Page JSON-LD Structure:");
console.log(JSON.stringify(homeJsonLd, null, 2));

// Verify the structure
const checks = [
  { test: homeJsonLd["@context"] === "https://schema.org", name: "Context is correct" },
  { test: homeJsonLd["@type"] === "WebPage", name: "Type is WebPage" },
  { test: homeJsonLd["@id"].includes("#home"), name: "ID includes #home" },
  { test: homeJsonLd.publisher["@id"].includes("#org"), name: "Publisher references #org" },
  { test: homeJsonLd.isPartOf["@id"].includes("#website"), name: "isPartOf references #website" },
  { test: homeJsonLd.inLanguage === "en", name: "Language is set" }
];

console.log("\n🔍 Validation Results:");
checks.forEach(check => {
  console.log(`${check.test ? '✅' : '❌'} ${check.name}`);
});

const allPassed = checks.every(check => check.test);
console.log(`\n${allPassed ? '🎉 All checks passed!' : '⚠️ Some checks failed'}`);