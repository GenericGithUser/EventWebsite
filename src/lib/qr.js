

/**
 * Single source of truth for what the attendance QR code encodes:
 * the registrant's ID **plus** their registration details (name, age, email).
 * If a scanner expects a different format, change it here only.
 */
export function buildQrPayload(registrant) {
  return JSON.stringify({
    id: registrant.RegistrationID,
    name: registrant.Name,
    age: registrant.Age,
    email: registrant.Email,
  });
}

/* ------------------------------------------------------------------ */
/* Downloadable pass card: renders the QR + registration details       */
/* into a print-ready PNG (640×880) matching the on-dialog design.     */
/* ------------------------------------------------------------------ */

const C = {
  spruce: "#0D1F17",
  nav: "#162E23",
  mint: "#34D399",
  sec: "#059669",
  cream: "#ECFDF5",
  ash: "#9CA3AF",
};

const SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const MONO = '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

/* 
  Constants for Direct to Upload of QRs and Email

*/
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

// Helper
const canvasToBlob = (canvas, type = "image/png") =>
  new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Canvas export failed"))),
      type,
    ),
  );

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("QR image failed to load"));
    image.src = src;
  });
}

function roundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function setFont(ctx, { size = 14, weight = 400, mono = false } = {}) {
  ctx.font = `${weight} ${size}px ${mono ? MONO : SANS}`;
}

function drawPill(ctx, text, x, y, opts) {
  const {
    bg,
    border,
    color,
    mono = false,
    weight = 500,
    size = 13,
    height = 30,
    padX = 14,
    check = false,
  } = opts;
  setFont(ctx, { size, weight, mono });
  const width = ctx.measureText(text).width + padX * 2 + (check ? 17 : 0);

  roundedRectPath(ctx, x, y, width, height, height / 2);
  ctx.fillStyle = bg;
  ctx.fill();
  if (border) {
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  const midY = y + height / 2;
  if (check) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(x + padX + 1, midY + 1);
    ctx.lineTo(x + padX + 5, midY + 4.5);
    ctx.lineTo(x + padX + 12, midY - 4);
    ctx.stroke();
  }

  ctx.fillStyle = color;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + padX + (check ? 17 : 0), midY + 0.5);
  return width;
}

function pillWidth(ctx, text, opts) {
  const { size = 13, weight = 500, mono = false, padX = 14, check = false } = opts;
  setFont(ctx, { size, weight, mono });
  return ctx.measureText(text).width + padX * 2 + (check ? 17 : 0);
}

function drawDetailRow(ctx, { icon, label, value }, x, y) {
  // Icon disc
  const cx = x + 18;
  const cy = y + 18;
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(5, 150, 105, 0.25)";
  ctx.fill();

  ctx.strokeStyle = C.mint;
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (icon === "user") {
    ctx.beginPath();
    ctx.arc(cx, cy - 3.5, 4.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy + 9);
    ctx.quadraticCurveTo(cx, cy - 1, cx + 7, cy + 9);
    ctx.stroke();
  } else if (icon === "calendar") {
    roundedRectPath(ctx, cx - 7.5, cy - 6, 15, 13, 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 7.5, cy - 1.5);
    ctx.lineTo(cx + 7.5, cy - 1.5);
    ctx.moveTo(cx - 3.5, cy - 8.5);
    ctx.lineTo(cx - 3.5, cy - 4.5);
    ctx.moveTo(cx + 3.5, cy - 8.5);
    ctx.lineTo(cx + 3.5, cy - 4.5);
    ctx.stroke();
  } else {
    // mail
    roundedRectPath(ctx, cx - 8, cy - 6, 16, 12, 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 4.5);
    ctx.lineTo(cx, cy + 1.5);
    ctx.lineTo(cx + 8, cy - 4.5);
    ctx.stroke();
  }

  trySetLetterSpacing(ctx, "1.5px");
  setFont(ctx, { size: 11, weight: 600 });
  ctx.fillStyle = C.ash;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(label.toUpperCase(), x + 50, y + 16);
  trySetLetterSpacing(ctx, "0px");

  setFont(ctx, { size: 17, weight: 500 });
  ctx.fillStyle = C.cream;
  ctx.fillText(value, x + 50, y + 40);
}

function trySetLetterSpacing(ctx, value) {
  try {
    ctx.letterSpacing = value;
  } catch {
    // letterSpacing unsupported — spacing simply stays default.
  }
}

function drawQrLogoGlyph(ctx, x, y, size) {
  const unit = size / 5;
  const sq = (dx, dy, s) => ctx.fillRect(x + dx * unit, y + dy * unit, s * unit, s * unit);
  ctx.fillStyle = C.spruce;
  sq(0.5, 0.5, 1.4);
  sq(3.1, 0.5, 1.4);
  sq(0.5, 3.1, 1.4);
  sq(3.2, 3.2, 1.1);
}

function renderPassCard(registrant, qrImage) {
  const W = 640;
  const H = 780;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // Card background with rounded corners
  roundedRectPath(ctx, 0, 0, W, H, 28);
  ctx.fillStyle = C.nav;
  ctx.fill();
  ctx.save();
  roundedRectPath(ctx, 0, 0, W, H, 28);
  ctx.clip();

  // Accent strip
  const strip = ctx.createLinearGradient(0, 0, W, 0);
  strip.addColorStop(0, C.sec);
  strip.addColorStop(0.5, C.mint);
  strip.addColorStop(1, C.sec);
  ctx.fillStyle = strip;
  ctx.fillRect(0, 0, W, 8);

  // Header: logo glyph + event title
  roundedRectPath(ctx, 36, 32, 40, 40, 10);
  ctx.fillStyle = C.mint;
  ctx.fill();
  drawQrLogoGlyph(ctx, 36, 32, 40);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  trySetLetterSpacing(ctx, "2px");
  setFont(ctx, { size: 11, weight: 600 });
  ctx.fillStyle = C.ash;
  ctx.fillText("Event 202X", 90, 48);
  trySetLetterSpacing(ctx, "0px");
  setFont(ctx, { size: 24, weight: 600 });
  ctx.fillStyle = C.cream;
  ctx.fillText("Attendee Pass", 90, 74);


  // Status / ticket / ID pills
  const pillY = 132;
  const pillOpts = [
    { text: registrant.RegistrationID, mono: true, bg: C.spruce, border: "rgba(52,211,153,0.5)", color: C.mint },
    registrant.hasAttended === true
      ? { text: "Attended", check: true, bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.45)", color: C.mint }
      : { text: "Awaiting scan", bg: "rgba(156,163,175,0.12)", border: "rgba(156,163,175,0.35)", color: C.ash },
  ];
  const gap = 10;
  const total = pillOpts.reduce(
    (sum, opts) => sum + pillWidth(ctx, opts.text, opts) + gap,
    -gap,
  );
  let cursor = (W - total) / 2;
  for (const opts of pillOpts) {
    cursor += drawPill(ctx, opts.text, cursor, pillY, opts) + gap;
  }

  // Registration details
  const rows = [
    { icon: "user", label: "Name", value: registrant.Name },
    { icon: "calendar", label: "Age", value: String(registrant.Age) },
    { icon: "mail", label: "Email", value: registrant.Email },
  ];
  rows.forEach((row, index) => drawDetailRow(ctx, row, 36, 192 + index * 58));

  // Ticket perforation
  ctx.strokeStyle = "rgba(52,211,153,0.3)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 7]);
  ctx.beginPath();
  ctx.moveTo(36, 376);
  ctx.lineTo(W - 36, 376);
  ctx.stroke();
  ctx.setLineDash([]);

  // QR tile with scanner-frame brackets
  const tileX = (W - 300) / 2;
  const tileY = 398;
  const tileSize = 300;
  roundedRectPath(ctx, tileX, tileY, tileSize, tileSize, 20);
  ctx.fillStyle = C.cream;
  ctx.fill();

  ctx.strokeStyle = C.sec;
  ctx.lineWidth = 3.5;
  ctx.lineCap = "round";
  const inset = 12;
  const arm = 26;
  const corners = [
    [tileX + inset, tileY + inset, 1, 1],
    [tileX + tileSize - inset, tileY + inset, -1, 1],
    [tileX + inset, tileY + tileSize - inset, 1, -1],
    [tileX + tileSize - inset, tileY + tileSize - inset, -1, -1],
  ];
  for (const [bx, by, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(bx + dx * arm, by);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx, by + dy * arm);
    ctx.stroke();
  }

  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(qrImage, tileX + 30, tileY + 30, tileSize - 60, tileSize - 60);

  // Captions
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  setFont(ctx, { size: 13 });
  ctx.fillStyle = C.ash;
  ctx.fillText("Scan at the entrance to record attendance", W / 2, 728);

  const payload = buildQrPayload(registrant);
  let payloadSize = 11;
  setFont(ctx, { size: payloadSize, mono: true });
  while (ctx.measureText(payload).width > W - 72 && payloadSize > 8) {
    payloadSize -= 0.5;
    setFont(ctx, { size: payloadSize, mono: true });
  }
  ctx.fillStyle = "rgba(156,163,175,0.7)";
  ctx.fillText(payload, W / 2, 754);

  ctx.restore();
  return canvas;
}

/**
 * Builds the pass-card PNG (QR + details) from the live QRCodeSVG element
 * and triggers a download. The SVG is re-rasterized as vectors, so the
 * QR stays sharp at print resolution.
 */
async function buildPassCardCanvas(registrant, qrSvg) {
  const serialized = new XMLSerializer().serializeToString(qrSvg);
  const svgUrl = URL.createObjectURL(
    new Blob([serialized], { type: "image/svg+xml;charset=utf-8" }),
  );
  try {
    const qrImage = await loadImage(svgUrl);
    return renderPassCard(registrant, qrImage);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export async function downloadQrPassCard(registrant, qrSvg) {
  if (!qrSvg || typeof document === "undefined") return;
  const canvas = await buildPassCardCanvas(registrant, qrSvg);
  const anchor = document.createElement("a");
  anchor.href = canvas.toDataURL("image/png");
  anchor.download = `pass-${registrant.RegistrationID}.png`;
  anchor.click();
}

export async function uploadQrPassCard(registrant, qrSvg) {
  if (!qrSvg || typeof document === "undefined") return null;

  const canvas = await buildPassCardCanvas(registrant, qrSvg);
  const blob = await canvasToBlob(canvas);

  const formData = new FormData();
  formData.append("file", blob, `pass-${registrant.RegistrationID}.png`);
  formData.append("upload_preset", UPLOAD_PRESET);
 

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${res.status}`);

  const { secure_url } = await res.json();
  return secure_url;
}
