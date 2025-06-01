import React from 'react';
import { render, act } from '@testing-library/react-native';
import { describe, it, expect, jest } from '@jest/globals';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { darkTheme, lightTheme } from '../theme';

// Mock useColorScheme
jest.mock('react-native', () => ({
  useColorScheme: jest.fn()
}));

const TestComponent = () => {
  const { theme, isDark } = useTheme();
  return (
    <div>
      <div data-testid="is-dark">{isDark.toString()}</div>
      <div data-testid="theme-background">{theme.colors.background}</div>
    </div>
  );
};

describe('ThemeContext', () => {
  it('should provide dark theme when system is in dark mode', () => {
    const { useColorScheme } = require('react-native');
    useColorScheme.mockReturnValue('dark');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('is-dark').textContent).toBe('true');
    expect(getByTestId('theme-background').textContent).toBe(darkTheme.colors.background);
  });

  it('should provide light theme when system is in light mode', () => {
    const { useColorScheme } = require('react-native');
    useColorScheme.mockReturnValue('light');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('is-dark').textContent).toBe('false');
    expect(getByTestId('theme-background').textContent).toBe(lightTheme.colors.background);
  });

  it('should throw error when useTheme is used outside ThemeProvider', () => {
    const consoleError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = consoleError;
  });

  it('should update theme when system theme changes', () => {
    const { useColorScheme } = require('react-native');
    useColorScheme.mockReturnValue('light');

    const { getByTestId, rerender } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId('is-dark').textContent).toBe('false');
    expect(getByTestId('theme-background').textContent).toBe(lightTheme.colors.background);

    // Change system theme
    useColorScheme.mockReturnValue('dark');

    act(() => {
      rerender(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
    });

    expect(getByTestId('is-dark').textContent).toBe('true');
    expect(getByTestId('theme-background').textContent).toBe(darkTheme.colors.background);
  });
}); 