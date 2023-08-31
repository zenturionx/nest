import {BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import {CreateUserDto, LoginUserDto} from "./dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import * as bcrypt from 'bcrypt';
import {JwtPayload} from "./interfaces/jwt-payload.interface";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly jwtService: JwtService
    ) {
    }

    async create(createUserDto: CreateUserDto) {
        try {
            const {password, ...userData} = createUserDto;
            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10)
            });

            await this.userRepository.save(user);

            delete user.password;

            return {
                ...user,
                token: this.getJwtToken({email: user.email})
            };
        } catch (error) {
            this.handleError(error);
        }
    }

    async login(loginUserDto: LoginUserDto) {
        const {password, email} = loginUserDto;
        const user = await this.userRepository.findOne({
            where: {email},
            select: {email: true, password: true}
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if(!bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return {
            ...user,
            token: this.getJwtToken({email: user.email})
        };
    }

    private getJwtToken(payload: JwtPayload) {
        const token = this.jwtService.sign(payload);
        return token;
    }

    private handleError(error: any): never {
        if (error.code === '23505') {
            throw new BadRequestException('User already exists');
        }

        console.log(error);

        throw new InternalServerErrorException('Something went wrong');
    }

}
