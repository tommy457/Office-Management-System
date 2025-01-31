import { UserType } from "../utils/enums/user-role.enum";

export interface jwtTokenIdentity {
    id: string,
    name: string,
    role: UserType,
    iat: number,
    exp: number,
}