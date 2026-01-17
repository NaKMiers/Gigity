# 🎬 Video Generation Integration Guide

This guide explains how to integrate real video generation capabilities into your marketing agent.

## Current Status

✅ **Implemented:**
- Marketing script generation (audio + video)
- Video production planning with detailed scenes
- Image generation prompts for each scene
- Complete video structure with timelines, overlays, and CTA

⏳ **TODO - Integrate with Video Generation APIs:**
- Connect to actual AI video/image generation services
- Implement video compilation and editing
- Add text-to-speech for audio generation

---

## 🚀 How It Works

### Current Flow:

1. **User Input** → Business information
2. **Marketing Agent** → Generates audio script + video script description
3. **Video Generation Agent** → Creates detailed production plan with:
   - Individual scenes with timing
   - Image generation prompts (English, optimized for AI)
   - Text overlays and positioning
   - Transitions and effects
   - Audio/music recommendations

### Output:

The system generates a **complete production plan** including:
- 🎙️ Audio script (voice-over text)
- 📹 Video script (visual description in Vietnamese)
- 🎬 Scene breakdown with AI-ready prompts
- 📝 Text overlays and CTAs
- ⏱️ Timeline and transitions

---

## 🔌 Integration Options

### Option 1: Replicate API (Recommended)

Replicate provides access to multiple AI models for image and video generation.

**Models Available:**
- **Stable Diffusion XL** - High-quality images
- **Stable Video Diffusion** - Image-to-video
- **AnimateDiff** - Text/image to animated video
- **Zeroscope** - Text-to-video

**Setup:**

1. Get API key from [replicate.com](https://replicate.com)

2. Add to `.env`:
```bash
REPLICATE_API_KEY=your_api_key_here
```

3. Uncomment the Replicate code in `src/tools/videoGenerationTool.ts`:

```typescript
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: "stability-ai/stable-video-diffusion:...",
    input: {
      prompt: prompt,
      num_frames: duration ? duration * 24 : 72,
    }
  })
});
```

4. Install Replicate SDK:
```bash
pnpm add replicate
```

**Cost:** ~$0.001 - $0.05 per generation depending on model

---

### Option 2: Runway ML

High-quality video generation with Gen-2 model.

**Setup:**

1. Get API key from [runwayml.com](https://runwayml.com)

2. Add to `.env`:
```bash
RUNWAY_API_KEY=your_api_key_here
```

3. Use Runway API:
```typescript
const response = await fetch('https://api.runwayml.com/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: prompt,
    duration: duration,
    mode: 'gen2',
  })
});
```

**Cost:** ~$0.05 - $0.10 per second of video

---

### Option 3: Leonardo AI

Great for generating high-quality images that can be compiled into video.

**Setup:**

1. Get API key from [leonardo.ai](https://leonardo.ai)

2. Add to `.env`:
```bash
LEONARDO_API_KEY=your_api_key_here
```

3. Generate images for each scene:
```typescript
const response = await fetch('https://api.leonardo.ai/v1/generations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.LEONARDO_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: prompt,
    width: 1920,
    height: 1080,
    num_images: 1,
  })
});
```

4. Then combine images with **FFmpeg** or **Remotion** for video compilation

**Cost:** ~$0.01 per image

---

### Option 4: OpenAI DALL-E 3 + FFmpeg

Use OpenAI for images, compile with FFmpeg.

**Setup:**

1. Already have OPENAI_API_KEY in your `.env`

2. Generate images:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const image = await openai.images.generate({
  model: "dall-e-3",
  prompt: prompt,
  size: "1792x1024",
  quality: "hd",
});
```

3. Install FFmpeg and compile images to video:
```bash
# Install FFmpeg
sudo apt install ffmpeg  # Linux
brew install ffmpeg      # Mac

# Combine images into video
ffmpeg -framerate 1/3 -i scene_%d.png -c:v libx264 -pix_fmt yuv420p output.mp4
```

**Cost:** ~$0.04 - $0.08 per image

---

## 🎵 Audio Generation (Text-to-Speech)

### Option 1: ElevenLabs (Best Quality)

```typescript
const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/{voice_id}', {
  method: 'POST',
  headers: {
    'xi-api-key': process.env.ELEVENLABS_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: audioScript,
    model_id: 'eleven_multilingual_v2',
  })
});
```

### Option 2: Google Cloud TTS

```typescript
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient();

const [response] = await client.synthesizeSpeech({
  input: { text: audioScript },
  voice: { languageCode: 'vi-VN', name: 'vi-VN-Standard-A' },
  audioConfig: { audioEncoding: 'MP3' },
});
```

---

## 🎼 Background Music

**Services:**
- [Epidemic Sound](https://epidemicsound.com) - Royalty-free music library
- [Artlist](https://artlist.io) - High-quality music for creators
- [Soundstripe](https://soundstripe.com) - Unlimited music downloads

**Or generate with AI:**
- [Suno AI](https://suno.ai) - AI music generation
- [Soundraw](https://soundraw.io) - AI music for videos

---

## 🎞️ Video Compilation Tools

### Option 1: Remotion (Code-based, React)

```bash
pnpm add remotion
```

```typescript
import { Composition } from 'remotion';

export const VideoComposition: React.FC = () => {
  return (
    <Composition
      id="MarketingVideo"
      component={MyVideo}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
```

### Option 2: FFmpeg (Command-line)

```bash
# Concat images with transitions
ffmpeg -i scene1.png -i scene2.png -filter_complex \
  "[0:v][1:v]xfade=transition=fade:duration=1:offset=3[v]" \
  -map "[v]" output.mp4

# Add audio
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac output_final.mp4
```

### Option 3: Descript (AI-powered, GUI)

Upload scripts and media to [Descript](https://descript.com) for automated video editing.

---

## 📊 Complete Workflow Example

```typescript
// 1. Generate marketing script
const script = await marketingAgent.invoke({...});

// 2. Generate video plan
const videoPlan = await videoGenerationAgent.invoke({...});

// 3. Generate images for each scene
const images = await Promise.all(
  videoPlan.scenes.map(async (scene) => {
    return await generateImage(scene.imagePrompt);
  })
);

// 4. Generate audio (TTS)
const audio = await textToSpeech(script.audio_script_description);

// 5. Compile video
const video = await compileVideo({
  scenes: images,
  audio: audio,
  transitions: videoPlan.scenes.map(s => s.transitionEffect),
  overlays: videoPlan.textOverlays,
});

// 6. Export final video
return video;
```

---

## 💰 Cost Estimation

For a **30-second video** with 7 scenes:

| Service | Cost |
|---------|------|
| Image Generation (7 scenes) | $0.07 - $0.35 |
| Video Generation (alternative) | $1.50 - $3.00 |
| Text-to-Speech | $0.01 - $0.15 |
| Music (subscription) | $0 (if subscribed) |
| **Total per video** | **$0.08 - $3.50** |

---

## 🎯 Next Steps

1. Choose your preferred video generation service
2. Add API keys to `.env` file
3. Uncomment and customize the code in `src/tools/videoGenerationTool.ts`
4. Test with a simple scene first
5. Implement video compilation pipeline
6. Add error handling and retry logic
7. Consider caching generated assets

---

## 📚 Resources

- [Replicate Docs](https://replicate.com/docs)
- [Runway API Docs](https://docs.runwayml.com)
- [Leonardo API Docs](https://docs.leonardo.ai)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Remotion Docs](https://remotion.dev/docs)
- [ElevenLabs API](https://docs.elevenlabs.io)

---

## 🆘 Support

For questions or issues with video generation integration, check:
- API provider documentation
- Community forums
- GitHub issues of respective SDKs

Good luck with your video generation! 🚀

