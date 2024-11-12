import { Table, Column, Model, DataType, NotNull, IsEmail, AllowNull, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Quizzes } from '../quizzes/quizzes.model';

@Table
export class QuizzesSessions extends Model {
  @ForeignKey(() => Quizzes)
  @Column
  quizId: number;

  @BelongsTo(() => Quizzes)
  quiz: Quizzes;

  @Column
  userId: number;

  @Column
  nickName: string;

  @Column
  totalCorrectAnswers: number;

  @Column
  totalQuestions: number;

  @Column
  status: string;

  @Default(true)
  @Column
  active: boolean;
}
