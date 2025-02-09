import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const reqBody = await req.text();
    const { prompt } = JSON.parse(reqBody);
    const promptText = prompt?.trim();

    if (!promptText) {
        return NextResponse.json(
            { message: "Prompt is required" }, 
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: promptText,
                })
            }
        );

        const contentType = response.headers.get("content-type");
        if (!contentType?.startsWith("image/")) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Invalid image response");
        }


        const imageBuffer = await response.arrayBuffer(); // Get image as buffer


        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                "Content-Type": "image/png" 
            }
        });
    } catch (error) {
        console.error("Image generation failed:", error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : "Generation failed" },
            { status: 500 }
        );
    }
}