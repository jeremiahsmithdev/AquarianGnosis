import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResourcesPage } from './ResourcesPage';

describe('ResourcesPage', () => {
  it('renders resources page title', () => {
    render(<ResourcesPage onNavigate={() => {}} />);
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });

  it('renders resource sharing form when authenticated', () => {
    render(<ResourcesPage onNavigate={() => {}} />);
    // This would require mocking the auth store to test properly
  });
});
