const express = require('express');
const router = express.Router();

const Post = require('../schemas/post');

router.get('/', async (req, res) => {
  const posts = await Post.find({});
  let new_posts = posts.map((post) => {
    let temp = {};
    temp.postId = post._id;
    temp.user = post.user;
    temp.title = post.title;
    temp.createdAt = post.createdAt;
    return temp;
  })

  return res.status(200).json({ data: new_posts });
})

router.get('/:_postId', async (req, res) => {
  const {_postId} = req.params;

  const post = await Post.find({_id: _postId});
  const [new_post] = post.map((post) => {
    let temp = {};
    temp.postId = post._id;
    temp.user = post.user;
    temp.title = post.title;
    temp.content = post.content;
    temp.createdAt = post.createdAt;
    return temp;
  })

  return res.status(200).json({ data: new_post });
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