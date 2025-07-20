import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test component
const TestComponent: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>This is a test component</p>
      <button>Click me</button>
    </div>
  );
};

describe('Simple Component Test', () => {
  it('should render component with title', () => {
    render(<TestComponent title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test component')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should render heading with correct role', () => {
    render(<TestComponent title="My Heading" />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('My Heading');
  });

  it('should render button', () => {
    render(<TestComponent title="Test" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });
});
