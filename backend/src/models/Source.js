import { connectToDatabase } from '../db/connection.js';
import crypto from 'crypto';
import { validateGoogleCredentials } from '../services/googleAuth.js';


// Encryption key (store this securely in environment variables)
const encryptionKey = process.env.ENCRYPTION_KEY || 'default-encryption-key';

// Function to encrypt data
function encrypt(text) {
  const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt data
function decrypt(encryptedText) {
  const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Source model
export default class Source {
  static collectionName = 'sources';

  // Add a new source
  static async addSource(sourceData) {
    const db = await connectToDatabase();

     // Validate Google Workspace credentials
     const isValid = await validateGoogleCredentials(sourceData.credentials);
     
     if (!isValid) {
       throw new Error('Invalid Google Workspace credentials');
     }

    // Encrypt sensitive credentials
    const encryptedCredentials = {
      clientEmail: encrypt(sourceData.credentials.clientEmail),
      privateKey: encrypt(sourceData.credentials.privateKey),
      scopes: sourceData.credentials.scopes,
    };

    // Insert the source into the collection
    const result = await db.collection(this.collectionName).insertOne({
      ...sourceData,
      credentials: encryptedCredentials,
    });

    return result.insertedId;
  }

  // Remove a source by ID
  static async removeSource(id) {
    const db = await connectToDatabase();
    const result = await db.collection(this.collectionName).deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // List all sources
  static async listSources() {
    const db = await connectToDatabase();
    const sources = await db.collection(this.collectionName).find().toArray();

    // Decrypt credentials before returning
    return sources.map((source) => ({
      ...source,
      credentials: {
        clientEmail: decrypt(source.credentials.clientEmail),
        privateKey: decrypt(source.credentials.privateKey),
        scopes: source.credentials.scopes,
      },
    }));
  }
}