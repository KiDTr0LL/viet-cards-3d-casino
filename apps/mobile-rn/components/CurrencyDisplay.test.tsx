import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { CurrencyDisplay } from './CurrencyDisplay';
import { CurrencyProvider, useCurrency } from '../contexts/CurrencyContext';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <CurrencyProvider>{children}</CurrencyProvider>
);

describe('CurrencyDisplay', () => {
  it('should display gold and diamonds with correct formatting', () => {
    const TestComponent = () => {
      const { currency } = useCurrency();
      return <CurrencyDisplay gold={currency.gold} diamonds={currency.diamonds} />;
    };

    const { getByText } = render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Initial values from context
    expect(getByText(/🪙/)).toBeTruthy();
    expect(getByText(/💎/)).toBeTruthy();
  });

  it('should animate gold count when updated', async () => {
    let updateGold: (delta: number) => void;

    const TestComponent = () => {
      const { currency, updateGold: update } = useCurrency();
      updateGold = update;
      return <CurrencyDisplay gold={currency.gold} diamonds={currency.diamonds} />;
    };

    const { getByText } = render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Initial gold
    expect(getByText('1,000')).toBeTruthy();

    // Update gold
    await waitFor(() => {
      updateGold?.(500);
    });

    // Should show new value
    expect(getByText('1,500')).toBeTruthy();
  });

  it('should format large gold amounts (K, M)', () => {
    const TestComponent = () => (
      <CurrencyDisplay gold={1500000} diamonds={0} />
    );

    const { getByText } = render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    expect(getByText('1.5M')).toBeTruthy();
  });
});
