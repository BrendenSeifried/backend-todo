const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserServices');
const Todo = require('../lib/models/Todo');

const testUser = {
  email: 'test@example.com',
  password: '12345678',
};

const secondtestUser = {
  email: 'testtwo@example.com',
  password: '12345678',
};

const LoggedIn = async (props = {}) => {
  const password = props.password ?? testUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...testUser, ...props });
  const { email } = user;

  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('todo test suite', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('Test to create new todo', async () => {
    const [agent] = await LoggedIn();
    const item = { name: 'Get milk' };
    const data = await agent.post('/api/v1/todos/').send(item);
    expect(data.status).toEqual(200);
    expect(data.body).toEqual({
      id: expect.any(String),
      name: 'Get milk',
      user_id: expect.any(Number),
    });
  });

  it('Test to render list of todos for logged in user', async () => {
    const [agent, user] = await LoggedIn();
    const testingClient = await UserService.create(secondtestUser);
    const testData = await Todo.insert({
      name: 'Water the cat',
      user_id: user.id,
      completed: true,
    });
    await Todo.insert({
      name: 'Eat the right amount',
      user_id: testingClient.id,
      completed: false,
    });
    const data = await agent.get('/api/v1/todos');
    expect(data.status).toEqual(200);
    expect(data.body).toEqual([testData]);
  });

  it('Test to update todo associated with authenticated user', async () => {
    const [agent, user] = await LoggedIn();
    const data = await Todo.insert({
      name: 'Save the world',
      user_id: user.id,
    });
    const resp = await agent
      .put(`/api/v1/todos${data.id}`)
      .send({ name: 'Whoops :(' });
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({ ...data, name: 'Whoops :(' });
  });
  afterAll(() => {
    pool.end();
  });
});
