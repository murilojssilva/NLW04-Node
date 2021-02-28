import { Request, Response } from 'express';
import { getCustomRepository, IsNull, Not } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

interface Nps {
	detractors: number;
	promoters: number;
	passives: number;
	totalAnwers: number;
	nps: string;
}

export class NpsController {
	async execute(request: Request, response: Response<Nps>): Promise<Response<Nps>> {
		const { surveyId } = request.params;

		const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

		const surveysUsers = await surveysUsersRepository.find({
			survey_id: surveyId,
			value: Not(IsNull()),
		});

		const detractors = surveysUsers
			.filter(survey => (survey.value >= 0 && survey.value <= 6))
			.length;
		const passives = surveysUsers
			.filter(survey => (survey.value >= 7 && survey.value <= 8))
			.length;
		const promoters = surveysUsers
			.filter(survey => (survey.value >= 9 && survey.value <= 10))
			.length;
		const totalAnwers = surveysUsers.length;

		const calculate = (((promoters - detractors) / totalAnwers) * 100).toFixed(2);

		return response.json({
			detractors,
			promoters,
			passives,
			totalAnwers,
			nps: calculate,
		});
	}
}