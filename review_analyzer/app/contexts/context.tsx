'use client'

import { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContext {
    loading: boolean 
    updateLoading: (newValue: boolean) => void
}

const LoadingContext = createContext<LoadingContext | undefined> (undefined)

export const LoadingProvider = ({children}: {children: ReactNode}) =>
{
    const [loading, setLoading] = useState(false)
    const updateLoading = (newValue: boolean) => { setLoading(newValue)}

    return <LoadingContext.Provider value = {{loading, updateLoading}}>
        
        {children}
    
    </LoadingContext.Provider>


}

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error('useLoading must be used within LoadingProvider');
  return context;
};