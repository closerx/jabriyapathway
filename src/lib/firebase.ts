import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth();

// Validate Connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('permission-denied')) {
      // This is expected if rules are set up but document doesn't exist
      console.log("Firebase connection successful (Permission Denied is expected for this test doc)");
    } else if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration or internet connection. Client is operating in offline mode.");
    } else {
      console.warn("Firestore connection check encountered a transient error:", error);
    }
  }
}
testConnection();
