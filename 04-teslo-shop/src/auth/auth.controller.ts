import {Controller, Get, Post, Body, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto, LoginUserDto} from "./dto";
import {AuthGuard} from "@nestjs/passport";
import {GetUser} from "./decorators/get-user.decorator";
import {User} from "./entities/user.entity";

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
        @GetUser() user: User
    ) {
        //console.log({user: req.user});
        //console.log({user});
        return {
            ok: true,
            message: 'This is a private route',
            user: user
        }
    }

}
