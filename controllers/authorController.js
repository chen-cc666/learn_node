const Author = require('../models/author');
var async = require('async');
var Book = require('../models/book');
const {body,validationResult} = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
// 显示完整的作者列表
exports.author_list = (req, res,next) => {
    Author.find()
        .sort([['family_name','ascending']])
        .exec(function (err,list_authors) {
            if(err){return next(err);}
            //successful,so render
            res.render('author_list',{title:'作者列表',author_list:list_authors});
        });
};

// 为每位作者显示详细信息的页面
exports.author_detail = (req, res,next) => {
    // res.send('未实现：作者详细信息：' + req.params.id);

        async.parallel({
            author:function (callback) {
                Author.findById(req.params.id)
                    .exec(callback)
            },
            authors_books:function (callback) {
                Book.find({'author':req.params.id},'title summary')
                    .exec(callback)
            },

        },function (err,results) {
            if(err){return next(err);} //api 使用错误~
            if(results.author==null){
                //no results
                var err = new Error('Author not found~');
                err.status = 404;
                return next(err);
            }
            // 成功就渲染模板
            res.render('author_detail',{title:'Author Detail',author:results.author,
            author_books:results.authors_books});

        });
};

// 由 GET 显示创建作者的表单
exports.author_create_get = (req, res,next) => {
    // res.send('未实现：作者创建表单的 GET');
    res.render('author_form',{title:'创建作者'});


};

// 由 POST 处理作者创建操作
exports.author_create_post = [

    body('first_name').isLength({min:1}).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({min:1}).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),


    //sanitize fields
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    //Process request after vaildation and sanitization
    (req,res,next) => {

    //Extract the vaildation errors from a request.
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            // There are errors. Render form again with sanitized values / errors messages.
            res.render('author_form',{title:'创建作者',author:req.body,
            errors:errors.array()});
            return;
        }
        else{
            //Data from form is valid.

            //create an author object with escaped and trimmed data.
            var author = new Author(
                {
                    first_name:req.body.first_name,
                    family_name:req.body.family_name,
                    date_of_birth:req.body.date_of_birth,
                    date_of_death:req.body.date_of_death
                });
            author.save(function (err) {
                if(err){return next(err);}
                // Successful - redirect to new author record.
                res.redirect(author.url);
            });
        }
    }
];

// 由 GET 显示删除作者的表单
exports.author_delete_get = (req, res,next) => {
    // res.send('未实现：作者删除表单的 GET');
    async.parallel({
        author:function (callback) {
            Author.findById(req.params.id).exec(callback)
        },
        authors_books:function (callback) {
            Book.find({'author':req.params.id}).exec(callback)
        },
    },function (err,results) {
        if(err){return next(err);}
        if(results.author==null){
            res.redirect('/catalog/authors');
        }
        res.render('author_delete',{title:'删除作者',author:results.author,
        author_books:results.authors_books});
        });
};

// 由 POST 处理作者删除操作
exports.author_delete_post = (req, res,next) => {
    async.parallel({
        author:function (callback) {
            Author.findById(req.body.authorid).exec(callback)
        },
        authors_books:function (callback) {
            Book.find({'author':req.body.authorid}).exec(callback)
        },
    },function (err,results) {
        if(err){return next(err);}

        if(results.author_books.length > 0){
            res.render('author_delete',{title:'删除作者',author:results.author,
                author_books:results.authors_books});
            return;
        }
        else{
            Author.findByIdAndRemove(req.body.authorid,function deleteAuthor(err){
                if(err){return next(err);}
                //成功  就 返回作者列表
                res.redirect('/catalog/authors')
            })
        }
    });
};

// 由 GET 显示更新作者的表单
exports.author_update_get = (req, res) => { res.send('未实现：作者更新表单的 GET'); };

// 由 POST 处理作者更新操作
exports.author_update_post = (req, res) => { res.send('未实现：更新作者的 POST'); };