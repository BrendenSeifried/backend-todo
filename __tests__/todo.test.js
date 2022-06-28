const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('todo test suite', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('Test to create new todo', async () => {
    const [agent, user] = await LoggedIn();
    const item = { name: 'Get milk' };
    const data = await agent.post('/api/v1/todos').send(item);
    expect(data.status).toEqual(200);
    expect(data.body).toEqual({
      id: expect.any(String),
      name: 'Get milk',
      completed: false,
      user_id: expect.any(Number),
    });
  });
  afterAll(() => {
    pool.end();
  });
});
