import { createError } from '../createError.js';
import UserModel from '../models/UserModel.js';
import VideoModel from '../models/VideoModel.js';
export const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updateUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: 'User updated successfully',
        updateUser,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: 'Error in update user',
        error,
      });
    }
  } else {
    return next(createError(403, 'You can not update in this account'));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      const deleteUser = await UserModel.findByIdAndDelete(req.params.id);

      res.status(200).send({
        success: true,
        message: 'User deleted successfully',
        updateUser,
      });
    } else {
      return next(createError(403, 'You can not update in this account'));
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in delete user',
      error,
    });
  }
};

export const getUser = async (req, res, next) => {
  try {
    const getUser = await UserModel.findById(req.params.id);
    res.status(200).send({
      success: true,
      message: 'User details',
      getUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error while getting user',
      error,
    });
  }
};

export const subscribe = async (req, res, next) => {
  try {
    await UserModel.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    await UserModel.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).send({
      success: true,
      message: 'Subscribed successfully',
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error while subscribe',
      error,
    });
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    await UserModel.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await UserModel.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).send({
      success: true,
      message: 'Unsubscribed successfully',
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error while subscribe',
      error,
    });
  }
};

export const like = async (req, res) => {
  try {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
      await VideoModel.findByIdAndUpdate(videoId, {
        $addToSet: { likes: id },
        $pull: { dislikes: id },
      });
      res.status(200).json('The video has been liked.');
    } catch (err) {
      next(err);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error while like',
      error,
    });
  }
};

export const deslike = async (req, res) => {
  {
    try {
      const id = req.user.id;
      const videoId = req.params.videoId;
      try {
        await VideoModel.findByIdAndUpdate(videoId, {
          $addToSet: { dislikes: id },
          $pull: { likes: id },
        });
        res.status(200).json('The video has been disliked.');
      } catch (err) {
        next(err);
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: 'Error while deslike',
        error,
      });
    }
  }
};
