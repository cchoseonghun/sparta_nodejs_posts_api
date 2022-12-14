const express = require('express');
const router = express.Router();

const Comment = require('../schemas/comment');
const Post = require('../schemas/post');

router.get('/:_postId', async (req, res) => {
  try {
    const {_postId} = req.params;
  
    const comments = await Comment.find({ postId: _postId }).sort('-createdAt').exec();
  
    let new_comments = comments.map((comment) => {
      let new_comment = {};
      new_comment.commentId = comment._id;
      new_comment.user = comment.user;
      new_comment.content = comment.content;
      new_comment.createdAt = comment.createdAt;
      return new_comment;
    })
  
    return res.status(200).json({ data: new_comments });
  } catch (err) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

router.post('/:_postId', async (req, res) => {
  try {
    const {_postId} = req.params;
    const {user, password, content} = req.body;

    if (content.length == 0) {
      return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
    }

    const post = await Post.findOne({_id: _postId}).exec();  // 해당 게시글 확인
    if (!post) {
      return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
    } else {
      await Comment.create({ postId: _postId, user, password, content });
      return res.status(201).json({ message: '댓글을 생성하였습니다.' });
    }
  } catch (err) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

module.exports = router;