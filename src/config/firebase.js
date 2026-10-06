const admin = require('firebase-admin');

let bucket = null;

/**
 * Initialize Firebase Admin SDK using Environment Variables
 */
const initializeFirebase = () => {
  try {
    if (admin.apps && admin.apps.length > 0) {
      bucket = admin.storage().bucket();
      return bucket;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

    if (projectId && clientEmail && privateKey && storageBucket) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        }),
        storageBucket
      });
      console.log('=================================');
      console.log('🔥 Firebase Admin SDK initialized successfully');
      console.log('=================================');
      bucket = admin.storage().bucket();
    } else {
      console.warn('⚠️ Firebase environment variables missing. Image upload will require Firebase configuration in .env');
    }
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error.message);
  }

  return bucket;
};

/**
 * Get Firebase Storage Bucket Instance
 */
const getBucket = () => {
  if (!bucket && admin.apps && admin.apps.length > 0) {
    bucket = admin.storage().bucket();
  }
  return bucket;
};


module.exports = {
  initializeFirebase,
  getBucket,
  admin
};
