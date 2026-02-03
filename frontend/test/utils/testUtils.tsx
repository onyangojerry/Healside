import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    query: { id: 'case-1' },
    push: jest.fn(),
    pathname: '/cases/[id]',
  }),
}));

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '/',
    pathname: '/',
  },
  writable: true,
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };