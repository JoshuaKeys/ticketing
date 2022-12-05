import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { asyncHandler } from "@giantsofttickets/common";
import { User } from "../models/user";
import { ErrorResponse } from "@giantsofttickets/common";


/**
 * 
 * @param req - request
 * @param res - response
 * @param next - next function
 */
const getCurrentUser = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    res.json({currentUser: req.currentUser || null})
})


const signIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password} = req.body;
    if(!email || !password) {
        return next(new ErrorResponse('Email and password is required', 400));
    }
    const existingUser = await User.findOne({email});
    if(!existingUser) {
        return next(new ErrorResponse('Invalid credentials', 400));
    }
    console.log(email, password);
    const passwordsMatch = existingUser.matchPassword(password);
    if(!passwordsMatch) {
        return next(new ErrorResponse('Invalid credentials', 400));
    }
        // Generae JWT
        const userJWT = sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!);
    
        req.session = {
            jwt: userJWT
        }
        
        delete existingUser.password
        // Store it on session object
        res.send({
            success: true,
            user: existingUser
        })
})


const signOut = (req: Request, res: Response, next: NextFunction) => {
    req.session = null;
    res.send({})
}


/**
 * @param req request
 * @param res response
 * @param next next function
 * 
 * Registers the User
 * Required data: { email: string, password: string }
 */
const signUp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = User.build({
        email,
        password
    });

    await user.save();

    // Generae JWT
    const userJWT = sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJWT
    }

    // Store it on session object
    res.send({
        success: true,
        user
    })
})

export { getCurrentUser, signIn, signOut, signUp }