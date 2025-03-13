import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate Google Workspace credentials
export async function validateGoogleCredentials(credentials) {
  const { clientEmail, privateKey, scopes } = credentials;

  try {
    console.log('Validating credentials:', clientEmail);

    const authClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, '\n'), // Ensures correct key format
      scopes,
    });
    // Authenticate and fetch a token
    await authClient.authorize();
    console.log('Google authentication successful.');
    // If no error is thrown, credentials are valid
    return true;
  } catch (err) {
    console.error('Failed to validate Google credentials:', err);
    return false;
  }
}