import { Table, Column, Model, DataType, AllowNull, Default, HasMany, BelongsToMany } from 'sequelize-typescript';
import { SingleChoiceQuestions } from '../singleChoiceQuestions/singleChoiceQuestions.model';
import { QuizzesQuestions } from '../quizzesQuestions/quizzesQuestions.model';
import { QuizzesSessions } from '../quizzesSessions/quizzesSessions.model';

@Table
export class Quizzes extends Model {
  @AllowNull(false)
  @Column
  title: string;

  @BelongsToMany(() => SingleChoiceQuestions, () => QuizzesQuestions)
  singleChoiceQuestions: SingleChoiceQuestions[];

  @HasMany(() => QuizzesSessions)
  participants: QuizzesSessions[]

  @Default(true)
  @Column(DataType.BOOLEAN)
  active: boolean;
}
