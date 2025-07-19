// create-test-user.js
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

// Firebase configuration with hardcoded values from .env.local
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "***REMOVED***",
  projectId: "***REMOVED***",
  storageBucket: "***REMOVED***.appspot.com",
  messagingSenderId: "***REMOVED***",
  appId: "1:***REMOVED***:web:d7b2e1b8d00dd0f1d7a3a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create test user
async function createTestUser() {
  try {
    // Replace with your desired test user email and password
    const email = 'test@example.com';
    const password = 'Test123!';
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Test user created successfully:', userCredential.user.uid);
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('Error creating test user:', error.code, error.message);
  }
}

createTestUser();