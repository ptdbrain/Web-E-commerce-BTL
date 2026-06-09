const parseListInput = (value) => {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Fall through to line/comma parsing for plain form input.
    }

    return trimmed.split(/[\r\n,]+/);
  }

  return [];
};

const isSupportedImageUrl = (value) =>
  /^https?:\/\//i.test(value) ||
  value.startsWith("/") ||
  /^data:image\//i.test(value);

export const normalizeProductImageUrls = (value) => {
  const seen = new Set();
  const urls = [];

  for (const item of parseListInput(value)) {
    const url = String(item || "").trim();
    if (!url || !isSupportedImageUrl(url) || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }

  return urls.slice(0, 6);
};
