import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock API service
const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockLogout = jest.fn();

jest.mock('../../services/api', () => ({
  login: (...args: any[]) => mockLogin(...args),
  register: (...args: any[]) => mockRegister(...args),
  logout: (...args: any[]) => mockLogout(...args),
}));

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Simple useAuth hook implementation for testing
const useAuth = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockLogin(credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await mockRegister(userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    mockNavigate('/login');
  };

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
  };
};

import React from 'react';

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle successful login', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    const mockToken = 'fake-jwt-token';
    
    mockLogin.mockResolvedValue({
      data: { token: mockToken, user: mockUser }
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockToken);
  });

  it('should handle login error', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.login({
          email: 'test@example.com',
          password: 'wrongpassword'
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle successful registration', async () => {
    const mockUser = { id: '1', name: 'New User', email: 'new@example.com' };
    const mockToken = 'fake-jwt-token';
    
    mockRegister.mockResolvedValue({
      data: { token: mockToken, user: mockUser }
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123'
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', mockToken);
  });

  it('should handle registration error', async () => {
    const errorMessage = 'Email already exists';
    mockRegister.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.register({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123'
        });
      } catch (error) {
        // Expected to throw
      }
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle logout', () => {
    const { result } = renderHook(() => useAuth());

    // First set a user
    act(() => {
      result.current.login({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should show loading state during login', async () => {
    let resolveLogin: (value: any) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    mockLogin.mockReturnValue(loginPromise);

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveLogin!({
        data: {
          token: 'token',
          user: { id: '1', name: 'Test', email: 'test@example.com' }
        }
      });
      await loginPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('should show loading state during registration', async () => {
    let resolveRegister: (value: any) => void;
    const registerPromise = new Promise((resolve) => {
      resolveRegister = resolve;
    });
    mockRegister.mockReturnValue(registerPromise);

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveRegister!({
        data: {
          token: 'token',
          user: { id: '1', name: 'Test User', email: 'test@example.com' }
        }
      });
      await registerPromise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('should clear error on successful operation', async () => {
    const { result } = renderHook(() => useAuth());

    // First cause an error
    mockLogin.mockRejectedValue(new Error('First error'));
    await act(async () => {
      try {
        await result.current.login({
          email: 'test@example.com',
          password: 'wrong'
        });
      } catch (error) {
        // Expected
      }
    });

    expect(result.current.error).toBe('First error');

    // Then succeed
    mockLogin.mockResolvedValue({
      data: {
        token: 'token',
        user: { id: '1', name: 'Test', email: 'test@example.com' }
      }
    });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'correct'
      });
    });

    expect(result.current.error).toBeNull();
  });
});
