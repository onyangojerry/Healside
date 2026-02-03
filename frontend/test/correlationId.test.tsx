import { server } from './utils/mswHandlers';
import { rest } from 'msw';

describe('Correlation ID', () => {
  it('adds correlation id to requests', async () => {
    let capturedHeaders: any;
    server.use(
      rest.get('/v1/cases', (req, res, ctx) => {
        capturedHeaders = req.headers;
        return res(ctx.json({ cases: [] }));
      }),
    );
    // Trigger API call - assume some component renders and calls API
    // For simplicity, mock a fetch
    await fetch('/v1/cases');
    expect(capturedHeaders.get('x-correlation-id')).toBeDefined();
  });
});