// import React from 'react';

// function RecipeCard({ recipe }) {
//   // Parse the recipe text into sections
//   const parseRecipe = (recipeText) => {
//     const sections = {
//       name: '',
//       prepTime: '',
//       cookTime: '',
//       ingredients: [],
//       instructions: [],
//       nutrition: ''
//     };

//     const lines = recipeText.split('\n');
//     let currentSection = '';

//     lines.forEach(line => {
//       if (line.toLowerCase().includes('recipe name')) {
//         currentSection = 'name';
//         sections.name = line.split(':')[1]?.trim();
//       } else if (line.toLowerCase().includes('preparation time')) {
//         currentSection = 'prepTime';
//         sections.prepTime = line.split(':')[1]?.trim();
//       } else if (line.toLowerCase().includes('cooking time')) {
//         currentSection = 'cookTime';
//         sections.cookTime = line.split(':')[1]?.trim();
//       } else if (line.toLowerCase().includes('ingredients')) {
//         currentSection = 'ingredients';
//       } else if (line.toLowerCase().includes('instructions') || line.toLowerCase().includes('steps')) {
//         currentSection = 'instructions';
//       } else if (line.toLowerCase().includes('nutritional information')) {
//         currentSection = 'nutrition';
//       } else if (line.trim()) {
//         if (currentSection === 'ingredients' && line.trim().startsWith('-')) {
//           sections.ingredients.push(line.trim().substring(1).trim());
//         } else if (currentSection === 'instructions' && line.trim().startsWith('-')) {
//           sections.instructions.push(line.trim().substring(1).trim());
//         } else if (currentSection === 'nutrition') {
//           sections.nutrition += line.trim() + ' ';
//         }
//       }
//     });

//     return sections;
//   };

//   const parsedRecipe = parseRecipe(recipe.recipeText);

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//       <h2 className="text-2xl font-bold mb-4 text-indigo-600">{parsedRecipe.name}</h2>
      
//       <div className="grid grid-cols-2 gap-4 mb-4">
//         <div className="bg-gray-50 p-3 rounded">
//           <span className="font-semibold">Prep Time:</span> {parsedRecipe.prepTime}
//         </div>
//         <div className="bg-gray-50 p-3 rounded">
//           <span className="font-semibold">Cook Time:</span> {parsedRecipe.cookTime}
//         </div>
//       </div>

//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
//         <ul className="list-disc pl-5 space-y-1">
//           {parsedRecipe.ingredients.map((ingredient, index) => (
//             <li key={index}>{ingredient}</li>
//           ))}
//         </ul>
//       </div>

//       <div className="mb-6">
//         <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
//         <ol className="list-decimal pl-5 space-y-2">
//           {parsedRecipe.instructions.map((step, index) => (
//             <li key={index}>{step}</li>
//           ))}
//         </ol>
//       </div>

//       {parsedRecipe.nutrition && (
//         <div className="bg-gray-50 p-4 rounded">
//           <h3 className="text-lg font-semibold mb-2">Nutritional Information:</h3>
//           <p>{parsedRecipe.nutrition}</p>
//         </div>
//       )}

//       <div className="text-sm text-gray-500 mt-4">
//         Created: {new Date(recipe.createdAt?.toDate()).toLocaleDateString()}
//       </div>
//     </div>
//   );
// }

// export default RecipeCard;


function RecipeCard({ recipe }) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">{recipe.name}</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-semibold">Prep Time:</span> {recipe.prepTime}
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-semibold">Cook Time:</span> {recipe.cookTime}
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <span className="font-semibold">Servings:</span> {recipe.servings}
          </div>
        </div>
  
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Ingredients:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
  
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
  
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Nutritional Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="font-medium">Calories:</span>
              <br />{recipe.nutritionalInfo.calories}
            </div>
            <div>
              <span className="font-medium">Protein:</span>
              <br />{recipe.nutritionalInfo.protein}
            </div>
            <div>
              <span className="font-medium">Carbs:</span>
              <br />{recipe.nutritionalInfo.carbs}
            </div>
            <div>
              <span className="font-medium">Fat:</span>
              <br />{recipe.nutritionalInfo.fat}
            </div>
          </div>
        </div>
  
        {recipe.createdAt && (
          <div className="text-sm text-gray-500 mt-4">
            Created: {new Date(recipe.createdAt?.toDate()).toLocaleDateString()}
          </div>
        )}
      </div>
    );
  }
  
  export default RecipeCard;
  