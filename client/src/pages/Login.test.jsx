/**
 * Login.test.jsx
 *
 * Tests for the Login page component using React Testing Library.
 * Philosophy: tests mirror real user behaviour — we query by role, label,
 * and visible text rather than internal state or CSS class names.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

// ─── Mocks ──────────────────────────────────────────────────────────────────

// Jest hoists jest.mock() calls before imports, so factory functions can only
// reference variables whose names start with "mock". We use stable wrapper
// objects so the factory captures the reference once and each test can swap
// the inner .fn without recreating the closure.
const mockNav  = { fn: jest.fn() };
const mockAuth = { login: jest.fn() };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => (...args) => mockNav.fn(...args),
  useLocation: () => ({ state: null }),
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login:   (...args) => mockAuth.login(...args),
    user:    null,
    loading: false,
  }),
}));

jest.mock('../services/api', () => ({
  post: jest.fn(),
}));

import api from '../services/api';

// ─── Helper ─────────────────────────────────────────────────────────────────

/** Wraps Login in MemoryRouter (required because it renders <Link>). */
const renderLogin = () => render(
  <MemoryRouter>
    <Login />
  </MemoryRouter>
);

// ─── Test Suite ─────────────────────────────────────────────────────────────

describe('Login Component', () => {

  beforeEach(() => {
    mockNav.fn    = jest.fn();
    mockAuth.login = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ── 1. Smoke test ──────────────────────────────────────────────────────────
  it('renders without crashing', () => {
    renderLogin();
    // If render() completes without throwing, the smoke test passes
  });

  // ── 2. Required elements are present ──────────────────────────────────────
  it('displays the page heading, both input fields and the submit button', () => {
    renderLogin();

    // getByRole — top-priority RTL query for semantic elements
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();

    // getByLabelText finds inputs by their associated <label> — #2 priority
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument();

    // getByRole for the submit button
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  // ── 3. Validation — empty email ────────────────────────────────────────────
  it('shows an email validation error when the form is submitted with no email', async () => {
    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  // ── 4. Validation — invalid email format ───────────────────────────────────
  it('shows a format error when an invalid email is entered', async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'not-an-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  // ── 5. Validation — empty password ────────────────────────────────────────
  it('shows a password validation error when only the email is filled', async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });


  // ── 6. No API call when validation fails ──────────────────────────────────
  it('does NOT call the API when the form is submitted with invalid data', () => {
    renderLogin();

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(api.post).not.toHaveBeenCalled();
  });

  // ── 7. Successful login flow ───────────────────────────────────────────────
  it('calls the auth login function and navigates to dashboard on success', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        user:  { id: '1', email: 'user@example.com', name: 'Test User' },
        token: 'fake-jwt-token',
      },
    });

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'secret123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockAuth.login).toHaveBeenCalledWith(
        { id: '1', email: 'user@example.com', name: 'Test User' },
        'fake-jwt-token'
      );
    });

    expect(mockNav.fn).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  // ── 8. API error is displayed ──────────────────────────────────────────────
  it('displays an API error banner when the server returns an error', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByLabelText(/email address/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i, { selector: 'input' }), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  // ── 9. Password visibility toggle ─────────────────────────────────────────
  it('toggles the password input type when the visibility button is clicked', async () => {
    const user = userEvent.setup();
    renderLogin();

    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' });
    const toggleBtn     = screen.getByRole('button', { name: /toggle password visibility/i });

    // Initially hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle → visible
    await user.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click toggle again → hidden
    await user.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // ── 10. Link to registration page ─────────────────────────────────────────
  it('renders a link to the registration page', () => {
    renderLogin();

    const signUpLink = screen.getByRole('link', { name: /sign up here/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/register');
  });

});
