import { getRepository } from 'typeorm';

import { compare } from 'bcryptjs';

import User from '../models/User';

import {sign, verify} from 'jsonwebtoken';

import authConfig from '../config/auth';

interface Request{
    email: string,
    password: string,
}

class SessionService{
    public async execute({email, password}: Request): Promise<{user: User, token: string}>{
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({
            where: {email}
        });

        if(!user){
            throw new Error('Incorrect email/password combination');
        }

        const passwordMatched = await compare(password, user.password);

        if(!passwordMatched){
            throw new Error('Incorrect email/password combination');
        }

        const { secret, expiresIn } = authConfig.jwt; 

        const token = sign({}, secret,{
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token
        };
    }
}

export default SessionService;