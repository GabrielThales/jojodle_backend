"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocument = exports.addDocument = exports.getCollection = exports.getDb = void 0;
const admin = __importStar(require("firebase-admin"));
const serviceAccount = require('../service-account.json');
console.log("[LOG] firebaseService.ts - Iniciando Firebase...");
//const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
console.log("[LOG] firebaseService.ts - serviceAccount carregado.");
if (!admin.apps.length) {
    if (serviceAccount) {
        // If you store the service account JSON in an env var
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
    else {
        // Use GOOGLE_APPLICATION_CREDENTIALS or ADC otherwise
        admin.initializeApp();
    }
}
const db = admin.firestore();
const getDb = () => db;
exports.getDb = getDb;
const getCollection = (name) => db.collection(name);
exports.getCollection = getCollection;
const addDocument = async (collection, data) => {
    const ref = await db.collection(collection).add(data);
    return ref.id;
};
exports.addDocument = addDocument;
const getDocument = async (collection, id) => {
    const snap = await db.collection(collection).doc(id).get();
    return snap.exists ? { id: snap.id, ...snap.data() } : null;
};
exports.getDocument = getDocument;
exports.default = db;
console.log("[LOG] firebaseService.ts - Firebase inicializado.");
