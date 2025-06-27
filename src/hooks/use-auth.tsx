'use client';

// This is a stub file to prevent build errors after removing authentication.
// The original authentication logic has been removed.

import type { User } from 'firebase/auth';
import React, { createContext, useContext } from 'react';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

// Provide a default, non-functional context value.
const AuthContext = createContext<AuthContextType>({ user: null, loading: false });

// AppProviders now just passes children through without any auth provider.
export const AppProviders = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

// The useAuth hook now returns a static "logged out" state.
export const useAuth = () => {
    return { user: null, loading: false };
};
