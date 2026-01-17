import z from 'zod'

export const LyricsToScenePromptsRequestSchema = z.object({
  story: z.string().min(1, 'Story is required'),
  lyrics: z.string().min(1, 'Lyrics is required'),
})

export const LyricsToAudioRequestSchema = z.object({
  lyrics: z.string().min(1, 'Lyrics is required'),
  title: z.string().optional(),
  style: z.string().optional(),
  model: z.string().optional(),
})

export const StoryToLyricsRequestSchema = z.object({
  story: z.string().min(1, 'Story is required'),
})
