import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Ensure this exists in .env.local

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ message: "Query is required" }, { status: 400 });
  }

  try {
    const youtubeRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&key=${YOUTUBE_API_KEY}&maxResults=1&type=video`
    );

    const data = await youtubeRes.json();
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ message: "No video found" }, { status: 404 });
    }

    const videoId = data.items[0].id.videoId;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log(videoUrl);

    return NextResponse.json({ videoUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch video" }, { status: 500 });
  }
}