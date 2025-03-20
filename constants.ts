export const GEMINI_API_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const GENERATE_ALT_TEXT_PROMPT = `Generate a concise and descriptive alt text for this image that would be useful for someone who cannot see the image.

Follow these guidelines:
1. Describe only what is visually present in the image - focus on observable elements
2. Avoid saying 'an image of' or 'a picture of'
3. Avoid subjective interpretations unless critical to understanding (if needed, use 'as if' phrasing)
4. Include relevant brand names or character identities if visually recognizable
5. Describe visual appearance, actions, and context without inferring emotions
6. Keep the alt text under 120 characters for optimal accessibility

Examples of good alt text:
- For a product: "Red Nike running shoes with white soles and reflective side panels"
- For a person: "Woman with curly hair in business attire presenting charts on a digital screen"
- For a character: "Hello Kitty wearing a blue dress over red stripes, waving with her paw"
- For scenery: "Mountain lake at sunset with pine trees reflecting in still water"
- For a diagram: "Flowchart showing four steps of the customer feedback process with connecting arrows"

Respond with only the alt text, nothing else.`;
