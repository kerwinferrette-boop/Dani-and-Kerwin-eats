const SF_BBOX = "37.7079,-122.5169,37.8119,-122.3573";

const VIBE_MAP = {
  italian: "Date Night", french: "Date Night", japanese: "Date Night",
  seafood: "Date Night", mediterranean: "Date Night", greek: "Date Night",
  european: "Date Night", sushi: "Date Night",
  steak_house: "Special Occasion", steakhouse: "Special Occasion", fine_dining: "Special Occasion",
  american: "Casual", burger: "Casual", sandwich: "Casual", pizza: "Casual",
  mexican: "Casual", chinese: "Casual", vietnamese: "Casual", thai: "Casual",
  indian: "Casual", korean: "Casual", burmese: "Casual", ramen: "Casual",
  noodle: "Casual", diner: "Casual", southern: "Casual", soul_food: "Casual",
  bar: "Fun & Lively", pub: "Fun & Lively", gastropub: "Fun & Lively", hawaiian: "Fun & Lively",
  breakfast: "Brunch", brunch: "Brunch", cafe: "Brunch", coffee: "Brunch", bakery: "Brunch",
};

const PRICE_MAP = {
  "$$$$": ["japanese","sushi","french","steak_house","steakhouse","seafood","european","fine_dining"],
  "$$$": ["italian","mediterranean","american","greek","californian","fusion"],
  "$$": ["mexican","chinese","thai","indian","vietnamese","korean","hawaiian","burmese","ramen"],
  "$": ["pizza","burger","sandwich","diner","breakfast","brunch","cafe","bakery","fast_food"],
};

function guessPrice(cuisine) {
  const c = (cuisine || "").toLowerCase();
  for (const [price, list] of Object.entries(PRICE_MAP)) {
    if (list.some(x => c.includes(x))) return price;
  }
  return "$$";
}

function guessVibe(cuisine) {
  const c = (cuisine || "").toLowerCase();
  for (const [key, vibe] of Object.entries(VIBE_MAP)) {
    if (c.includes(key)) return vibe;
  }
  return "Casual";
}

function formatCuisine(raw) {
  if (!raw) return "Restaurant";
  return raw.split(";")[0].split(",")[0]
    .replace(/_/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
}

exports.handler = async () => {
  const query = `
    [out:json][timeout:30];
    (
      node["amenity"="restaurant"](${SF_BBOX});
    );
    out body;
  `;

  try {
    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    const restaurants = data.elements
      .filter(el => el.tags?.name)
      .map(el => {
        const tags = el.tags;
        const cuisine = formatCuisine(tags.cuisine);
        const rawCuisine = (tags.cuisine || "").toLowerCase();
        const name = tags.name;
        const neighborhood =
          tags["addr:suburb"] ||
          tags["addr:neighbourhood"] ||
          tags["addr:city"] ||
          "San Francisco";
        const street =
          tags["addr:housenumber"] && tags["addr:street"]
            ? `${tags["addr:housenumber"]} ${tags["addr:street"]}`
            : tags["addr:street"] || "";
        const address = street || name;
        const website = tags.website || tags["contact:website"] || null;
        const price = guessPrice(rawCuisine);
        const vibe = guessVibe(rawCuisine);
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " San Francisco")}`;
        const openTableUrl = `https://www.opentable.com/s?term=${encodeURIComponent(name)}&covers=2&lang=en-US`;

        return { name, cuisine, neighborhood, price, vibe, address, website, mapsUrl, openTableUrl };
      })
      .filter(r => r.name.length > 1);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(restaurants),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch restaurants", detail: err.message }),
    };
  }
};
