const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const blogController = require('../controllers/blog');

router.get('/', blogController.getAllBlog);
router.get('/:id', blogController.getBlogById);

router.post('/', [
    body('title').isLength({ min: 3 }).withMessage('incorrect value'),
    body('body').isLength({ min: 3 }).withMessage('incorrect value')
], blogController.createBlog);

router.put('/:id', [
    body('title').isLength({ min: 3 }).withMessage('incorrect value'),
    body('body').isLength({ min: 3 }).withMessage('incorrect value')
], blogController.createBlog);

router.delete('/:id', blogController.deleteBlog);

module.exports = router;