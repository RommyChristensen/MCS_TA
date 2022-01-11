import { app } from '../app';
import request from 'supertest';

const signup = async () => {
    const username = "test";
    const email = "test@gmail.com";
    const password = "12345678";
    const password_confirmation = "123456789";

    const response = await request(app)
        .post('/api/auth/signup')
        .send({
            username, email, password, password_confirmation
        })
        .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
}