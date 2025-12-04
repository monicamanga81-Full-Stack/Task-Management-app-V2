import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        message: string;
        access_token: string;
    }>;
    register(body: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
}
