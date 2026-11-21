import { formatEuro, splitWeight } from "../shared/menuKit";
import { dishUrl } from "./hooks/useDishLink";

// Share a dish. Best effort, in this order:
//   1. an IMAGE CARD (photo + name + price + restaurant) through the
//      phone's share sheet. Needs the photo server to allow cross-origin
//      reads (CORS); otherwise the canvas is "tainted" and we fall back.
//   2. a LINK through the share sheet (…#d-<dish>, opens that dish).
//   3. the link copied to the clipboard.
// Resolves to "shared", "copied", "cancelled" or "failed".

const W = 1080;
const H = 1350;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx, text, maxWidth, maxLines) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  words.forEach((w) => {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/\s+\S*$/, "")}…`;
    return kept;
  }
  return lines;
}

// colors: { bg, ink, pop1, pop2, pop3, onPop1, onPop2 } (all owner-derived)
async function renderCard(item, { colors, restaurant }) {
  const img = await loadImage(item.picture_url);
  if (document.fonts && document.fonts.load) {
    await Promise.all([document.fonts.load("800 80px Unbounded"), document.fonts.load("500 36px Unbounded")]).catch(
      () => {}
    );
  }
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, colors.pop1);
  g.addColorStop(1, colors.pop3);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = colors.bg;
  roundRect(ctx, 60, 60, W - 120, H - 120, 56);
  ctx.fill();

  // Whole photo, never cropped.
  const box = { x: 110, y: 110, w: W - 220, h: 690 };
  const scale = Math.min(box.w / img.width, box.h / img.height);
  const iw = img.width * scale;
  const ih = img.height * scale;
  ctx.drawImage(img, box.x + (box.w - iw) / 2, box.y + (box.h - ih) / 2, iw, ih);

  ctx.fillStyle = colors.ink;
  ctx.font = "800 74px Unbounded, 'Arial Black', sans-serif";
  ctx.textBaseline = "top";
  const lines = wrap(ctx, item.name.toUpperCase(), W - 220, 2);
  lines.forEach((l, i) => ctx.fillText(l, 110, 840 + i * 86));

  const { description } = splitWeight(item.description);
  if (description) {
    ctx.font = "400 34px Unbounded, sans-serif";
    ctx.globalAlpha = 0.8;
    wrap(ctx, description, W - 220, 2).forEach((l, i) => ctx.fillText(l, 110, 840 + lines.length * 86 + 20 + i * 46));
    ctx.globalAlpha = 1;
  }

  // Price sticker.
  const price = formatEuro(item.price);
  ctx.save();
  ctx.translate(W - 230, 740);
  ctx.rotate(-0.14);
  ctx.fillStyle = colors.pop2;
  ctx.beginPath();
  ctx.arc(0, 0, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.onPop2;
  ctx.font = "800 54px Unbounded, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(price, 0, 0);
  ctx.restore();

  if (restaurant) {
    ctx.fillStyle = colors.pop1;
    roundRect(ctx, 110, H - 200, Math.min(W - 220, ctx.measureText(restaurant).width + 120), 80, 40);
    ctx.fill();
    ctx.fillStyle = colors.onPop1;
    ctx.font = "800 36px Unbounded, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(restaurant, 150, H - 160, W - 300);
  }

  return new Promise((resolve, reject) => {
    try {
      // Throws SecurityError when the photo server doesn't allow CORS.
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("no blob"))), "image/png");
    } catch (e) {
      reject(e);
    }
  });
}

async function copyLink(url) {
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch (e) {
    return "failed";
  }
}

export default async function shareDish(item, { colors, restaurant }) {
  const url = dishUrl(item);
  const text = `${item.name} · ${formatEuro(item.price)}${restaurant ? ` · ${restaurant}` : ""}`;
  const canShare = typeof navigator.share === "function";

  if (canShare && item.picture_url && typeof navigator.canShare === "function") {
    try {
      const blob = await renderCard(item, { colors, restaurant });
      const file = new File([blob], `${(item.slug || "dish").replace(/[^\w-]+/g, "-")}.png`, { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: item.name, text: `${text}\n${url}` });
        return "shared";
      }
    } catch (e) {
      if (e && e.name === "AbortError") return "cancelled";
      // CORS-tainted canvas, image error, or files unsupported: use the link.
    }
  }
  if (canShare) {
    try {
      await navigator.share({ title: item.name, text, url });
      return "shared";
    } catch (e) {
      if (e && e.name === "AbortError") return "cancelled";
    }
  }
  return copyLink(url);
}
