const express = require('express');
const app = express();
const PORT = 3000

const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');

const connect = require('./schemas');
connect();

app.use(express.json());

app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.listen(PORT, () => {
  console.log(PORT, ' 포트로 서버 실행');
})