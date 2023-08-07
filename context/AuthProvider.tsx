import React, { useState, useEffect, createContext } from "react";
import * as SecureStore from "expo-secure-store";

interface User {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  role: string;
}

export interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  hasToken: boolean;
  hasRefreshToken: boolean;
  hasBooking: boolean;
  setHasBooking: (hasBooking: boolean) => void;
  user: User | null;
  logout: () => void;
  login: (access: string, refresh: string, user: User) => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [hasRefreshToken, setHasRefreshToken] = useState<boolean>(false);
  const [hasBooking, setHasBooking] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync("accessToken")
      .then((token) => {
        setHasToken(token !== null);
        setAccessToken(token || null);
      })
      .catch((err) => console.log(err));

    SecureStore.getItemAsync("refreshToken")
      .then((token) => {
        setHasRefreshToken(token !== null);
        setRefreshToken(token || null);
      })
      .catch((err) => console.log(err));

    SecureStore.getItemAsync("user")
      .then((user) => {
        setUser(user ? JSON.parse(user) : null);
      })
      .catch((err) => console.log(err));
  }, []);

  const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");

    setHasToken(false);
    setHasRefreshToken(false);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const login = async (access: string, refresh: string, user: User) => {
    await SecureStore.setItemAsync("accessToken", access);
    await SecureStore.setItemAsync("refreshToken", refresh);
    await SecureStore.setItemAsync("user", JSON.stringify(user));

    setHasToken(true);
    setHasRefreshToken(true);
    setUser(user);
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        hasToken,
        hasRefreshToken,
        hasBooking,
        user,
        setHasBooking,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
