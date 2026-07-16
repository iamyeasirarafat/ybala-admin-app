import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * In-memory token cache + concurrent-read deduplication.
 *
 * Two iOS-specific problems this solves:
 *
 * 1. Write-then-read race: iOS Keychain writes are not immediately
 *    consistent. Saving then instantly reading can return null.
 *    Fix: cache the value in memory on every save — reads never
 *    touch the Keychain again within the same session.
 *
 * 2. Concurrent Keychain reads: on cold start, initializeAuth() +
 *    every API interceptor all call getAccessToken() simultaneously.
 *    iOS Keychain handles concurrent access poorly and some calls
 *    return null. The first caller creates a pending promise that
 *    reads the Keychain once; every subsequent concurrent caller
 *    awaits the same promise instead of issuing its own read.
 */
let _cachedAccessToken: string | null = null;
let _cachedRefreshToken: string | null = null;

let _pendingAccessTokenRead: Promise<string | null> | null = null;
let _pendingRefreshTokenRead: Promise<string | null> | null = null;

// Access Token
export const saveAccessToken = async (token: string): Promise<void> => {
  _cachedAccessToken = token;
  _pendingAccessTokenRead = null;
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving access token:', error);
    throw error;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (_cachedAccessToken !== null) return _cachedAccessToken;

  if (!_pendingAccessTokenRead) {
    _pendingAccessTokenRead = SecureStore.getItemAsync(ACCESS_TOKEN_KEY)
      .then((token) => {
        _cachedAccessToken = token;
        _pendingAccessTokenRead = null;
        return token;
      })
      .catch((error) => {
        _pendingAccessTokenRead = null;
        console.error('Error getting access token:', error);
        return null;
      });
  }

  return _pendingAccessTokenRead;
};

export const deleteAccessToken = async (): Promise<void> => {
  _cachedAccessToken = null;
  _pendingAccessTokenRead = null;
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting access token:', error);
    throw error;
  }
};

// Refresh Token
export const saveRefreshToken = async (token: string): Promise<void> => {
  _cachedRefreshToken = token;
  _pendingRefreshTokenRead = null;
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving refresh token:', error);
    throw error;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  if (_cachedRefreshToken !== null) return _cachedRefreshToken;

  if (!_pendingRefreshTokenRead) {
    _pendingRefreshTokenRead = SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
      .then((token) => {
        _cachedRefreshToken = token;
        _pendingRefreshTokenRead = null;
        return token;
      })
      .catch((error) => {
        _pendingRefreshTokenRead = null;
        console.error('Error getting refresh token:', error);
        return null;
      });
  }

  return _pendingRefreshTokenRead;
};

export const deleteRefreshToken = async (): Promise<void> => {
  _cachedRefreshToken = null;
  _pendingRefreshTokenRead = null;
  try {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error deleting refresh token:', error);
    throw error;
  }
};

// Convenience: save both tokens
export const saveTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
  await saveAccessToken(accessToken);
  await saveRefreshToken(refreshToken);
};

// Convenience: delete all tokens
export const deleteAllTokens = async (): Promise<void> => {
  await deleteAccessToken();
  await deleteRefreshToken();
};

// Legacy support (backwards compatibility)
export const saveToken = saveAccessToken;
export const getToken = getAccessToken;
export const deleteToken = deleteAllTokens;
