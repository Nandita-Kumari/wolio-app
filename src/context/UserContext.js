import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authApi from '../services/authApi';

const TOKEN_KEY = '@wolio_token';
const USER_KEY = '@wolio_user';
const ONBOARDING_KEY = '@wolio_onboarding';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(false);

  const setToken = (newToken) => {
    setTokenState(newToken);
    if (newToken) AsyncStorage.setItem(TOKEN_KEY, newToken);
    else AsyncStorage.removeItem(TOKEN_KEY);
  };

  const persistUser = (userData) => {
    setUser(userData);
    if (userData) AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    else AsyncStorage.removeItem(USER_KEY);
  };

  const loadStoredAuth = async () => {
    try {
      const [storedToken, storedUser, storedOnboarding] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
        AsyncStorage.getItem(ONBOARDING_KEY),
      ]);
      if (storedToken) setTokenState(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedOnboarding) {
        const parsed = JSON.parse(storedOnboarding);
        if (parsed?.completed) setHasCompletedOnboardingState(true);
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (role) => {
    await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify({ completed: true, role }));
    setHasCompletedOnboardingState(true);
  };

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setToken(data.token);
    persistUser(data.user);
    return data;
  };

  const signup = async (payload) => {
    return authApi.signup(payload);
  };

  const verify = async (email, otp) => {
    const data = await authApi.verifyUser(email, otp);
    return data;
  };

  const setAuthAfterVerify = (newToken, userData) => {
    setToken(newToken);
    persistUser(userData);
  };

  const logout = async () => {
    try {
      if (token) await authApi.logout(token);
    } catch (e) {
      // ignore
    }
    setToken(null);
    persistUser(null);
  };

  const forgotPassword = (email) => authApi.forgotPassword(email);
  const resetPassword = (email, otp, password, confirmPassword) =>
    authApi.resetPassword(email, otp, password, confirmPassword);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn: !!token,
        hasCompletedOnboarding,
        completeOnboarding,
        setToken,
        persistUser,
        login,
        signup,
        verify,
        setAuthAfterVerify,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
