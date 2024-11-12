import { Body, Controller, Get, HttpCode, Param, Post, Res } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { UserQuizSessionKey, UserQuizSessionSubmission } from './quizzes.interface';
@Controller('quizzes')
export class QuizzesController {

  constructor(
    private readonly quizzesService: QuizzesService
  ) { }

  @Get()
  getQuizzes() {
    //Load from DB
    return this.quizzesService.getAllQuizzes();
  }

  @Post('/join')
  @HttpCode(200)
  async joinQuiz(@Body() payload: UserQuizSessionKey & { nickName: string }) {
    const result = await this.quizzesService.joinQuiz(payload);
    return {
      message: 'You have joined quiz successfully',
      data: result
    }
  }

  @Get('/:quizId')
  getQuizById(
    @Param('quizId') quizId: number
  ) {
    //Load from DB
    console.log(quizId)
    return this.quizzesService.getQuizById(quizId);
  }

  @Post('/submit')
  async submit(@Body() payload: UserQuizSessionSubmission) {
    const scoreData = await this.quizzesService.scoring(payload);
    return {
      message: 'Congratulations, you have finished you quiz',
      data: scoreData
    }
  }

  @Post('/:quizId/result')
  async result(@Body() body: UserQuizSessionKey) {
    return this.quizzesService.getQuizResult(body)
  }
}