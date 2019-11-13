import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  // const searchingBy = req.query.term; // es6 이전(ECMAscript) 코딩방식
  const {
    query: { term: searchingBy }
  } = req; // es6 코딩방식
  let videos = [];
  try {
    videos = await Video.find({
      $or: [
        { title: { $regex: `.*${searchingBy}.*`, $options: "i" } },
        { description: { $regex: `.*${searchingBy}.*` } }
      ]
    });
  } catch (error) {
    console.log(error);
  }

  res.render("search", { pageTitle: "Search", searchingBy, videos });
};

export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });

export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path }
  } = req;

  const newVideo = await Video.create({
    fileUrl: path,
    title,
    description,
    creator: req.user.id
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator.toString() !== req.user.id) {
      throw Error();
    }
    res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description }
  } = req;

  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const video = await Video.findById(id);
    if (video.creator.toString() !== req.user.id) {
      throw Error();
    }
    await Video.findOneAndRemove({ _id: id });
  } catch (error) {
    console.log(error);
  }

  res.redirect(routes.home);
};

// don't rendering..
export const postRegisterView = async (req, res) => {
  const {
    params: { id }
  } = req;
  console.log(id);
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// dd Comment

export const postAddComment = async (req, res) => {
  const {
    params: { id: videoId },
    body: { comment },
    user
  } = req;

  try {
    const video = await Video.findById(videoId);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id
    });
    video.comments.push(newComment.id);
    video.save();
    res.send({ commentCnt: video.comments.length, commentId: newComment.id });
  } catch (error) {
    res.status(400);
    res.end();
  }
};

export const postDeleteComment = async (req, res) => {
  const {
    params: { id: videoId },
    body: { commentId }
  } = req;

  try {
    const video = await Video.findById(videoId);
    const commentIndex = video.comments.findIndex(element => {
      return element.id === commentId;
    });
    await video.comments.splice(commentIndex, 1);
    video.save();
    await Comment.findByIdAndRemove(commentId);

    res.status(200);
    res.send({ commentCnt: video.comments.length });
  } catch (error) {
    res.status(400);
    res.end();
  }
};
