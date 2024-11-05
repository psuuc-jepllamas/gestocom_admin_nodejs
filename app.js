import express from 'express';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore"; 
import path from 'path';
import { fileURLToPath } from 'url';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDGaL4b1BEFuC_j4GLgmkO9qmJGjQFp23w",
    authDomain: "capstone-102.firebaseapp.com",
    databaseURL: "https://capstone-102-default-rtdb.firebaseio.com",
    projectId: "capstone-102",
    storageBucket: "capstone-102.appspot.com",
    messagingSenderId: "210094060867",
    appId: "1:210094060867:web:4856129ff4008708ebebf6",
    measurementId: "G-M3KYDWRN84"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const server = express();

// Compute __dirname using fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.use(express.static(__dirname + '/public'));

// Root routes
server.get('/', (req, res) => {
    res.redirect('/dashboard'); // Redirect to the /dashboard route
});

// Dashboard route
server.get('/dashboard', async (req, res) => {
    try {
        const counts = {};

        // Fetch the document count for each category and the total across categories
        const beginnerDocs = await getDocs(collection(db, 'Categories/beginner/userProgress'));
        const intermediateDocs = await getDocs(collection(db, 'Categories/intermediate/userProgress'));
        const advancedDocs = await getDocs(collection(db, 'Categories/advanced/userProgress'));

        counts.name1Count = beginnerDocs.size;
        counts.name2Count = intermediateDocs.size;
        counts.name3Count = advancedDocs.size;
        counts.totalUserCount = beginnerDocs.size + intermediateDocs.size + advancedDocs.size;

        // Fetch subscriber count
        const subscriberDoc = await getDocs(collection(db, 'Subscribers'));
        counts.subscriberCount = subscriberDoc.size;

        // Render the EJS template with the counts
        console.log('Counts:', counts);
        res.render('dashboard', { counts });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

import { Timestamp } from "firebase/firestore"; // Import Timestamp from Firestore

// Feedbacks route
server.get('/feedbacks', async (req, res) => {
    try {
        const feedbacks = [];

        // Reference the Feedback document inside Profile collection
        const feedbackCollectionRef = collection(db, 'Profile/Feedback/oRjBFAci1vZlYWVTsLooyVRQrYb2');
        const feedbackDocs = await getDocs(feedbackCollectionRef);

        // Loop through each feedback document and retrieve the feedback and timestamp
        feedbackDocs.forEach(doc => {
            const feedbackData = doc.data();
            if (feedbackData) {
                const formattedTimestamp = feedbackData.timestamp instanceof Timestamp
                    ? feedbackData.timestamp.toDate().toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        timeZone: 'Asia/Manila' // Adjusts to UTC+8
                    })
                    : 'No timestamp provided';
                
                feedbacks.push({
                    id: doc.id, // Use document ID as Name
                    feedback: feedbackData.feedback || 'No feedback provided',
                    timestamp: formattedTimestamp
                });
            }
        });

        // Render the EJS template with the feedbacks data
        res.render('feedbacks', { feedbacks });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).send('Error fetching feedbacks');
    }
});



// Start the server
server.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
