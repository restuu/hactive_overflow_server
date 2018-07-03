# Hactiv Overflow Server

## Usage

`http://api-overflow.restuutomo.me/`

End Point  |  METHOD  |  Desc  |  Req
-----------|----------|--------|-------
users/register  |  POST  |  Create new user  |  **body**: fullname, email, password
users/login  |  POST  |  Will receive token  |  **body**: email, password
questions  |  GET  | Get all question  | --
questions/:qusId  |  GET  |  Get question by Id  |  **params**: qusId
questions/add  |  POST  |  Create new question  |  **body**: title, content, tags; **headers**: authorization (token)
questions/:qusId/vote  |  PUT  |  Upvote / downvote a question  |  **query**: *q*: [ up / down ], **headers**: authorization (token)
questions/:qusId/edit  |  GET  |  Get permission status to edit post  |  **headers**: authorization (token)
questions/:qusId/edit  |  PUT  |  Edit a question  |  **body**: key: `'title'` / `'content'`, value; **headers**: authorization (token)
questions  |  DELETE  |  Delete a question  |  **query**: q= *question id*; **headers**: authorization (token)
questions/:qusId/answers/add  |  POST  |  Add an answer to a question  |  **body**: content [, title]; **headers**: authorization (token)
questions/:qusId/answers/:ansId/edit  |  PUT  |  edit an answer  |  **body**: key: `title` / `content`, value; **headers**: authorization (token)
