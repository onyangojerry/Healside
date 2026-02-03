import { rest } from 'msw';
import { setupServer } from 'msw/node';
import casesFixture from '../fixtures/cases.json';
import caseDetailFixture from '../fixtures/caseDetail.json';
import auditFixture from '../fixtures/audit.json';
import userFixture from '../fixtures/user.json';
import approveResponseFixture from '../fixtures/approveResponse.json';

export const server = setupServer(
  rest.get('http://localhost:8000/v1/cases', (req, res, ctx) => {
    return res(ctx.json(casesFixture));
  }),
  rest.get('http://localhost:8000/v1/cases/:id', (req, res, ctx) => {
    return res(ctx.json(caseDetailFixture));
  }),
  rest.get('http://localhost:8000/v1/cases/:id/audit', (req, res, ctx) => {
    return res(ctx.json(auditFixture));
  }),
  rest.get('http://localhost:8000/v1/auth/me', (req, res, ctx) => {
    return res(ctx.json(userFixture));
  }),
  rest.post('http://localhost:8000/v1/cases/:id/approve', (req, res, ctx) => {
    return res(ctx.json(approveResponseFixture));
  }),
  rest.post('http://localhost:8000/v1/auth/login', (req, res, ctx) => {
    return res(ctx.json({ access_token: 'fake-token' }));
  }),
);