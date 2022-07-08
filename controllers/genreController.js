var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
const {model} = require("mongoose");
const {body,validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');
// const {body,validationResult,sanitizeBody} = require('express-validator');
// Display list of all Genre.
exports.genre_list = function(req, res,next) {
    Genre.find()
        .sort([['name','ascending']])
        .exec(function (err,list_genres){
            if(err){return next(err);}
            res.render('genre_list',{title:'种类列表',genre_list:list_genres});
        });
};


// Display detail page for a specific Genre.  页面细节
exports.genre_detail = function(req, res,next) {
    //并行查询类型名称及相关联的书本
    async.parallel({
        genre: function (callback) {
            //用于获取当前种类
            Genre.findById(req.params.id)
                .exec(callback);
        },

        genre_books: function (callback) {
            //获取符合当前种类的所有Book对象
            Book.find({'genre': req.params.id})
                .exec(callback);
        },
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        if (results.genre == null) {  //No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // 如果成功  就渲染视图
        //渲染的视图是： genre_detail  它传递该类型的标题 title 种类genre 和 书本列表的变量
        //(genre_books)
        res.render('genre_detail', {
            title: '种类细节页面', genre: results.genre,
             genre_books: results.genre_books
        });
    });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res,next) {
    // res.send('NOT IMPLEMENTED: Genre create GET');
    res.render('genre_form',{title:'创建流派'});
};

// Handle Genre create on POST.
// exports.genre_create_post = function(req, res) {
//     // res.send('NOT IMPLEMENTED: Genre create POST');
// };
exports.genre_create_post = [
    // res.send('NOT IMPLEMENTED: Genre create POST');
    // Validate that the name field is not empty.
    body('name','Genre name required').isLength({min:1}).trim(),

    //Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req,res,next) =>{
    //Extract the validation errors from a request.
        const errors = validationResult(req);

        //Create a genre object with escaped and trimmed date.
        var genre = new Genre(
            {name:req.body.name}
        );

        if(!errors.isEmpty()){
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('genre_form',{title:'创建种类',genre:genre,errors:errors.array()});
            return;
        }
        else{
            // Data from form is valid.
            // Check if Genre with same name already exists.
            Genre.findOne({'name':req.body.name})
                .exec(
                    function (err,found_genre) {
                        if(err){return next(err);}

                        if(found_genre){
                            // Genre exists, redirect to its detail page.
                            res.redirect(found_genre.url);
                        }
                        else{
                            genre.save(function (err){
                                if(err){return next(err);}
                                // Genre saved. Redirect to genre detail page.
                                res.redirect(genre.url);
                            });

                        }
                    });
        }
    }
];

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};