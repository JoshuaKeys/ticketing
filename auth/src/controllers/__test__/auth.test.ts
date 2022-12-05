import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  process.env.JWT_KEY = 'asdfasdf';
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'joshua.oguma@outlook.com',
      password: '123432123'
    })
    .expect(201);
});