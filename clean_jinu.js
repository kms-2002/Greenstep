import sharp from 'sharp';

async function processImage() {
  const inputPath = 'public/jinu_transparent.jpg';
  const outputPath = 'public/jinu_clean.png';

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels; // 4 (R, G, B, A)

  console.log(`Dimensions: ${width}x${height}, channels: ${channels}`);

  // Create visited array & output buffer
  const visited = new Uint8Array(width * height);
  const outData = Buffer.from(data);

  // Helper to check if pixel is background (checkerboard grey/white or near white/grey)
  function isBackground(r, g, b) {
    // Black outlines of character boundary
    if (r < 75 && g < 75 && b < 75) return false;
    
    // Character colors:
    // Cyan blue body: r ~ 30-80, g ~ 160-230, b ~ 200-245
    if (r < 120 && g > 150 && b > 180) return false;
    // Orange dino: r > 200, g: 100..200, b < 130
    if (r > 200 && g > 100 && g < 200 && b < 130) return false;
    // Pink cheek: r > 220, g: 80..170, b: 110..200
    if (r > 220 && g > 80 && g < 170 && b > 110 && b < 200) return false;
    // Green leaf: r < 120, g > 140, b < 110
    if (r < 120 && g > 140 && b < 110) return false;
    // Cream belly: r > 230, g > 230, b > 190 with low saturation difference (r-b > 15)
    if (r > 230 && g > 230 && b > 190 && (r - b > 15)) return false;

    // Checkerboard pixels are grey (R==G==B ~ 180..235) or pure white (R>235, G>235, B>235)
    const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    if (maxDiff < 25) return true; // Grey or white background grid pixel
    if (r > 235 && g > 235 && b > 235) return true;

    return true;
  }

  // Queue BFS Flood Fill starting from image borders
  const queue = [];

  function addPixel(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;

    const pIdx = idx * 4;
    const r = outData[pIdx];
    const g = outData[pIdx + 1];
    const b = outData[pIdx + 2];

    if (isBackground(r, g, b)) {
      visited[idx] = 1;
      queue.push(idx);
    }
  }

  // Seed borders
  for (let x = 0; x < width; x++) {
    addPixel(x, 0);
    addPixel(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    addPixel(0, y);
    addPixel(width - 1, y);
  }

  // BFS
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const x = curr % width;
    const y = Math.floor(curr / width);

    // Make pixel transparent
    const pIdx = curr * 4;
    outData[pIdx + 3] = 0;

    // 4-neighbors
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    for (const [nx, ny] of neighbors) {
      addPixel(nx, ny);
    }
  }

  console.log(`Erased ${queue.length} background pixels out of ${width * height}`);

  // Save clean PNG
  await sharp(outData, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png()
    .toFile(outputPath);

  console.log('Saved clean PNG to:', outputPath);
}

processImage().catch(console.error);
