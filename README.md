# EcoFlow: A Debate Flow Management System

EcoFlow is a comprehensive web application designed to streamline the management of debate flows. It provides a user-friendly interface for uploading, organizing, and analyzing debate flows, enhancing the experience for debaters, coaches, and judges alike.

This React-based application integrates with Firebase for backend services, offering robust user authentication, real-time database operations, and secure file storage. The system allows users to upload debate flows, categorize them by tournaments and rounds, and apply various filters for easy retrieval.

Key features include:
- User authentication and personalized dashboards
- Flow upload with metadata tagging
- Advanced filtering and search capabilities
- Tournament management and flow organization
- Leaderboard to track community impact
- Responsive design for seamless use across devices

EcoFlow aims to revolutionize how debate flows are managed, making it easier for the debate community to store, access, and analyze their performance data.

## Repository Structure

```
.
├── src/
│   ├── components/
│   │   ├── EditFlowModal.jsx
│   │   ├── FilterBar.jsx
│   │   ├── FlowCard.jsx
│   │   ├── FlowUpload.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── Tournaments.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   └── firebase/
│   │       ├── config.js
│   │       ├── db-operations.js
│   │       ├── flows.js
│   │       ├── storage-utils.js
│   │       ├── tournaments.js
│   │       ├── users.js
│   │       └── validation.js
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   └── Leaderboard.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── firebase.json
├── firestore.indexes.json
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Usage Instructions

### Installation

Prerequisites:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/tomisin05/flow-scanner.git
   cd flow-scan
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following Firebase configuration variables:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Getting Started

To run the development server:

```
npm run dev
```

This will start the Vite development server. Open your browser and navigate to `http://localhost:5173` to view the application.

### Configuration

The application uses Firebase for backend services. Ensure that your Firebase project is set up with the following:

- Authentication enabled (with email/password provider)
- Firestore database created
- Storage bucket initialized

Update the Firebase configuration in `src/lib/firebase/config.js` if needed.

### Common Use Cases

1. Uploading a Flow:
   - Navigate to the Dashboard
   - Click "Upload New Flow"
   - Fill in the flow details and upload the file
   - Click "Submit" to save the flow

2. Filtering Flows:
   - Use the FilterBar component on the Dashboard
   - Select filters such as tournament, round, team, etc.
   - The flow list will update automatically

3. Editing a Flow:
   - Click the "Edit" button on a FlowCard
   - Update the flow details in the EditFlowModal
   - Click "Save" to apply changes

4. Deleting a Flow:
   - Click the "Delete" button on a FlowCard
   - Confirm the deletion when prompted

### Testing & Quality

To run linting:

```
npm run lint
```

### Troubleshooting

1. Issue: Firebase configuration errors
   - Error: "Firebase: Error (auth/invalid-api-key)."
   - Diagnostic process:
     1. Check if the `.env` file exists in the root directory
     2. Verify that all Firebase configuration variables are correctly set
     3. Ensure that the Firebase project is properly set up in the Firebase Console
   - Solution: Double-check the Firebase configuration in both the `.env` file and the Firebase Console

2. Issue: Flows not displaying on the Dashboard
   - Error: No specific error message, but an empty flow list
   - Diagnostic process:
     1. Check the browser console for any error messages
     2. Verify that the user is authenticated
     3. Inspect the Firestore database to ensure flows are being saved
   - Solution: 
     - If not authenticated, log in to the application
     - If flows exist in Firestore but don't display, check the filters applied in the FilterBar component

### Debugging

To enable verbose logging:

1. In `src/lib/firebase/flows.js`, uncomment or add console.log statements in key functions like `uploadFlow`, `getUserFlows`, etc.
2. In the browser, open the developer tools (F12) and check the console for detailed logs.

Performance optimization:
- Monitor network requests in the browser's Network tab
- Use React DevTools to identify unnecessary re-renders
- Consider implementing pagination for large datasets in the Dashboard component

## Data Flow

The EcoFlow application follows a unidirectional data flow pattern. Here's an overview of how data flows through the application:

1. User Authentication
   [User] -> [AuthContext] -> [Firebase Auth]

2. Flow Management
   [User] -> [Dashboard] -> [FlowUpload/EditFlowModal] -> [Firebase Functions] -> [Firestore/Storage]

3. Data Retrieval
   [Firestore] -> [Firebase Functions] -> [Dashboard/FilterBar] -> [FlowCard]

```
+-------------+     +--------------+     +------------------+
|    User     | --> | AuthContext  | --> |   Firebase Auth  |
+-------------+     +--------------+     +------------------+
       |                                          |
       v                                          v
+-------------+     +--------------+     +------------------+
|  Dashboard  | <-> | FlowUpload/  | <-> | Firebase         |
|             |     | EditFlowModal|     | Functions        |
+-------------+     +--------------+     +------------------+
       ^                                          |
       |                                          v
+-------------+     +--------------+     +------------------+
| FilterBar   | <-> |   FlowCard   | <-- | Firestore/       |
|             |     |              |     | Storage          |
+-------------+     +--------------+     +------------------+
```

Note: The Firebase Functions layer represents the client-side Firebase SDK operations, not serverless functions.

## Infrastructure

The EcoFlow application utilizes Firebase as its backend infrastructure. Key resources include:

1. Firebase Authentication
   - Purpose: Manages user authentication and session handling

2. Cloud Firestore
   - Collections:
     - flows: Stores metadata for uploaded debate flows
     - users: Stores user profile information
     - tournaments: Stores tournament data

3. Firebase Storage
   - Purpose: Stores uploaded flow files

4. Firestore Indexes (defined in firestore.indexes.json):
   - Collection: flows
     - Indexes on userId, status, createdAt for efficient querying
     - Additional indexes for filtering by tournament, round, team, etc.

5. Firebase Configuration (src/lib/firebase/config.js):
   - Initializes Firebase app with environment-specific configuration
   - Exports initialized Firebase services (auth, db, storage)

The application does not use a dedicated infrastructure-as-code solution like CloudFormation or Terraform. Instead, it relies on Firebase's built-in hosting and database services, configured through the Firebase Console and local configuration files.