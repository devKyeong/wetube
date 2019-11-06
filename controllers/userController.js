import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  console.log(req.body);
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = User({
        name,
        email
      });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
    // To Do: Log user in
  }
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Log In" });
};

export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home
});

export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async (_, __, profile, cb) => {
  console.log(profile);
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogin = (_, res) => {
  res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate("facebook");
export const facebookLoginCallback = async (_, __, profile, cb) => {
  console.log(profile);
  const {
    _json: { id, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
      name,
      facebookId: id
    });
    return cb(null, newUser);
  } catch (error) {
    cb(error);
  }
};
export const postFacebookLogin = (_, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate("videos");
    console.log(user.videos);
    res.render("userDetail", {
      pageTitle: "User Detail",
      user: req.user,
      videos: user.videos
    });
  } catch (error) {
    res.redirect(routes.login);
  }
};
export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    console.log(user.videos);
    res.render("userDetail", {
      pageTitle: "User Detail",
      user,
      videos: user.videos
    });
  } catch (error) {
    res.redirect(routes.me);
  }
};
export const getEditProfile = (req, res) => {
  res.render("editProfile", { pageTitle: "Edit Profile" });
};
export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
    user: { id, avatarUrl }
  } = req;

  try {
    await User.findByIdAndUpdate(id, {
      name,
      email,
      avatarUrl: file ? req.file.path : avatarUrl
    });
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(`${routes.users}${routes.editProfile}`);
  }
};

export const getChangePassword = (req, res) => {
  res.render("changePassword", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  console.log(oldPassword, newPassword, newPassword);
  try {
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect(`${routes.users}${routes.changePassword}`);
    }

    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(`${routes.users}${routes.changePassword}`);
  }
};
