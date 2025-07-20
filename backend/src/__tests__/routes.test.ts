import request from 'supertest';
import { app } from '../app';

describe('Routes Check', () => {
  it('deve verificar se as rotas de auth existem', async () => {
    // Testar se a rota existe (mesmo que retorne erro de validação)
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({});
    
    console.log('Register route status:', registerResponse.status);
    
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({});
    
    console.log('Login route status:', loginResponse.status);
    
    // Se retornar 404, a rota não existe
    // Se retornar 400/422, a rota existe mas dados inválidos
    expect(registerResponse.status).not.toBe(404);
    expect(loginResponse.status).not.toBe(404);
  });
});