import { EntityRepository, Repository } from "typeorm"
import { SurveyUser } from "../models/SurveyUser"

@EntityRepository(SurveyUser)
class SurveysUsersRepository extends Repository<Survey> {

}

export { SurveysUsersRepository }