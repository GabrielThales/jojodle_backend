import * as admin from 'firebase-admin';

const serviceAccount = require('../service-account.json');

console.log("[LOG] firebaseService.ts - Iniciando Firebase...");
//const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

console.log("[LOG] firebaseService.ts - serviceAccount carregado.");


if (!admin.apps.length) {
    if (serviceAccount) {
        // If you store the service account JSON in an env var
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
    } else {
        // Use GOOGLE_APPLICATION_CREDENTIALS or ADC otherwise
        admin.initializeApp();
    }
}

export const db = admin.firestore();

export const getDb = (): FirebaseFirestore.Firestore => db;

export const getCollection = (name: string) => db.collection(name);

export const addDocument = async (collection: string, data: any) => {
    const ref = await db.collection(collection).add(data);
    return ref.id;
};

export const getDocument = async (collection: string, id: string) => {
    const snap = await db.collection(collection).doc(id).get();
    return snap.exists ? { id: snap.id, ...(snap.data() as object) } : null;
};

export default db;
console.log("[LOG] firebaseService.ts - Firebase inicializado.");