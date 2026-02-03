import 'cross-fetch/polyfill';

import '@testing-library/jest-dom';
import { server } from './utils/mswHandlers';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after all tests are done.
afterAll(() => server.close());

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());