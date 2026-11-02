// server.js

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { db, auth } from "./firebase/firebaseConfig.js"; 

dotenv.config();

const app = express();

// --- Setup Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON request bodies

// --- Firestore Connection Test ---
// (Runs once on server start)
(async () => {
  try {
    await db.collection("users").doc("ping").set({
      ok: true,
      ts: new Date().toISOString()
    });
    console.log("Firestore connection successful! (Wrote to 'test/ping')");
  } catch (e) {
    console.error(" FATAL FIRESTORE ERROR ");
    console.error("The server CANNOT connect to Firestore. Check your service account key and project permissions.");
    console.error(e.message);
  }
})();

/* =======================================
   AUTHENTICATION MIDDLEWARE
======================================= */
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Unauthorized: Token missing or invalid format" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    // Verify the ID Token (sent from the client app)
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; // Add user info to the request object
    next(); // Proceed to the protected route
  } catch (error) {
    console.error("Token Verification Error:", error.message);
    res.status(403).json({ error: "Unauthorized: Invalid token", code: error.code });
  }
};


/* =======================================
   API ROUTES
======================================= */

// --- Root Route ---
app.get("/", (req, res) => {
  res.send("TruthLens Backend is running with Firebase Admin SDK");
});

/* --- Signup API --- */
app.post("/api/signup", async (req, res) => {

  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required." });
  }

  try {
    // 1. Create the user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    console.log("Successfully created new auth user:", userRecord.uid);

    // 2. Create the user profile in Firestore
    const userData = {
      uid: userRecord.uid,
      username,
      email,
      createdAt: new Date().toISOString(),
      emailVerified: userRecord.emailVerified,
    };
    //    Use .set() to create the document.
    await db.collection("users").doc(userRecord.uid).set(userData, { merge: true });

    console.log("Successfully created Firestore profile for:", userRecord.uid);

    // Send success response
    res.status(201).json({
      message: "User registered successfully!",
      uid: userRecord.uid,
    });
  } catch (error) {
    console.error("Signup Error:", error.message, error);
    
    // Provide more specific error messages to the client
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: "The email address is already in use." });
    }
    if (error.code === 'auth/invalid-password') {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }
    
    res.status(500).json({ error: "An internal server error occurred." });
  }
});
// ADD this new route to your backend API file

app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "ID token is required." });
  }

  try {

    const decodedToken = await auth.verifyIdToken(token);
    
    const { uid, email, name, picture } = decodedToken;

    // 2. Prepare user data for Firestore
    const userData = {
      uid: uid,
      username: name, 
      email: email,
      photoURL: picture || null, 
      emailVerified: decodedToken.email_verified || false
    };

    // 3. Create or update the user's profile in Firestore
    await db.collection("users").doc(uid).set(userData, { merge: true });

    console.log("Successfully verified Google user and saved to Firestore:", uid);

    // Send success response
    res.status(200).json({
      message: "User authenticated successfully!",
      uid: uid,
    });

  } catch (error) {
    console.error("Google Auth API Error:", error.message, error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: "Token expired. Please sign in again." });
    }
    
    res.status(500).json({ error: "An internal server error occurred." });
  }
});
app.post("/api/submitNews", async (req, res) => {
  // We no longer expect 'newsId' from the client
  const { content } = req.body;

  if (!content ) {
    return res.status(400).json({ error: "Either content or url is required" });
  }
  

  try {
    // Prepare the document data
    const newsData = {
      // status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Add content or url, just like before
    if (content) {
      newsData.content = content;
    }

    // 1. Create a new document in Firestore
    const docRef = await db.collection("newsArticles").add(newsData);

    // 2. The auto-generated ID is in docRef.id
    console.log("Document created with new ID:", docRef.id);

    // 3. Respond to the user with the new ID
    res.status(202).json({ 
      message: "News submitted and is being analyzed.", 
      id: docRef.id  // Send the new ID back
    });

  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ error: "Failed to submit news." });
  }
});

app.get("/api/detect/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const docId = req.params.id;
    if (!docId) {
      return res.status(400).json({ error: "Document ID is required." });
    }

    const docRef = db.collection("newsArticles").doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "No news article found with this ID." });
    }

    const data = doc.data();
    // console.log("Full document data:", data); 
    const rootStatus = data.status;
    if (!rootStatus || rootStatus === "pending" || rootStatus === "PROCESSING") {
      // This replaces your "null" check.
      return res.status(202).json({ 
        status: "pending", 
        message: "Analysis is still in progress. Please check back later." 
      });
    }

    // 3. Check for an error status
    if (rootStatus === "error") { 
      return res.status(500).json({
        status: "error",
        message: "An error occurred during analysis.",
        error_details: data.error_message || "No details provided."
      });
    }

    // 4. Success! The job is done.
    if (rootStatus === "PROCESSED") {
      return res.status(200).json({
        status: "completed",
        data: data 
      });
    }    
    // Fallback for any other unknown status
    return res.status(200).json({ status: rootStatus, data: data });

  } catch (error) {
    console.error(`Error fetching document ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to retrieve analysis results." });
  }
});
app.get("/api/analysis/distribution/", verifyFirebaseToken, async (req, res) => {
  try {
    const snapshot = await db.collection("newsArticles").where("status", "==", "PROCESSED").get(); 
    if (snapshot.empty) {
      return res.status(200).json({ reliable: 0, fake: 0, uncertain: 0 });
    }

    let counts = {
      reliable: 0,
      fake: 0,
      uncertain: 0
    }; 
    snapshot.forEach(doc => {
      const data = doc.data();
      const prediction = data.model_prediction?.prediction;
      if (prediction === "REAL") {
        counts.reliable += 1;
      } else if (prediction === "FAKE") {
        counts.fake += 1;
      } else {
        counts.uncertain += 1;
      }
    });

    res.status(200).json(counts);
  }catch (error) {
    console.error("Error fetching analysis distribution:", error);
    res.status(500).json({ error: "Failed to retrieve analysis distribution." });
  }
});
// --- Helper functions for date manipulation (add these near the top of your file) ---

// Gets a UTC-based day string (e.g., "Sun", "Mon")
const getDayString = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
};

// Gets a UTC-based ISO date string (e.g., "2025-11-07")
const getISODate = (date) => {
  return date.toISOString().split('T')[0];
};

// --- Add this new route for the Line Chart ---
app.get("/api/analysis/trending", async (req, res) => {
  try {
    // const userId = req.user.uid;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Normalize to start of today UTC

    // Get the date 6 days ago (to create a 7-day period including today)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setUTCDate(today.getUTCDate() - 6);
    const sevenDaysAgoISO = sevenDaysAgo.toISOString();

    // 1. Initialize a Map to hold our 7-day data structure
    let dailyData = new Map();
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setUTCDate(sevenDaysAgo.getUTCDate() + i);
      
      const dayKey = getISODate(date); // e.g., "2025-11-07"
      const dayName = getDayString(date); // e.g., "Fri"
      
      dailyData.set(dayKey, {
        time: dayName,
        reliable: 0,
        uncertain: 0,
        fake: 0
      });
    }

    // 2. Query Firestore for all user's processed articles in the last 7 days
    const snapshot = await db.collection("newsArticles").where("status", "==", "PROCESSED").where("createdAt", ">=", sevenDaysAgoISO).get();

    // 3. Loop through the documents and add to our daily counts
    snapshot.forEach(doc => {
      const data = doc.data();
      const createdAt = new Date(data.createdAt);
      const dayKey = getISODate(createdAt); // Get the "YYYY-MM-DD" key

      if (dailyData.has(dayKey)) {
        const prediction = data.model_prediction?.prediction;
        let dayStats = dailyData.get(dayKey);

        if (prediction === "REAL") {
          dayStats.reliable++;
        } else if (prediction === "FAKE") {
          dayStats.fake++;
        } else {
          dayStats.uncertain++;
        }
      }
    });

    // 4. Convert the Map's values into the final array
    const results = Array.from(dailyData.values());

    res.status(200).json(results);

  } catch (error) {
    console.error("Error fetching truth score trends:", error);
    res.status(500).json({ error: "Failed to retrieve trends." });
  }
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () =>
  console.log(`TruthLens backend running on http://localhost:${PORT}`)
);