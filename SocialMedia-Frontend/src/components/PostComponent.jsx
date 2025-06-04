import { useState } from "react";
import CommentComponent from "./CommentComponent";
import axios from "axios";
import commentImage from "../assets/comment.png";
import likeImage from "../assets/like.png";
import shareImage from "../assets/share.png";
import bookmarkImage from "../assets/bookmark.png";

const PostComponent = (props) => {
  const { post, currentLoginUser, setAllPosts, setCurrentLoginUser } = props;
  const [commentsClicked, setCommentsClicked] = useState(false);

  const handleCommentsClick = () => {
    setCommentsClicked((e) => {
      return !e;
    });
  };

  const handleFollowClick = async () => {
    const data = { id: post.created_by };
    const response = await axios.post("http://localhost:4000/follow", data, {
      withCredentials: true,
    });
    if (response.status === 200) {
      const [getAllPostsResponse, getCurrentLoginUser] = await Promise.all([
        axios.get("http://localhost:4000/post", { withCredentials: true }),
        axios.get("http://localhost:4000/user", { withCredentials: true }),
      ]);

      setAllPosts(getAllPostsResponse.data.modifiedResults);
      setCurrentLoginUser(getCurrentLoginUser.data);
    }
  };

  const handleUnfollowClick = async () => {
    const data = { postBy: post.created_by };
    const response = await axios.post("http://localhost:4000/unfollow", data, {
      withCredentials: true,
    });
    if (response.status === 200) {
      const [getAllPostsResponse, getCurrentLoginUser] = await Promise.all([
        axios.get("http://localhost:4000/post", { withCredentials: true }),
        axios.get("http://localhost:4000/user", { withCredentials: true }),
      ]);

      setAllPosts(getAllPostsResponse.data.modifiedResults);
      setCurrentLoginUser(getCurrentLoginUser.data);
    }
  };

  return (
    <div className="border-2 border-gray-600">
      <div className="flex items-center justify-between m-[5px]">
        {/* container of profile pic, username and follow */}
        <div className="flex gap-1 items-center">
          <div className="w-[30px] h-[30px] rounded-full bg-purple-500"></div>
          <div className="font-semibold">{post.userDetails.username}</div>
        </div>
        <div>
          {/* show the follow button only if it is not in followings of the current login user. If already following, then show following button*/}
          {currentLoginUser.followingIds.includes(post.created_by) ? (
            <button
              className="bg-gray-700 p-2 rounded-lg font-semibold hover:cursor-pointer"
              onClick={handleUnfollowClick}
            >
              unfollow
            </button>
          ) : currentLoginUser.id === post.created_by ? (
            <div></div>
          ) : (
            <button
              className="bg-blue-800 p-2 rounded-lg font-semibold hover:bg-blue-900 hover:cursor-pointer"
              onClick={handleFollowClick}
            >
              follow
            </button>
          )}
        </div>
      </div>
      <div className=" rounded-sm w-[300px] mt-2 sm:w-[480px]">
        {/*container of profile pic, follow button, title and description */}

        <div className="mt-5 flex flex-col gap-[3px]">
          {/* container of  post title and description*/}
          <div className="font-semibold mx-[5px]">{post.title}</div>
          <div className="mx-[5px]">{post.description}</div>
          <div>
            <img
              src={`https://picsum.photos/seed/${post.post_id}/480/250`}
              alt="Post"
            />
          </div>
        </div>
        <div></div>
      </div>
      <div className="py-2">
        {/* container of comments, like, share, and bookmark */}
        <div className="flex items-center gap-[0px] justify-between">
          {/* container of comments, like and share */}
          <div className="flex items-center mx-[5px]">
            <a className="hover:cursor-pointer" onClick={handleCommentsClick}>
              <img src={commentImage} className="w-[27px] h-[27px] mr-2" />
            </a>
            <a className="hover:cursor-pointer">
              <img src={likeImage} className="w-[30px] h-[30px]" />
            </a>
            <a className="hover:cursor-pointer">
              <img src={shareImage} className="w-[25px] h-[25px] ml-2" />
            </a>
          </div>
          <div>
            {/* this div contains the bookmark icon */}
            <a className="hover:cursor-pointer">
              <img src={bookmarkImage} className="w-[25px] h-[25px] mr-2" />
            </a>
          </div>
        </div>
      </div>
      {commentsClicked && (
        <div className="w-[300px] max-h-[250px] p-2 overflow-y-scroll custom-scrollbar sm:w-[480px]">
          {post.comments.length === 0 ? (
            <CommentComponent msg="no comments yet" />
          ) : (
            post.comments.map((c, index) => (
              <CommentComponent key={index} c={c} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PostComponent;
