import { render, screen, waitFor } from './utils/testUtils';
import CaseDetail from '../components/CaseDetail'; // Adjust path

describe('Case Detail', () => {
  it('renders all panels', async () => {
    render(<CaseDetail />);
    await waitFor(() => expect(screen.getByText('Workflow')).toBeInTheDocument());
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Audit')).toBeInTheDocument();
  });
});