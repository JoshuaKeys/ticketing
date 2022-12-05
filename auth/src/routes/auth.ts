import express from 'express';
import { getCurrentUser, signIn, signOut, signUp } from '../controllers/auth';
import { currentUser } from '@giantsofttickets/common';
import { requireAuth } from '@giantsofttickets/common';

const router = express.Router();

router.route('/currentuser').get(currentUser, requireAuth, getCurrentUser);
router.route('/signin').post(signIn);
router.route('/signup').post(signUp);
router.route('/signout').post(signOut);


export  {router as authRouter}