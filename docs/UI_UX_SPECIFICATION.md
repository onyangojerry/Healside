# UI/UX Specification

## Case Inbox Screens

- **Layout**: Table with columns: Patient ID (masked), Status, Created Date, Assignee, Actions
- **Filters**: By status, date range, role
- **Badges**: Color-coded status (e.g., red for HUMAN_REVIEW)
- **Audit View**: Click to see history

## Review Experience

- **Side-by-Side View**: Left: Source citations; Right: Generated draft
- **Highlighting**: Citations linked to sources
- **Actions**: Approve, Reject with reason, Edit draft
- **Required Checks**: Checkboxes for "Citations verified", "No medical advice", "Reading level appropriate"

## Approval Actions

- **Communications**: Preview SMS/email; approve send
- **Scheduling**: Confirm booking or approve request
- **Summaries**: Approve or request changes

## Accessibility Details

- ARIA labels, alt text for images
- Keyboard shortcuts: Tab navigation, Enter to approve

## Patient Outreach Drafts

- **Templates**: Configurable; show reading level score
- **Language Support**: Multi-language options
- **Preview**: As patient would see