import { handler } from '../netlify/functions/health.js';

describe('health function', () => {
  it('returns service up', async () => {
    const response = await handler();
    expect(response.statusCode).toBe(200);
  });
});
