import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrganizationsPage } from './OrganizationsPage';

describe('OrganizationsPage', () => {
  it('renders organizations page title', () => {
    render(<OrganizationsPage onNavigate={() => {}} />);
    expect(screen.getByText('Organizations')).toBeInTheDocument();
  });

  it('renders organization tabs', () => {
    render(<OrganizationsPage onNavigate={() => {}} />);
    expect(screen.getByText('Major Organizations')).toBeInTheDocument();
    expect(screen.getByText('Local Centers')).toBeInTheDocument();
    expect(screen.getByText('Independent Groups')).toBeInTheDocument();
  });
});
