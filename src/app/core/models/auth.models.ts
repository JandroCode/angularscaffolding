export interface RegisterRequest {
  userName: string;   // ojo: enviamos userName para mapear a Identity.UserName
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  email: string;
  userName?: string;
}

export interface RegisterResponse {
  user: UserDto;
  token: string;
}
