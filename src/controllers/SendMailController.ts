import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { resolve } from 'path';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService from '../services/SendMailService';
import { SurveyUser } from '../models/SurveyUser';
import { AppError } from '../errors/AppError';

export class SendMailController {
	async execute(request: Request, response: Response<SurveyUser>): Promise<Response<SurveyUser>> {
		const { email, survey_id } = request.body;

		const usersRepository = getCustomRepository(UsersRepository);
		const surveysRepository = getCustomRepository(SurveysRepository);
		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

		const user = await usersRepository.findOne({
			email
		});

		if (!user) {
			throw new AppError('User does not exists');
		}

		const survey = await surveysRepository.findOne({
			id: survey_id
		});

		if (!survey) {
			throw new AppError('Survey does not exists');
		}

		let surveyUser = await surveysUsersRepository.findOne({
			where: { user_id: user.id, survey_id: survey.id, },
			relations: ['user', 'survey'],
		});

		if (!surveyUser) {
			surveyUser = surveysUsersRepository.create({
				user_id: user.id,
				survey_id: survey_id,
			})

			await surveysUsersRepository.save(surveyUser);
		}

		const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');
		const variables = {
			name: user.name,
			title: survey.title,
			description: survey.description,
			id: surveyUser.id,
			link: process.env.URL_MAIL,
		};

		await SendMailService.execute(email, survey.title, variables, npsPath);

		return response.json(surveyUser);
	}
}