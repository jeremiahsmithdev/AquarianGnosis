import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommunityPage } from './CommunityPage';

describe('CommunityPage', () => {
  it('renders community page title', () => {
    render(<CommunityPage onNavigate={() => {}} />);
    expect(screen.getByText('Community')).toBeInTheDocument();
  });

  it('renders forum and study groups tabs', () => {
    render(<CommunityPage onNavigate={() => {}} />);
    expect(screen.getByText('Forum')).toBeInTheDocument();
    expect(screen.getByText('Study Groups')).toBeInTheDocument();
  });
});
