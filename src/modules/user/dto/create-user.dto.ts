import {type UserType} from '../../../types/entities.js';

export class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatarPath?: string;
  public password!: string;
  public userType!: UserType;
}
