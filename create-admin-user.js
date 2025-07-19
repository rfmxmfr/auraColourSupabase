// create-admin-user.js
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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
const db = getFirestore(app);

// Create admin user
async function createAdminUser() {
  try {
    // Replace with your desired admin user email and password
    const email = 'admin@aurastyle.ai';
    const password = 'Admin123!';
    
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    
    // Add admin role to the user in Firestore
    await setDoc(doc(db, 'users', userId), {
      email: email,
      role: 'admin',
      createdAt: new Date(),
    });
    
    console.log('Admin user created successfully:', userId);
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('Error creating admin user:', error.code, error.message);
  }
}

createAdminUser();