import { createContext, FC, ReactNode, useEffect, useState } from 'react';
type translationContext = {
    language_code: string;
    changeLanguage: (e: string) => void;
};

 
export const TranslationContext = createContext<translationContext>({} as translationContext);

export const TranslationsProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [language_code, setLanguage] = useState('en');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLanguage(localStorage.getItem('app_lang') ?? 'en');
        }
    }, []);

    const changeLanguage = (code: string) => {
        setLanguage(code);
        if (typeof window !== 'undefined') {
            localStorage.setItem('app_lang', code);
        }
    };

    return (
        <TranslationContext.Provider value={{ language_code, changeLanguage }}>
            {children}
        </TranslationContext.Provider>
    );
};
