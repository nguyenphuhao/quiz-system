import { Table, Column, Model, DataType, NotNull, IsEmail, AllowNull, Default, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { Quizzes } from '../quizzes/quizzes.model';
import { QuizzesQuestions } from '../quizzesQuestions/quizzesQuestions.model';

@Table
export class SingleChoiceQuestions extends Model {
  @AllowNull(false)
  @Column
  question: string;
  @Column(DataType.ARRAY(DataType.STRING))
  choices: string[];
  @Column
  correctAnswer: string;

  @BelongsToMany(() => Quizzes, () => QuizzesQuestions)
  quizzes: Quizzes[];

  @Default(true)
  @Column
  active: boolean;
}
