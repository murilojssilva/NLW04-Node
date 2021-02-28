import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveyUser } from '../models/SurveyUser';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

export class AnswerController {
	async execute(request: Request, response: Response<SurveyUser>): Promise<Response<SurveyUser>> {
		const { surveyUserId } = request.params;
		const { value } = request.query;

		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

		const surveyUser = await surveysUsersRepository.findOne({
			id: surveyUserId,
		})

		if (!surveyUser) {
			throw new AppError('Survey User does not exist!');
		}

		surveyUser.value = Number(value);

		await surveysUsersRepository.save(surveyUser);

		return response.json(surveyUser);
	}
}