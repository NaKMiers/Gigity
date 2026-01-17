import { Output } from 'ai'
import z from 'zod'

// Output schema for scene prompts
export const LyricsToScenePromptsOutputSchema = z.object({
  scene: z.number().int().positive().describe('The scene number in sequence'),
  prompt: z
    .string()
    .min(10)
    .describe('A clear, detailed prompt for generating the scene image'),
})

export const LyricsToScenePromptsDataOutput = Output.object({
  schema: z.object({
    prompts: z
      .array(LyricsToScenePromptsOutputSchema)
      .min(1)
      .describe('List of scene prompts for video generation'),
  }),
})

// Type inference
export type LyricsToScenePromptsData = z.infer<
  typeof LyricsToScenePromptsDataOutput
>

// Lyrics to Audio response type
export type LyricsToAudioData = {
  lyrics: string
  taskId: string
  sunoResponse: unknown
}

// Story to Lyrics response type
export type StoryToLyricsData = {
  story: string
  lyrics: string
}
