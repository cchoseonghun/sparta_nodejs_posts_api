const express = require('express');
const router = express.Router();

const Post = require('../schemas/post');

router.get('/', (req, res) => {
  res.send('hi');
})

router.post('/', async (req, res) => {
  const {user, password, title, content} = req.body;

  // DB 통신 전 1차 처리
  if (user.length == 0 || password.length == 0 || title.length == 0) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }

  try {
    await Post.create({ user, password, title, content });
    return res.status(200).json({ message: '게시글을 생성하였습니다.' });
  } catch {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

module.exports = router;