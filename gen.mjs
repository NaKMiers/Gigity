import { openai } from '@ai-sdk/openai';
import { generateImage } from 'ai';
import * as dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in .env.local');
  console.log('Please add: OPENAI_API_KEY=your_key_here to .env.local');
  process.exit(1);
}

console.log('🎨 Generating image...');

const { image } = await generateImage({
  model: openai.image('dall-e-3'),
  prompt: 'A young Vietnamese office worker looking at clock, tired expression, holding oily food box, office desk background, natural lighting, realistic style, medium shot',
  size: '1024x1024',
});

console.log('✅ Image generated successfully!');

// Save image to file
const filename = `generated_${Date.now()}.png`;
const filepath = join(process.cwd(), filename);
writeFileSync(filepath, image.uint8Array);

console.log(`💾 Image saved to: ${filename}`);
console.log(`📊 Image size: ${image.uint8Array.length} bytes`);