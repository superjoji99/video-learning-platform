import { isValidYoutubeUrl } from "./youtube";

export function validateCourseInput(input: { title: string }): {
  ok: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.title || input.title.trim().length === 0) {
    errors.push("タイトルは必須です");
  } else if (input.title.trim().length > 100) {
    errors.push("タイトルは100文字以内にしてください");
  }

  return { ok: errors.length === 0, errors };
}

export function validateChapterInput(input: {
  title: string;
  youtubeUrl: string;
}): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.title || input.title.trim().length === 0) {
    errors.push("タイトルは必須です");
  }

  if (!input.youtubeUrl || input.youtubeUrl.trim().length === 0) {
    errors.push("YouTube URLは必須です");
  } else if (!isValidYoutubeUrl(input.youtubeUrl)) {
    errors.push("YouTube の URL を入力してください");
  }

  return { ok: errors.length === 0, errors };
}
