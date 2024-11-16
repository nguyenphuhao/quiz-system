# Quiz System

## Architecture
![elsa-coding-challenges drawio](https://github.com/user-attachments/assets/2fc8cead-9ed6-4786-9b4f-3953a52d95ee)

### Front End App

The front end app here is Web App that is built on top of Reactjs, especially Nextjs framework. It will integrate with Back End services via RESTful API.

### APIs

This is one of the part of Back End. the main purpose is to transmit the request from front end app to the services component It includes following APIs**

**Auth API**
- `POST /login`: Accept username and password and do authentication using JWT.
- `GET /profile`: Return authenticated user profile.

**Quizzes API**
  - `GET /quizzes`: Get all quizzes from the system
  - `GET /quizzes/:quizId`: Get quiz details by `quizId`
  - `POST /quizzes/join`: Start a new quiz session for a specific user (*Authenticated user only*)
  - `POST /quizzes/submit`: Submit answers for a active quiz session of user. (*Authenticated user only*)
  - `POST /quizzes/:quizId/result`: Get the result of the completed quiz of user. (*Authenticated user only*)

**Leaderboard API**
  - `GET /leaderboard/:quizId`: Get the ranking for all users who finished a specific quiz (*Authenticated user only*)

### Services

The main business logics and data accesses are defined in this group. This layer will work directly with Database through ORM.

**Quizzes Service**:
- Get all quizzes
- Get quiz by quizId
- Create a new quiz session of a specific user
- Submit all answers for a quiz of a specific user
- Scroring
- Return the quiz result of a specific user on a specific quiz

**Leaderboard Service**: 
- get ranking data of all users in a specific quiz

### Message Queues
- The message queue here is for the long-running process, especially Ranking service, to calculate data for leaderboard.
  
### Data Storage
There are 2 database are used
- Postgre: For quiz and users store
- Redis: For leaderboard caching and message queues

## Dataflow
![image](https://github.com/user-attachments/assets/7549e265-0f92-4436-9ed7-a652ffcc028d)

### Techstack
![image](https://github.com/user-attachments/assets/bb6004b1-3cc8-4b62-a4df-0a94a48bd4a7)
![image](https://github.com/user-attachments/assets/d7132e17-69e9-4fee-bea1-1d7f60356cc4)
![image](https://github.com/user-attachments/assets/d8f02c39-ad00-4b92-b30e-f190e2b0de92)
![image](https://github.com/user-attachments/assets/0da08b81-ed15-4548-a87d-116713f69003)
![image](https://github.com/user-attachments/assets/45a85f7c-a7e9-433f-8d64-fdc9c0533923)
![image](https://github.com/user-attachments/assets/69ef0944-9047-4961-8deb-d77f735f0bf7)
![image](https://github.com/user-attachments/assets/3f52beb9-1a45-41da-a2aa-dca4b5974beb)
![image](https://github.com/user-attachments/assets/2cc54de6-3639-46be-9e41-522453782840)






