import UserModel from '../models/UserModel.js';
import VideoModel from '../models/VideoModel.js';

export const addVideo = async (req, res, next) => {
  try {
    const addvideo = new VideoModel({ userId: req.user.id, ...req.body });
    await addvideo.save();
    res.status(200).send({
      success: true,
      message: 'Video added successully',
      addvideo,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in update video',
      error,
    });
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const updatevideo = await VideoModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: 'Video updated successully',
      updatevideo,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in add video',
      error,
    });
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const deletevideo = await VideoModel.findByIdAndDelete(req.params.id);

    res.status(200).send({
      success: true,
      message: 'Video deleted successully',
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in delete video',
      error,
    });
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await VideoModel.findById(req.params.id);

    res.status(200).send({
      success: true,
      message: 'Video fetched successully',
      video,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error fetched video',
      error,
    });
  }
};

export const addView = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const videoId = req.params.id;

    const video = await VideoModel.findById(videoId);

    if (!video) {
      return res
        .status(404)
        .send({ success: false, message: 'Video not found' });
    }

    if (!video.userViews.includes(userId)) {
      video.views += 1;
      video.userViews.push(userId);
      await video.save();

      return res.status(200).send({
        success: true,
        message: 'Video view increased',
      });
    } else {
      return res.status(200).send({
        success: true,
        message: 'User has already viewed this video',
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error updating view',
      error,
    });
  }
};
export const random = async (req, res, next) => {
  try {
    // Fetch 40 random videos
    const videos = await VideoModel.aggregate([{ $sample: { size: 40 } }]);

    res.status(200).send({
      success: true,
      videos: videos,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error while fetching random video',
      error,
    });
  }
};

export const trend = async (req, res, next) => {
  try {
    const videos = await VideoModel.find().sort({ views: -1 });

    res.status(200).send({
      success: true,
      videos,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in trending videos',
      error,
    });
  }
};

export const sub = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id);
    const subChannel = user.subscribedUsers;

    const list = await Promise.all(
      subChannel.map((channelId) => {
        return VideoModel.find({ userId: channelId });
      })
    );

    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
    });
  }
};

export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(',');
  try {
    const videos = await VideoModel.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await VideoModel.find({
      title: { $regex: query, $options: 'i' },
    }).limit(40);
    res.status(200).json(videos);
  } catch (err) {
    next(err);
  }
};
