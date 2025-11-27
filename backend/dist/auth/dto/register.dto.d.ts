export declare class RegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    role: import("src/auth/entities/user.entity").UserRole;
}
