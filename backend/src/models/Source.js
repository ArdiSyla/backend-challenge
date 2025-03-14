import { connectToDatabase } from '../db/connection.js';
import crypto from 'crypto';
import { validateGoogleCredentials } from '../services/googleAuth.js';


// Ensure the key is **exactly** 32 bytes for AES-256
const encryptionKey = process.env.ENCRYPTION_KEY || 'default-encryption-key';
const key = crypto.createHash('sha256').update(encryptionKey).digest(); 
const iv = Buffer.from('0000000000000000', 'utf8'); // Must be 16 bytes

// Function to encrypt text
function encrypt(text) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Function to decrypt text
function decrypt(encryptedText) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption Failed:', err.message);
    throw new Error('Decryption failed');
  }
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
    const source = await db.collection(this.collectionName).findOne({ _id: id });
    if (!source) {
      throw new Error('Source not found');
    }
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