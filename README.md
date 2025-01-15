# StockSmart AI: AI-Powered Inventory Management and Recipe Generation

StockSmart AI is a React-based web application that combines intelligent inventory management with AI-driven recipe generation. It helps users track their food inventory and create recipes based on available ingredients.

This application leverages Firebase for backend services and Google's Generative AI for recipe creation. It offers a user-friendly interface for managing inventory items, generating recipes, and maintaining a collection of saved recipes.

## Repository Structure

The project follows a standard React application structure with additional directories for Firebase configuration and custom components:

```
.
├── src/
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   │   ├── firebase/
│   │   ├── gemini/
│   │   └── services/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

Key Files:
- `src/App.jsx`: Main application component and routing setup
- `src/pages/Dashboard.jsx`: Inventory management interface
- `src/pages/RecipeGenerator.jsx`: AI-powered recipe generation page
- `src/lib/firebase/config.js`: Firebase configuration and initialization
- `package.json`: Project dependencies and scripts

## Usage Instructions

### Installation

1. Ensure you have Node.js (v14 or later) and npm installed.
2. Clone the repository:
   ```
   git clone <repository-url>
   cd stockSmart AI
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the project root and add your Firebase and Google AI configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key
   ```

### Running the Application

To start the development server:

```
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

To create a production build:

```
npm run build
```

The built files will be in the `dist/` directory.

### Linting

To run the linter:

```
npm run lint
```

### Testing

Currently, there are no specified test scripts in the `package.json`. It's recommended to add testing configurations and scripts for maintaining code quality.

## Data Flow

1. User Authentication:
   - Users sign up or log in through the Firebase Authentication service.
   - The `AuthContext` manages the user's authentication state throughout the application.

2. Inventory Management:
   - Users can add, view, update, and delete inventory items.
   - Inventory data is stored in Firebase Firestore.
   - The `Dashboard` component fetches and displays inventory items.
   - `InventoryUploadModal` allows users to add new items, including image uploads to Firebase Storage.

3. Recipe Generation:
   - Users input available ingredients and dietary restrictions in the `RecipeGenerator` component.
   - The application sends a request to the Google Generative AI model via the `geminiModel`.
   - The AI generates a recipe based on the input, which is then parsed and displayed to the user.
   - Users can save generated recipes, which are stored in Firestore.

4. Data Persistence:
   - All user data, including inventory items and saved recipes, are stored in Firebase Firestore.
   - Images are stored in Firebase Storage.

```
[User] <-> [React Frontend] <-> [Firebase Auth]
                            <-> [Firebase Firestore]
                            <-> [Firebase Storage]
                            <-> [Google Generative AI]
```

## Deployment

The application is built using Vite, which provides an optimized build for deployment. After running `npm run build`, the `dist/` directory can be deployed to any static hosting service that supports single-page applications.

Recommended deployment platforms include Firebase Hosting, Vercel, or Netlify. Ensure that you configure your deployment platform to handle client-side routing properly.

## Infrastructure

The application relies on the following Firebase services:

- Firebase Authentication: User authentication and management
- Firebase Firestore: Database for storing inventory items and recipes
- Firebase Storage: File storage for inventory item images

The Firebase configuration is centralized in `src/lib/firebase/config.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

Ensure that your Firebase project is set up with the necessary services and that the configuration in your `.env` file matches your Firebase project settings.

## Future Iterations

### Planned Features and Enhancements

#### Recipe Management Enhancements
- [ ] Advanced recipe filtering and categorization
  - Filter by meal type (breakfast, lunch, dinner, dessert)
  - Filter by dietary restrictions (vegetarian, vegan, gluten-free)
  - Custom category tags
- [ ] Recipe scaling functionality
- [ ] Cooking time and difficulty level indicators

#### Shopping List Generator
- [ ] Automatic ingredient aggregation from multiple recipes
- [ ] Smart quantity combining and unit conversion
- [ ] Customizable shopping categories
- [ ] Export shopping list to PDF/email
- [ ] Integration with popular grocery delivery services

#### Meal Planning Calendar
- [ ] Drag-and-drop weekly meal planner
- [ ] Automatic shopping list generation based on meal plan
- [ ] Meal prep instructions and timelines
- [ ] Nutritional balance tracking across meals
- [ ] Calendar integration (Google Calendar, iCal)

#### Recipe Sharing and Social Features
- [ ] Public/private recipe sharing options
- [ ] Shareable recipe links
- [ ] Social media integration
- [ ] Recipe collections and favorites
- [ ] Follow other users and their recipe collections

#### Recipe Rating and Comments
- [ ] 5-star rating system
- [ ] User reviews and comments
- [ ] Photo upload for recipe results
- [ ] Recipe modification suggestions
- [ ] Most popular recipes showcase

#### Nutritional Information Analysis
- [ ] Detailed nutritional breakdown
- [ ] Dietary goal tracking
- [ ] Allergen warnings
- [ ] Macro and micronutrient analysis
- [ ] Custom dietary restriction warnings

#### Additional Planned Improvements
- [ ] Mobile app development
- [ ] Print-friendly recipe cards
- [ ] Voice command integration
- [ ] Recipe version control (track modifications)
- [ ] Ingredient price tracking and budget planning
- [ ] Integration with smart kitchen appliances
- [ ] Meal prep video tutorials
- [ ] Seasonal recipe recommendations
- [ ] Inventory management integration
- [ ] Recipe scaling calculator

### Technical Enhancements
- [ ] Performance optimization
- [ ] Offline functionality
- [ ] Enhanced search capabilities
- [ ] API integrations with nutrition databases
- [ ] Mobile responsive design improvements
- [ ] Accessibility improvements
- [ ] Enhanced data analytics
- [ ] User preference learning

### Infrastructure Updates
- [ ] Automated testing implementation
- [ ] CI/CD pipeline improvements
- [ ] Database optimization
- [ ] Caching implementation
- [ ] Security enhancements
- [ ] Backup and recovery improvements
- [ ] Monitoring and logging enhancements

### User Experience Improvements
- [ ] Enhanced onboarding process
- [ ] Improved navigation
- [ ] Dark mode support
- [ ] Customizable user dashboard
- [ ] Interactive tutorials
- [ ] Enhanced error handling and user feedback
- [ ] Accessibility compliance (WCAG 2.1)

### Integration Possibilities
- [ ] Smart device integration
- [ ] Social media sharing
- [ ] Email notification system
- [ ] Calendar integration
- [ ] Shopping platform integration
- [ ] Nutrition tracking apps integration

This roadmap represents our vision for future development. Features will be prioritized based on user feedback and resource availability. We welcome community suggestions and contributions to help make these improvements possible.

Note: This is a living document and will be updated as new ideas and needs are identified.
