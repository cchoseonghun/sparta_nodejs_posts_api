const express = require('express');
const router = express.Router();

const Comment = require('../schemas/comment');
const Post = require('../schemas/post');

router.post('/:_postId', async (req, res) => {
  //  #swagger.description = '댓글 생성'
  //  #swagger.tags = ['comments']
  /*  #swagger.parameters[''] = {
                  in: 'body',
                  schema: {
                      user: 'Developer',
                      password: '1234',
                      content: '안녕하세요 댓글 입니다'
                  }
  } */
  /*  #swagger.responses[201] = {
              description: '댓글 작성 성공',
              schema: {
                  message: '댓글을 생성하였습니다.'
              }
  } */
    /*  #swagger.responses[400] = {
              description: 'body 또는 params를 입력받지 못한 경우',
              schema: {
                  message: '데이터 형식이 올바르지 않습니다.'
              }
  } */
  try {
    const {_postId} = req.params;
    const {user, password, content} = req.body;

    if (Object.keys(req.body).length > 0) {
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
    } else {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
  } catch (err) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

router.get('/:_postId', async (req, res) => {
  //  #swagger.description = '댓글 목록 조회'
  //  #swagger.tags = ['comments']
  /*  #swagger.responses[200] = {
            description: '댓글 목록 조회 성공',
            schema: {
                data: [
                  {
                    commentId: '639a82521099c5ef762d3698', 
                    user: 'Developer', 
                    content: '안녕하세요 댓글입니다.', 
                    createdAt: '2022-12-14T03:39:20.389Z'
                  }
                ]
            }
  } */
    /*  #swagger.responses[400] = {
              description: 'body 또는 params를 입력받지 못한 경우',
              schema: {
                  message: '데이터 형식이 올바르지 않습니다.'
              }
  } */
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

router.put('/:_commentId', async (req, res) => {
  // #swagger.description = '댓글 수정'
  //  #swagger.tags = ['comments']
  /*  #swagger.parameters[''] = {
                  in: 'body',
                  schema: {
                      password: '1234',
                      content: '수정된 댓글입니다.'
                  }
  } */
  /*  #swagger.responses[200] = {
              description: '댓글 수정 성공',
              schema: {
                  message: '댓글을 수정하였습니다.'
              }
  } */
  /*  #swagger.responses[400] = {
              description: 'body 또는 params를 입력받지 못한 경우',
              schema: {
                  message: '데이터 형식이 올바르지 않습니다.'
              }
  } */
    /*  #swagger.responses[401] = {
            description: '비밀번호가 일치하지 않는 경우',
            schema: {
                message: '댓글 수정 권한이 없습니다.'
            }
  } */
  /*  #swagger.responses[404] = {
            description: '_commentId에 해당하는 댓글이 존재하지 않을 경우',
            schema: {
                message: '댓글 조회에 실패하였습니다.'
            }
  } */
  try {
    const {_commentId} = req.params;
    const {password, content} = req.body;

    if (Object.keys(req.body).length > 0) {
      if (content.length == 0) {
        return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });
      }
  
      const comment = await Comment.findOne({_id: _commentId}).exec();
      if (!comment) {
        return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
      } else {
        if (password !== comment.password) {  // 비밀번호 체크
          return res.status(401).json({ message: '댓글 수정 권한이 없습니다.' });
        } else {
          await Comment.updateOne(
            {_id: _commentId}, 
            {$set: {content: content}}
          );
          return res.status(200).json({ message: '댓글을 수정하였습니다.' });
        }
      }
    } else {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
  } catch (err) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

router.delete('/:_commentId', async (req, res) => {
  // #swagger.description = '댓글 삭제'
  //  #swagger.tags = ['comments']
  /*  #swagger.parameters[''] = {
                  in: 'body',
                  schema: {
                      password: '1234',
                  }
  } */
  /*  #swagger.responses[200] = {
              description: '댓글 삭제 성공',
              schema: {
                  message: '댓글을 삭제하였습니다.'
              }
  } */
  /*  #swagger.responses[400] = {
              description: 'body 또는 params를 입력받지 못한 경우',
              schema: {
                  message: '데이터 형식이 올바르지 않습니다.'
              }
  } */
    /*  #swagger.responses[401] = {
            description: '비밀번호가 일치하지 않는 경우',
            schema: {
                message: '댓글 삭제 권한이 없습니다.'
            }
  } */
  /*  #swagger.responses[404] = {
            description: '_commentId에 해당하는 댓글이 존재하지 않을 경우',
            schema: {
                message: '댓글 조회에 실패하였습니다.'
            }
  } */
  try {
    const {_commentId} = req.params;
    const {password} = req.body;

    if (Object.keys(req.body).length > 0) {
      const comment = await Comment.findOne({_id: _commentId}).exec();
      if (!comment) {
        return res.status(404).json({ message: '댓글 조회에 실패하였습니다.' });
      } else {
        if (password !== comment.password) {  // 비밀번호 체크
          return res.status(401).json({ message: '댓글 삭제 권한이 없습니다.' });
        } else {
          await Comment.deleteOne({ _id: _commentId });
          return res.status(200).json({ message: '댓글을 삭제하였습니다.' });
        }
      }
    } else {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
  } catch (err) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

module.exports = router;