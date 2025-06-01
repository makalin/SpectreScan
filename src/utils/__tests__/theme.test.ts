import { describe, it, expect } from '@jest/globals';
import { darkTheme, lightTheme, Theme } from '../theme';

describe('Theme', () => {
  describe('darkTheme', () => {
    it('should have all required color properties', () => {
      expect(darkTheme.colors).toHaveProperty('primary');
      expect(darkTheme.colors).toHaveProperty('secondary');
      expect(darkTheme.colors).toHaveProperty('background');
      expect(darkTheme.colors).toHaveProperty('surface');
      expect(darkTheme.colors).toHaveProperty('text');
      expect(darkTheme.colors).toHaveProperty('textSecondary');
      expect(darkTheme.colors).toHaveProperty('border');
      expect(darkTheme.colors).toHaveProperty('error');
      expect(darkTheme.colors).toHaveProperty('success');
      expect(darkTheme.colors).toHaveProperty('warning');
    });

    it('should have all required spacing properties', () => {
      expect(darkTheme.spacing).toHaveProperty('xs');
      expect(darkTheme.spacing).toHaveProperty('sm');
      expect(darkTheme.spacing).toHaveProperty('md');
      expect(darkTheme.spacing).toHaveProperty('lg');
      expect(darkTheme.spacing).toHaveProperty('xl');
    });

    it('should have all required border radius properties', () => {
      expect(darkTheme.borderRadius).toHaveProperty('sm');
      expect(darkTheme.borderRadius).toHaveProperty('md');
      expect(darkTheme.borderRadius).toHaveProperty('lg');
      expect(darkTheme.borderRadius).toHaveProperty('xl');
    });

    it('should have dark background colors', () => {
      expect(darkTheme.colors.background).toBe('#121212');
      expect(darkTheme.colors.surface).toBe('#1E1E1E');
      expect(darkTheme.colors.text).toBe('#FFFFFF');
    });
  });

  describe('lightTheme', () => {
    it('should have all required color properties', () => {
      expect(lightTheme.colors).toHaveProperty('primary');
      expect(lightTheme.colors).toHaveProperty('secondary');
      expect(lightTheme.colors).toHaveProperty('background');
      expect(lightTheme.colors).toHaveProperty('surface');
      expect(lightTheme.colors).toHaveProperty('text');
      expect(lightTheme.colors).toHaveProperty('textSecondary');
      expect(lightTheme.colors).toHaveProperty('border');
      expect(lightTheme.colors).toHaveProperty('error');
      expect(lightTheme.colors).toHaveProperty('success');
      expect(lightTheme.colors).toHaveProperty('warning');
    });

    it('should have all required spacing properties', () => {
      expect(lightTheme.spacing).toHaveProperty('xs');
      expect(lightTheme.spacing).toHaveProperty('sm');
      expect(lightTheme.spacing).toHaveProperty('md');
      expect(lightTheme.spacing).toHaveProperty('lg');
      expect(lightTheme.spacing).toHaveProperty('xl');
    });

    it('should have all required border radius properties', () => {
      expect(lightTheme.borderRadius).toHaveProperty('sm');
      expect(lightTheme.borderRadius).toHaveProperty('md');
      expect(lightTheme.borderRadius).toHaveProperty('lg');
      expect(lightTheme.borderRadius).toHaveProperty('xl');
    });

    it('should have light background colors', () => {
      expect(lightTheme.colors.background).toBe('#FFFFFF');
      expect(lightTheme.colors.surface).toBe('#F5F5F5');
      expect(lightTheme.colors.text).toBe('#000000');
    });
  });

  describe('Theme type', () => {
    it('should allow valid theme objects', () => {
      const validTheme: Theme = {
        colors: {
          primary: '#000000',
          secondary: '#FFFFFF',
          background: '#000000',
          surface: '#FFFFFF',
          text: '#000000',
          textSecondary: '#666666',
          border: '#E0E0E0',
          error: '#FF0000',
          success: '#00FF00',
          warning: '#FFFF00'
        },
        spacing: {
          xs: 4,
          sm: 8,
          md: 16,
          lg: 24,
          xl: 32
        },
        borderRadius: {
          sm: 4,
          md: 8,
          lg: 12,
          xl: 16
        }
      };

      expect(validTheme).toBeDefined();
    });
  });
}); 