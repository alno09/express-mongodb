const { validationResult } = require('express-validator');
const BlogPost = require('../models/blog_model');
const fs = require('fs');
const path = require('path');

exports.getAllBlog = (req, res, next) => {
    BlogPost.find()
    .then(result => {
        res.status(200).json({
            message: 'sukses mengambil semua data',
            data: result
        })
    })
    .catch(err => {
        next(err);
    })
};

exports.getBlogById = (req, res, next) => {
    const id = req.params.id;
    BlogPost.findById(id)
    .then(result => {
        if (!result) {
            const error = new Error('data tidak ditemukan');
            error.errorStatus = 404;
            throw error;
        }
    })
    .catch(err => {
        next(err);
    })
};

exports.createBlog = (req, res, next) => {
    const errors = validationResult(req);

    // validasi
    if(!errors.isEmpty()) {
        const err = new Error("invalid value");
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    }
    if(!req.file){
        const err = new Error('image not uploaded');
        err.errorStatus = 422;
        throw err;
    }

    const image = req.file.path;

    const PostingBlog = new BlogPost({
        title: req.body.title,
        body: req.body.body,
        image: image,
        author: {
            uid: 1,
            name: 'alno'
        }
    });

    PostingBlog.save()
    .then((result) => {
        res.status(201).json({
            status: 201,
            message: 'sukses menyimpan data',
            data: result
        })
    })
    .catch((err) => {
        console.log("error [create new blog] => ", err);
    });
};

exports.updateBlog = (req, res, next) => {
    const {id} = req.params
    const {title, image, body} = req.body
    const errors = validationResult(req)

    // validasi
    if (!errors.isEmpty()) {
        const err = new Error('invalid value')
        err.errorStatus = 400;
        err.data = errors.array();
        throw err;
    } 

    // validasi file
    if (!req.file) {
        const err = new Error('image not upload');
        err.errorStatus = 422;
        throw err
    }

    BlogPost.findById(id)
    .then((post) => {
        if (!post) {
            const err = new Error('data not found');
            err.errorStatus = 404;
            throw err;
        } 

        post.title = title;
        post.body = body;
        post.image = req.file.path;

        return post.save();
    })
    .then((result) => {
        res.status(200).json({
            message: 'succes update data',
            data: result
        })
    })
    .catch((err) => {
        next(err);
    })
};

exports.deleteBlog = (req, res, next) => {
    const {id} = req.params;
    BlogPost.findById(id)
    .then((post) => {
        if (!post) {
            const err = new Error('data not found');
            err.errorStatus = 404;
            throw err;
        }

        // hapus dari database
        return BlogPost.findByIdAndDelete(id)
    })
    .then((result) => {
        res.status(200).json({
            message: 'sukses menghapus data',
            data: result
        })
    })
    .catch((err) => {
        next(err)
    })
}