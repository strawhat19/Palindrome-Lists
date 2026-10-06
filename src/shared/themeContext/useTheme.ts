import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export const useTheme = () => {
  const theme = useContext(ThemeContext);

  if (!theme) throw new Error(`useTheme Must Be Used Within ThemeProvider`);

  return theme;
};
