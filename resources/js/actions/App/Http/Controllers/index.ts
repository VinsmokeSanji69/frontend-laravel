import API from './API'
import ExamController from './ExamController'
import UserController from './UserController'
import QuestionController from './QuestionController'
import PublishController from './PublishController'
const Controllers = {
    API: Object.assign(API, API),
ExamController: Object.assign(ExamController, ExamController),
UserController: Object.assign(UserController, UserController),
QuestionController: Object.assign(QuestionController, QuestionController),
PublishController: Object.assign(PublishController, PublishController),
}

export default Controllers