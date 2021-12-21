import express, { Request, Response } from 'express';
import userDoc from '../models/user';
import { body } from 'express-validator';
import { validateRequest, validateHeader, BadRequestError } from '@ta-vrilance/common';
// import multer from 'multer';
import jwt from 'jsonwebtoken';

const router = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({ dest: 'src/uploads/', storage: storage});

interface JwtPayload {
    id: string;
}

router.post('/api/auth/completedata', 
validateHeader,
// upload.single('profile'),
body('bio').notEmpty(),
body('address').notEmpty(),
body('phone').isNumeric().isLength({min: 10, max: 15}).withMessage('Please Enter a Valid Phone Number'),
body('profile').notEmpty(),
// body('profile').custom((val, {req}) => {
//     if(req.file.mimetype === 'image/jpeg'){
//         return '.jpeg'; // return "non-falsy" value to indicate valid data"
//     }else if(req.file.mimetype === 'image/png'){
//         return '.png'; // return "non-falsy" value to indicate valid data"
//     }else if(req.file.mimetype === 'image/bmp'){
//         return '.bmp'; // return "non-falsy" value to indicate valid data"
//     }else if(req.file.mimetype === 'image/tiff'){
//         return '.tiff'; // return "non-falsy" value to indicate valid data"
//     }else{
//         return false; // return "falsy" value to indicate invalid data
//     }
// }).withMessage('Please Enter a Valid Profile'),
validateRequest,
async (req: Request, res: Response) => {
    const { bio, address, phone, profile } = req.body;
    try{
        const data = jwt.verify(req.header('x-auth-token')!, process.env.JWT_KEY!) as JwtPayload;
        const response = await userDoc.updateUser(data.id, {
            bio, address, phone, profile
        });

        return res.send(response);
    }catch(ex){
        return new BadRequestError('Invalid Auth Token');
    }
});

export { router as completeDataRouter };