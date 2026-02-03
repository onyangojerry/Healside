import { render, screen, fireEvent, waitFor } from './utils/testUtils';
import CaseInbox from '../components/CaseInbox'; // Adjust path

describe('Case Inbox', () => {
  it('renders KPI and cases', async () => {
    render(<CaseInbox />);
    await waitFor(() => expect(screen.getByText(/case-1/i)).toBeInTheDocument());
    expect(screen.getByText(/total open cases/i)).toBeInTheDocument();
  });

  it('clicking case navigates', async () => {
    render(<CaseInbox />);
    await waitFor(() => expect(screen.getByText(/case-1/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/case-1/i));
    expect(window.location.href).toBe('/case/case-1');
  });
});