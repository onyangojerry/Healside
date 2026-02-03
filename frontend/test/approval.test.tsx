import { render, screen, fireEvent, waitFor } from './utils/testUtils';
import ApprovalControls from '../components/ApprovalControls'; // Adjust path

describe('Approval Flow', () => {
  it('approve updates UI', async () => {
    const mockOnApprove = jest.fn();
    render(<ApprovalControls caseId="case-1" onApprove={mockOnApprove} />);
    fireEvent.click(screen.getByRole('button', { name: /approve/i }));
    await waitFor(() => expect(mockOnApprove).toHaveBeenCalled());
  });
});