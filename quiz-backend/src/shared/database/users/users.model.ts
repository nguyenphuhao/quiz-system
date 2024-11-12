import { Table, Column, Model, DataType, NotNull, IsEmail, AllowNull, Default } from 'sequelize-typescript';

@Table
export class Users extends Model {

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Column
  username: string;

  @Default(true)
  @Column
  active: boolean;
}
