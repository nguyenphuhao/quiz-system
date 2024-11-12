import { Table, Column, Model, DataType, NotNull, IsEmail, AllowNull, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Quizzes } from '../quizzes/quizzes.model';
import { SingleChoiceQuestions } from '../singleChoiceQuestions/singleChoiceQuestions.model';

@Table
export class QuizzesQuestions extends Model {
  @ForeignKey(() => Quizzes)
  @Column
  quizId: number;

  @ForeignKey(() => SingleChoiceQuestions)
  @Column
  questionId: number;

  @Default(true)
  @Column
  active: boolean;
}
