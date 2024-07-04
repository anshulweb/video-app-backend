import CommentsModel from '../models/CommentsModel.js';
import VideoModel from '../models/VideoModel.js';

export const addComment = async (req, res) => {
  try {
    const addComment = new CommentsModel({
      userId: req.user.id,
      ...req.body,
    });
    await addComment.save();
    res.status(200).send({
      success: true,
      message: 'Comment added successfully',
      addComment,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in comment',
      error,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await CommentsModel.findById(req.params.id);
    const video = await VideoModel.findById(req.params.id);
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json('The comment has been deleted.');
    } else {
      res.status(401).send({
        success: false,
        message: 'Unauthorised user',
      });
    }
    res.status(200).send({
      success: true,
      message: 'Comment added successfully',
      addComment,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in delete comment',
      error,
    });
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await CommentsModel.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};
