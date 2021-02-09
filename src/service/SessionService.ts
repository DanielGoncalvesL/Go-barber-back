import { getRepository } from 'typeorm';

import { compare } from 'bcryptjs';

import User from '../models/User';

import {sign, verify} from 'jsonwebtoken';

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

        const token = sign({}, '72603804c59a47b448094f427c489616',{
            subject: user.id,
            expiresIn: '1d',
        });

        return {
            user,
            token
        };
    }
}

export default SessionService;