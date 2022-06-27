const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const testUser = {
  email: 'test@example.com',
  password: '1234567',
};

describe('User auth tests', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('Test that new user is made', async () => {
    const resp = await (
      await request(app).post('/api/v1/users')
    ).setEncoding(testUser);
    const { email } = testUser;
    expect(resp.body).toEqual({ id: expect.any(String), email });
  });
  afterAll(() => {
    pool.end();
  });
});
