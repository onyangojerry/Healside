import { render, screen, fireEvent, waitFor } from './utils/testUtils';
import { rest } from 'msw';
import { server } from './utils/mswHandlers';
import LoginForm from '../pages/login'; // Adjust path as needed

describe('Login', () => {
  it('successful login redirects to cases', async () => {
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'test' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'test' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => expect(window.location.href).toBe('/cases'));
  });

  it('failed login shows error', async () => {
    server.use(
      rest.post('http://localhost:8000/v1/auth/login', (req, res, ctx) => res(ctx.status(401), ctx.json({ error: { message: 'Invalid credentials' } }))),
    );
    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument());
  });
});