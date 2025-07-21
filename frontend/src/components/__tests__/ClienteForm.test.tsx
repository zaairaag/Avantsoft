import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import ClienteForm from '../ClienteForm';

const theme = createTheme();

const renderWithTheme = (component: React.ReactNode) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ClienteForm Component', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    open: true,
    onSave: mockOnSave,
    onClose: mockOnClose,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form dialog when open', () => {
    renderWithTheme(<ClienteForm {...defaultProps} />);

    // Just check that the dialog is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    renderWithTheme(<ClienteForm {...defaultProps} open={false} />);

    // Dialog should not be visible when closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});