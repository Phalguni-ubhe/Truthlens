// firebase/firebaseConfig.js

import admin from "firebase-admin";

// Import the service account key JSON file directly.
// This path is relative to this file, assuming both are in the 'firebase' folder.
import serviceAccount from "./serviceAccountKey.json" with { type: "json" };

console.log("Using service account:", serviceAccount.project_id);
// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    // Use the imported serviceAccount object directly
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export the initialized services
const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };