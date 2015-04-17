var express = require('express'),
    router = express.Router(),
    Post = require('./models/post'),
    PostDao = require('./db/postDao');

router.route('/posts').get(function (req, res) {
    Post.find().exec(function(err, posts) {
        if (err) {
            res.send(err);
        }

        res.json(posts);
    });
});

router.route('/posts/:id').get(function (req, res) {
    PostDao.findBy(req.params.id, function (err, post) {
        if (err) {
            res.send(err);
        }
        
        res.json(post);
    });
});

router.route('/posts').post(function (req, res) {
    var post = new Post(req.body);
    
    PostDao.add(post, function (error) {
        if (error) {
            res.send(error);
        }
        
        res.json(post);
    });
});

router.route('/posts/:id').put(function (req, res) {
    PostDao.findBy(req.params.id, function (err, post) {
        if (err) {
            res.send(err);
        }
        
        for (prop in req.body) {
            if (req.body.hasOwnProperty(prop)) {
                post[prop] = req.body[prop];
            }
        }
        
        PostDao.update(post, function (error) {
            if (error) {
                res.send(error);
            }
            
            res.json(post);
        });
    });
});

router.route('/posts/:id/comments').post(function (req, res) {
    PostDao.findBy(req.params.id, function (err, post) {
        if (err) {
            res.send(err);
        }

        post.addComment('admin', req.body);

        PostDao.update(post, function (error) {
            if (error) {
                res.send(error);
            }
            
            res.json(post);
        });
    });
});

module.exports = router;