// Upload a local image to Cloudinary for SheetHub visual ops (REST signed upload).
// Folder: sheethub/images/<slug>  Format: webp q_auto. Natural size; downscale only if width>1600.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const CLOUD = 'snipgeek';
const API_KEY = '741556666953182';
const API_SECRET = 'Z6LC3z_NoyWh3y-n4jzVzzws68w';

function sign(params, secret) {
  const str = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join('&');
  return crypto.createHash('sha1').update(str + secret, 'utf8').digest('hex');
}

function multipart(args) {
  // args: { filename, fileBuffer, fields: {k:v} }
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const chunks = [];
  const CRLF = '\r\n';
  // file part
  chunks.push(Buffer.from(`--${boundary}${CRLF}`));
  chunks.push(Buffer.from(`Content-Disposition: form-data; name="file"; filename="${args.filename}"${CRLF}`));
  chunks.push(Buffer.from(`Content-Type: application/octet-stream${CRLF}${CRLF}`));
  chunks.push(args.fileBuffer);
  chunks.push(Buffer.from(`${CRLF}`));
  // text fields
  for (const [k, v] of Object.entries(args.fields)) {
    chunks.push(Buffer.from(`--${boundary}${CRLF}`));
    chunks.push(Buffer.from(`Content-Disposition: form-data; name="${k}"${CRLF}${CRLF}`));
    chunks.push(Buffer.from(`${v}${CRLF}`));
  }
  chunks.push(Buffer.from(`--${boundary}--${CRLF}`));
  return { boundary, body: Buffer.concat(chunks) };
}

async function main() {
  const [src, slug, shotName] = process.argv.slice(2);
  if (!src || !slug || !shotName) {
    console.log(JSON.stringify({ error: 'usage: node upload_sheethub_cloudinary.mjs <src> <slug> <shotName>' }));
    process.exit(1);
  }
  const abs = path.resolve(src);
  if (!fs.existsSync(abs)) {
    console.log(JSON.stringify({ error: `File not found: ${abs}` }));
    process.exit(1);
  }

  const meta = await sharp(abs).rotate().metadata();
  let pipeline = sharp(abs).rotate();
  if (meta.width && meta.width > 1600) {
    pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true });
  }
  const outBuffer = await pipeline.webp({ quality: 82 }).toBuffer();

  const folder = `sheethub/images/${slug}`;
  const publicId = shotName;
  const timestamp = String(Math.floor(Date.now() / 1000));

  // Signed params exclude api_key (Cloudinary does not sign api_key).
  const params = {
    folder,
    format: 'webp',
    overwrite: 'true',
    public_id: publicId,
    timestamp,
    transformation: 'q_auto,f_auto',
  };
  const signature = sign(params, API_SECRET);
  const fields = { ...params, api_key: API_KEY, signature };

  const { boundary, body } = multipart({
    filename: path.basename(abs),
    fileBuffer: outBuffer,
    fields,
  });

  const url = `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body,
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (data.error) {
    console.log(JSON.stringify({ error: data.error.message }));
    process.exit(1);
  }
  console.log(JSON.stringify({
    url: data.secure_url,
    public_id: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
    inputWidth: meta.width,
    inputHeight: meta.height,
  }));
}

main().catch((e) => {
  console.log(JSON.stringify({ error: e.message }));
  process.exit(1);
});
