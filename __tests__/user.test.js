const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserServices');

const testUser = {
  email: 'test@example.com',
  password: '12345678',
};

const Loggedin = async (props = {}) => {
  const password = props.password ?? testUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...testUser, ...props });
  const { email } = user;

  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('User auth tests', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('Test that new user is made', async () => {
    const resp = await request(app).post('/api/v1/users').send(testUser);
    const { email } = testUser;
    expect(resp.body).toEqual({ id: expect.any(String), email });
  });

  it('confirm the current user exists', async () => {
    const [agent, user] = await Loggedin();
    const person = await agent.get('/api/v1/users/person');
    expect(person.body).toEqual({
      ...user,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
  afterAll(() => {
    pool.end();
  });
});
