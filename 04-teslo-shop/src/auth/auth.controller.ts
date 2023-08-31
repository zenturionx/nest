import {Controller, Get, Post, Body, UseGuards, Headers, SetMetadata} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto, LoginUserDto} from "./dto";
import {AuthGuard} from "@nestjs/passport";
import {User} from "./entities/user.entity";
import {RawHeaders, GetUser} from "./decorators";
import {IncomingHttpHeaders} from "http";
import {UserRoleGuard} from "./guards/user-role/user-role.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    create(@Body() createUserDto: CreateUserDto) {
        return this.authService.create(createUserDto);
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Get('private')
    @UseGuards(AuthGuard())
    TestingPrivateRoute(
        //@Req() req: Express.Request
        @GetUser() user: User,
        @GetUser('email') userEmail: string,
        @RawHeaders() headers: string[],
        @Headers() headers2: IncomingHttpHeaders
    ) {
        //console.log({user: req.user});
        //console.log({user});
        return {
            ok: true,
            message: 'This is a private route',
            user,
            userEmail,
            headers,
            headers2
        }
    }

    @Get('private2')
    @SetMetadata('roles', ['admin', 'super-user'])
    @UseGuards(AuthGuard(), UserRoleGuard)
    privateRoute2(
        @GetUser() user: User
    ) {
        return {
            ok: true,
            user
        }

    }

}
