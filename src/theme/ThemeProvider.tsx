import { themeCreator } from '@/theme/base';
import { ThemeProvider } from '@mui/material';
import { StylesProvider } from '@mui/styles';
import { createContext, ReactNode, useEffect, useState } from 'react';

export const ThemeContext = createContext((themeName: string): void => {
    console.log(themeName);
});

const ThemeProviderWrapper: React.FC<{ children: ReactNode }> = (props) => {
    const [themeName, _setThemeName] = useState('PureLightTheme');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            _setThemeName(localStorage.getItem('appTheme') || 'PureLightTheme');
        }
    }, []);

    const theme = themeCreator(themeName);
    const setThemeName = (themeName: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('appTheme', themeName);
        }
        _setThemeName(themeName);
    };

    return (
        <StylesProvider injectFirst>
            <ThemeContext.Provider value={setThemeName}>
                <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
            </ThemeContext.Provider>
        </StylesProvider>
    );
};

export default ThemeProviderWrapper;
