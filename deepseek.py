# deepseek.py
import os
import json
from google import genai  # Updated import
from dotenv import load_dotenv

load_dotenv()

# Initialize the client directly (no configure step needed for the new SDK)
# The client automatically uses the `GEMINI_API_KEY` environment variable.
client = genai.Client(api_key=os.environ.get('GEMINI_API_KEY'))

def get_summary(reviews):
    """
    Analyzes a list of reviews using the Gemini 3.1 Flash Lite model.
    """
    model = "gemini-3.1-flash-lite"  # High quota model
    
    if len(reviews) > 15:
        reviews = reviews[:15]
        print("Limited to first 15 reviews for analysis")

    prompt = f"""Analyze these {len(reviews)} student course reviews.
    Return ONLY valid JSON in this exact format, with no other text before or after:
    {{"positive": ["point1", "point2", "point3", "point4", "point5"],
      "negative": ["point1", "point2", "point3", "point4", "point5"]}}
    Be specific and include both positive and negative feedback found in the reviews.
    IMPORTANT: Do not include any explanatory text before or after the JSON.

    Reviews:
    """
    for review in reviews:
        prompt += f"\n- {review}"

    try:
        response = client.models.generate_content(
            model=model,
            contents=prompt
        )
        
        content = response.text
        print(f"Raw response length: {len(content)}")

        # Clean the response - remove markdown code blocks
        if content.startswith('```json'):
            content = content[7:]
        elif content.startswith('```'):
            content = content[3:]
        if content.endswith('```'):
            content = content[:-3]
        content = content.strip()

        # Try to extract JSON from the response if there's extra text
        start_idx = content.find('{')
        end_idx = content.rfind('}')
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            content = content[start_idx:end_idx + 1]

        # Validate and parse JSON
        result = json.loads(content)
        
        # Ensure required keys exist
        if 'positive' not in result:
            result['positive'] = []
        if 'negative' not in result:
            result['negative'] = []
            
        # Ensure we have arrays, not strings
        if isinstance(result['positive'], str):
            result['positive'] = [result['positive']]
        if isinstance(result['negative'], str):
            result['negative'] = [result['negative']]
            
        # Limit to 5 points each
        result['positive'] = result['positive'][:5]
        result['negative'] = result['negative'][:5]
        
        return json.dumps(result)

    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        print(f"First 500 chars of response: {content[:500]}")
        
        # Try to manually extract positive/negative sections as fallback
        positive_points = []
        negative_points = []
        
        # Simple extraction attempt
        if '"positive"' in content and '"negative"' in content:
            import re
            # Extract text between "positive": [ and next ]
            pos_match = re.search(r'"positive":\s*\[(.*?)\]', content, re.DOTALL)
            if pos_match:
                items = re.findall(r'"([^"]*)"', pos_match.group(1))
                positive_points = items[:5]
            
            neg_match = re.search(r'"negative":\s*\[(.*?)\]', content, re.DOTALL)
            if neg_match:
                items = re.findall(r'"([^"]*)"', neg_match.group(1))
                negative_points = items[:5]
        
        if positive_points or negative_points:
            return json.dumps({
                "positive": positive_points if positive_points else ["Unable to parse positive feedback"],
                "negative": negative_points if negative_points else ["Unable to parse negative feedback"]
            })
        
        return json.dumps({
            "positive": ["Could not analyze positive feedback"],
            "negative": ["Could not analyze negative feedback"]
        })
        
    except Exception as e:
        print(f"Gemini API error: {e}")
        return json.dumps({
            "positive": ["Service temporarily unavailable"],
            "negative": ["Please try again later"]
        })