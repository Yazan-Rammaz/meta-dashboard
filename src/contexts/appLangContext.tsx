import { createContext, FC, ReactNode, useEffect, useState } from 'react';
type translationContext = {
    language_code: string;
    changeLanguage: (e: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const TranslationContext = createContext<translationContext>({} as translationContext);

export const AppLangProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [language_code, setLanguage] = useState('en');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLanguage(localStorage.getItem('app_lang') ?? 'en');
        }
    }, []);

    const changeLanguage = (code: string) => {
        setLanguage(code);
        if (typeof window !== 'undefined') {
            localStorage.setItem('app_lang', code?.toLowerCase());
        }
    };

    return (
        <TranslationContext.Provider value={{ language_code, changeLanguage }}>
            {children}
        </TranslationContext.Provider>
    );
};
