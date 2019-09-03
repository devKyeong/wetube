
//Global
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";

//Users
const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";

//Videos
const VIDEOS = "/videos";
const UPLOAD = "/upload";
const VIDEO_DETAIL = "/:id";
const EDIT_VIDEO = "/edit";
const DELETE_VIDEO = "/delete";


const routes = {
    home : HOME,
    search : SEARCH,
    join : JOIN,
    login : LOGIN,
    logout : LOGOUT,
    users : USERS,
    userDetail : (id) => {
        if(id){
            return `${USERS}/${id}`;
        }else{
            return USER_DETAIL;
        }
    },
    editProfile : EDIT_PROFILE,
    changePassword : CHANGE_PASSWORD,
    videos : VIDEOS,
    upload : UPLOAD,
    videoDetail : (id) => {
        if(id){
            return `${VIDEOS}/${id}`;
        }else{
            return VIDEO_DETAIL;
        }
    },
    editVideo : (id) => {
        if(id){
            return `${VIDEOS}/${id}${EDIT_VIDEO}`;
        }else{
            return `${VIDEO_DETAIL}${EDIT_VIDEO}`;
        }
    },
    deleteVideo : (id) => {
        if(id){
            return `${VIDEOS}/${id}${DELETE_VIDEO}`;
        }else{
            return `${VIDEO_DETAIL}${DELETE_VIDEO}`;
        }
    }
};

export default routes;