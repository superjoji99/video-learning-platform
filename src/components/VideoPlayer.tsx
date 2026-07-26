import { extractYoutubeId } from "@/lib/youtube";

export function VideoPlayer({ youtubeUrl }: { youtubeUrl: string }) {
  const videoId = extractYoutubeId(youtubeUrl);

  if (!videoId) {
    return (
      <div className="aspect-video w-full bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">動画を読み込めませんでした</p>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
