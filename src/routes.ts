
import { Router } from "express";
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';
import { SendMailController } from "./controllers/SendMailController";
import { SurveysController } from "./controllers/SurveysController";
import { UserController } from "./controllers/UserController";

const router = Router();

const userController = new UserController();
const surveysController = new SurveysController();
const sendMailController = new SendMailController();
const npsController = new NpsController();
const answerController = new AnswerController();


router.post("/users", userController.create)

router.post("/surveys", surveysController.create)
router.get("/surveys", surveysController.show)

router.get('/answers/:surveyUserId', answerController.execute);

router.get('/nps/:surveyId', npsController.execute);

router.post("/sendMail", sendMailController.execute)

export { router };
