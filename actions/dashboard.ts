"use server"

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getDetails(userInput: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
            ${userInput}

            Generate a JSON response containing exactly four objects, each representing a unique, vegetarian, and healthy edible item. Follow these strict guidelines:
            Title: Should be unique for each item and limited to two words only, it should name of an actual dish/recipe which exists and not some made up name strictly. The dish should be different everytime, it can be continential, preferabbly indian and consumed by lot of people, it should taste great
            Description: Must be 140-150 characters strictly very strictly and end with an emoji that represents the item. It should highlight the health benefits and vegetarian nature of the item.
            Image Prompt: Should be highly descriptive to generate the best possible image. It must include details about color, texture, ingredients, plating, and background to ensure visual accuracy and it should be very long and very descriptive. Also if the dish is Indian then make sure the dish is converted into english words properly so that image looks proper
            Ensure that all four items adhere to these rules and do not include any unhealthy or junk food.
            Also make sure there is no non-vegetarian food included, I should only get food which vegetarian, even if user asks for non-vegetarian food give the vegetarian alternatives of it ”
            This should be the JSON format strictly, title with small 't', description with small 'd' and image_prompt with small 'i'
            {
                'title'
                'description'
                'image_prompt'
            }
        `;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    try {
      const data = JSON.parse(cleanedText);
      return data;
    } catch (err) {
      console.error(err);
      throw new Error("Failed to parse JSON response");
    }
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch details");
  }
}


