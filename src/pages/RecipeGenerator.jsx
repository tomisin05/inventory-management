import { useState, useEffect } from 'react';
import { geminiModel } from '../lib/gemini/config';
import { saveRecipe, getUserRecipes } from '../lib/firebase/recipe-operations';
import { auth } from '../lib/firebase/config';
import RecipeCard from './RecipeCard';


function RecipeGenerator() {
  const [ingredients, setIngredients] = useState('');
  const [dietary, setDietary] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    try {
      const recipes = await getUserRecipes(auth.currentUser.uid);
      setSavedRecipes(recipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  };

const generateRecipe = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setRecipe(null);

  try {
    const prompt = `You are a cooking expert. Create a recipe using these ingredients: ${ingredients}. 
      ${dietary ? `Consider these dietary restrictions: ${dietary}.` : ''}
      You must respond ONLY with a valid JSON object, no additional text or explanations.
      NOTE: the nutritional info must be a string for example "50 grams"
      The JSON must follow this exact structure:
      {
        "name": "Recipe Name",
        "prepTime": "preparation time in minutes",
        "cookTime": "cooking time in minutes",
        "servings": number,
        "ingredients": [
          "ingredient 1 with quantity",
          "ingredient 2 with quantity"
        ],
        "instructions": [
          "step 1",
          "step 2"
        ],
        "nutritionalInfo": {
          "calories": "amount per serving",
          "protein": "grams per serving",
          "carbs": "grams per serving",
          "fat": "grams per serving"
        }
      }`;

    const result = await geminiModel.generateContent({
        contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      },
    });

    const response = await result.response;
    const text = response.text();
    console.log('Raw response:', text);
    
    // Clean the response text
    let cleanedText = text.trim()
      // Remove any markdown code blocks
      .replace(/```json\n?|\n?```/g, '')
      // Remove any leading/trailing whitespace
      .trim();
    
    // Try to find the JSON object if there's additional text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }
    
    try {
      const jsonRecipe = JSON.parse(cleanedText);
      
      // Validate the required fields
      const requiredFields = ['name', 'prepTime', 'cookTime', 'servings', 'ingredients', 'instructions', 'nutritionalInfo'];
      const missingFields = requiredFields.filter(field => !jsonRecipe[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Ensure nutritionalInfo has all required fields
      const requiredNutritionFields = ['calories', 'protein', 'carbs', 'fat'];
      const missingNutritionFields = requiredNutritionFields.filter(
        field => !jsonRecipe.nutritionalInfo[field]
      );

      if (missingNutritionFields.length > 0) {
        throw new Error(`Missing nutritional info fields: ${missingNutritionFields.join(', ')}`);
      }

      // Ensure arrays are actually arrays
      if (!Array.isArray(jsonRecipe.ingredients)) {
        jsonRecipe.ingredients = [jsonRecipe.ingredients].filter(Boolean);
      }
      if (!Array.isArray(jsonRecipe.instructions)) {
        jsonRecipe.instructions = [jsonRecipe.instructions].filter(Boolean);
      }

      // Ensure servings is a number
      jsonRecipe.servings = Number(jsonRecipe.servings) || 1;

      setRecipe(jsonRecipe);
    } catch (parseError) {
      console.error('Raw response that failed to parse:', cleanedText);
      console.error('Parse error:', parseError);
      
      // Try to clean the JSON string further if it failed to parse
      try {
        // Replace any single quotes with double quotes
        cleanedText = cleanedText.replace(/'/g, '"');
        // Remove any trailing commas before closing braces/brackets
        cleanedText = cleanedText.replace(/,(\s*[}\]])/g, '$1');
        // Try parsing again
        const jsonRecipe = JSON.parse(cleanedText);
        setRecipe(jsonRecipe);
      } catch (secondError) {
        throw new Error('Failed to parse recipe response as JSON. The AI response was not in the correct format.');
      }
    }
  } catch (err) {
    setError(err.message || 'Failed to generate recipe. Please try again.');
    console.error('Error generating recipe:', err);
  } finally {
    setLoading(false);
  }
};


  const handleSaveRecipe = async () => {
    try {
      if (!recipe) return;
      
      const recipeData = {
        ...recipe,
        ingredients: recipe.ingredients,
        dietary: dietary,
        createdAt: new Date()
      };

      await saveRecipe(recipeData, auth.currentUser.uid);
      await loadSavedRecipes();

      setTimeout(() => {
        setRecipe(null);
        setIngredients('');
        setDietary('');
        alert('Recipe saved successfully!');
        // setShowSaved(true);
      }, 0);      
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Recipe Generator</h1>

      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setShowSaved(false)}
          className={`px-4 py-2 rounded ${!showSaved ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Generate Recipe
        </button>
        <button
          onClick={() => setShowSaved(true)}
          className={`px-4 py-2 rounded ${showSaved ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
        >
          Saved Recipes ({savedRecipes.length})
        </button>
      </div>

      {!showSaved ? (
        <>
          <form onSubmit={generateRecipe} className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Ingredients
            <span className="text-gray-500 text-sm ml-2">(comma separated)</span>
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows="3"
            placeholder="e.g., chicken, rice, tomatoes, onions"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Restrictions
            <span className="text-gray-500 text-sm ml-2">(optional)</span>
          </label>
          <input
            type="text"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., vegetarian, gluten-free, dairy-free"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {loading ? 'Generating Recipe...' : 'Generate Recipe'}
        </button>
      </form>



          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {recipe && (
            <div className="space-y-4">
              <RecipeCard recipe={recipe} />
              <button
                onClick={handleSaveRecipe}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Save Recipe
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          {savedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
          {savedRecipes.length === 0 && (
            <p className="text-center text-gray-500">No saved recipes yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RecipeGenerator;
