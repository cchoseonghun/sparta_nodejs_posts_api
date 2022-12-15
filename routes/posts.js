const express = require('express');
const router = express.Router();

const Post = require('../schemas/post');

router.post('/', async (req, res) => {
  //  #swagger.description = '게시글 작성'
  //  #swagger.tags = ['posts']
  /*  #swagger.parameters[''] = {
                  in: 'body',
                  schema: {
                      user: 'Developer',
                      password: '1234',
                      title: '안녕하세요', 
                      content: '안녕하세요 content 입니다'
                  }
  } */
  /*  #swagger.responses[201] = {
              description: '게시글 작성 성공',
              schema: {
                  message: '게시글을 생성하였습니다.'
              }
  } */
  /*  #swagger.responses[400] = {
              description: 'body 또는 params를 입력받지 못한 경우',
              schema: {
                  message: '데이터 형식이 올바르지 않습니다.'
              }
  } */
  try {
    const {user, password, title, content} = req.body;

    if (Object.keys(req.body).length > 0) {
      // DB 통신 전 1차 처리
      if (user.length == 0 || password.length == 0 || title.length == 0) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      }
    
        await Post.create({ user, password, title, content });
        return res.status(201).json({ message: '게시글을 생성하였습니다.' });
    } else {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
  } catch {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

router.get('/', async (req, res) => {
  //  #swagger.description = '게시글 조회'
  //  #swagger.tags = ['posts']
  /*  #swagger.responses[200] = {
            description: '게시글 조회 성공',
            schema: {
                data: [
                  {
                    postId: '639a81d11099c5ef762d3688', 
                    user: 'Developer', 
                    title: '안녕하세요', 
                    createdAt: '2022-12-14T03:39:20.389Z'
                  }
                ]
            }
  } */
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
  // #swagger.description = '게시글 상세 조회'
  // #swagger.tags = ['posts']
  /*  #swagger.responses[200] = {
            description: '게시글 상세 조회 성공',
            schema: {
                data: {
                  postId: '639a81d11099c5ef762d3688', 
                  user: 'Developer', 
                  title: '안녕하세요', 
                  content: '안녕하세요 content 입니다.', 
                  createdAt: '2022-12-14T03:39:20.389Z'
                }
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
  
    const post = await Post.findOne({_id: _postId}).exec();
  
    let new_post = {};
    new_post.postId = post._id;
    new_post.user = post.user;
    new_post.title = post.title;
    new_post.content = post.content;
    new_post.createdAt = post.createdAt;
  
    return res.status(200).json({ data: new_post });
  } catch (err) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

router.put('/:_postId', async (req, res) => {
  // #swagger.description = '게시글 수정'
  //  #swagger.tags = ['posts']
  /*  #swagger.parameters[''] = {
                  in: 'body',
                  schema: {
                      password: '1234',
                      title: '안녕하세요', 
                      content: '안녕하세요 content 입니다'
                  }
  } */
  /*  #swagger.responses[200] = {
              description: '게시글 수정 성공',
              schema: {
                  message: '게시글을 수정하였습니다.'
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
                message: '게시글 수정 권한이 없습니다.'
            }
  } */
  /*  #swagger.responses[404] = {
            description: '_postId에 해당하는 게시글이 존재하지 않을 경우',
            schema: {
                message: '게시글 조회에 실패하였습니다.'
            }
  } */
  try {
    const {_postId} = req.params;
    const {password, title, content} = req.body;

    if (Object.keys(req.body).length > 0) {
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
    } else {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
  } catch (err) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

router.delete('/:_postId', async (req, res) => {
  // #swagger.description = '게시글 삭제'
  //  #swagger.tags = ['posts']
  /*  #swagger.parameters[''] = {
                  in: 'body',
                  schema: {
                      password: '1234',
                  }
  } */
  /*  #swagger.responses[200] = {
              description: '게시글 삭제 성공',
              schema: {
                  message: '게시글을 삭제하였습니다.'
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
                message: '게시글 삭제 권한이 없습니다.'
            }
  } */
  /*  #swagger.responses[404] = {
            description: '_postId에 해당하는 게시글이 존재하지 않을 경우',
            schema: {
                message: '게시글 조회에 실패하였습니다.'
            }
  } */
  try {
    const {_postId} = req.params;
    const {password} = req.body;

    if (Object.keys(req.body).length > 0) {
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
    } else {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
  } catch (err) {
    return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  }
})

module.exports = router;