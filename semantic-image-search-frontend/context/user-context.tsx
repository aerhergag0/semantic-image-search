"use client"

import {createContext, useCallback, useContext, useEffect, useState} from "react";

export interface User {
    username: string;
}

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    refetchUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUser = useCallback(async () => {
        if (!isLoading) setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/auth/me', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch user data');
            const userData: User = await response.json();


            console.log(userData);


            setUser(userData);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const refetchUser = useCallback(() => fetchUser(), [fetchUser]);

    const value = {user, isLoading, error, refetchUser};

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
