const express = require('express');
const router = express.Router();

const Post = require('../schemas/post');

router.get('/', async (req, res) => {
  const posts = await Post.find().sort('-createdAt').exec();
  let new_posts = posts.map((post) => {
    let new_post = {};
    new_post.postId = post._id;
    new_post.user = post.user;
    new_post.title = post.title;
    new_post.createdAt = post.createdAt;
    return new_post;
  })

  return res.status(200).json({ data: new_posts });
})

router.get('/:_postId', async (req, res) => {
  const {_postId} = req.params;

  const post = await Post.findOne({_id: _postId}).exec();

  let new_post = {};
  new_post.postId = post._id;
  new_post.user = post.user;
  new_post.title = post.title;
  new_post.content = post.content;
  new_post.createdAt = post.createdAt;

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
    return res.status(201).json({ message: '게시글을 생성하였습니다.' });
  } catch {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

router.put('/:_postId', async (req, res) => {
  const {_postId} = req.params;
  const {password, title, content} = req.body;

  try {
    const post = await Post.findOne({_id: _postId}).exec();  // 해당 게시글 확인
    if (!post) {
      return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    } else {
      if (password !== post.password) {  // 비밀번호 체크
        return res.status(401).json({ message: '게시글 수정 권한이 없습니다.' });
      } else {
        await Post.updateOne(
          {_id: _postId}, 
          {$set: {title: title, content: content}}
        )
        return res.status(200).json({ message: '게시글을 수정하였습니다.' });
      }
    }
  } catch (err) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

router.delete('/:_postId', async (req, res) => {
  const {_postId} = req.params;
  const {password} = req.body;

  try {
    const post = await Post.findOne({_id: _postId}).exec();  // 해당 게시글 확인
    if (!post) {
      return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    } else {
      if (password !== post.password) {  // 비밀번호 체크
        return res.status(401).json({ message: '게시글 삭제 권한이 없습니다.' });
      } else {
        await Post.deleteOne({_id: _postId});
        return res.status(200).json({ message: '게시글을 삭제하였습니다.' });
      }
    }
  } catch (err) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

module.exports = router;