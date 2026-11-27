import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { AiResponse, AssistantAnswer } from "@/lib/lab/assistant-types";

// Built inside the handler so the schema stays server-side.
function questionSchema() {
  return z.object({
    input: z.string().trim().min(1).max(1500),
    history: z
      .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
      .max(20)
      .default([]),
  });
}

// Lab HR Assistant. Uses Gemini when GEMINI_API_KEY is set (GEMINI_MODEL optional);
// otherwise, or if the call fails, answers offline by quoting the closest handbook section.
export const askLabAssistant = createServerFn({ method: "POST" })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<AiResponse<AssistantAnswer>> => {
    const parsed = questionSchema().safeParse(data);
    if (!parsed.success) {
      return { demoMode: true, error: "Please type a question under 1,500 characters." };
    }
    const { answerLabQuestion } = await import("@/lib/lab/assistant.server");
    const history = parsed.data.history.slice(-6).map((t) => ({
      role: t.role,
      content: t.content.slice(0, 800),
    }));
    return answerLabQuestion(parsed.data.input, history);
  });
