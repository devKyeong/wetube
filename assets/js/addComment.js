import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const deleteComment = async event => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/deleteComment`,
    method: "POST",
    data: {
      commentId: event.target.id
    }
  });

  if (response.status === 200) {
    console.log(response.data.commentCnt);
    document.getElementById(event.target.id).parentElement.remove();
    commentNumber.innerHTML = response.data.commentCnt;
  }
};

const addComment = (comment, res) => {
  const {
    data: { commentId, commentCnt }
  } = res;
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.innerHTML = comment;
  li.appendChild(span);

  const a = document.createElement("a");
  a.setAttribute("id", commentId);
  a.addEventListener("click", deleteComment);
  a.innerHTML = "✖️";
  console.log(a);
  li.appendChild(a);

  commentList.prepend(li);
  commentNumber.innerHTML = commentCnt;
};

const sendComment = async comment => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/addComment`,
    method: "POST",
    data: {
      comment
    }
  });

  if (response.status === 200) addComment(comment, response);
};

const handleSubmit = event => {
  event.preventDefault();

  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;

  sendComment(comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);

  commentList.querySelectorAll("li > a").forEach(element => {
    element.addEventListener("click", deleteComment);
  });
}

if (addCommentForm) {
  init();
}
