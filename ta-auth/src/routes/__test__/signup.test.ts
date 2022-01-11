import request from 'supertest';
import { app } from '../../app';

// it('returns a 201 on successfull signup', async () => {
//     return request(app)
//         .post('/api/auth/signup')
//         .send({
//             "username": "dominator",
//             "email": "dominatorranger@gmail.com",
//             "firstname": "Dominator",
//             "lastname": "Ranger",
//             "password": "123456789",
//             "password_confirmation" : "123456789"
//         })
//         .expect(201);
// });