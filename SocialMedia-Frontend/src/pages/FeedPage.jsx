import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostComponent from "../components/PostComponent";
import { myContext } from "../context";

const FeedPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLoginUser, setCurrentLoginUser] = useState({});
  const [allPosts, setAllPosts] = useState([]);

  // useEffect to check if the user is authenticated and get all users if authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:4000/auth-check", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsLoading(false);
          const getAllPostsResponse = await axios.get(
            "http://localhost:4000/post",
            { withCredentials: true }
          );
          const getCurrentLoginUser = await axios.get(
            "http://localhost:4000/user",
            { withCredentials: true }
          );
          // console.log(getAllPostsResponse.data.modifiedResults);
          setAllPosts(getAllPostsResponse.data.modifiedResults);
          setCurrentLoginUser(getCurrentLoginUser.data);
        } else {
          navigate("/login");
          return;
        }
      } catch (error) {
        console.log("Error in checking auth status: ", error.message);
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate, setAllPosts]);

  if (isLoading) {
    return <div>Loading....</div>;
  }

  return (
    <div className="w-screen h-screen flex items-center flex-col py-2">
      <div className="w-[300px] sm:w-full sm:px-[35px] flex justify-between items-center mb-6">
        {/* this div contains the app name and profile pic */}
        <div>
          {/* this div contains the app name */}
          <div className="text-2xl font-mono font-semibold">Retro</div>
          <div className="text-sm text-purple-400 font-mono">all you need!</div>
        </div>
        {/* this div contains profile pic */}
        <div className="w-[35px] h-[35px] bg-purple-600 rounded-full flex items-center justify-center font-semibold text-xl">
          {currentLoginUser?.username?.[0]?.toUpperCase() || ""}
        </div>
      </div>
      {allPosts.map((post, index) => {
        return (
          <div key={index} className="mt-2">
            <myContext.Provider
              value={{
                post,
                currentLoginUser,
                setAllPosts,
                setCurrentLoginUser,
              }}
            >
              <PostComponent
              // post={post}
              // currentLoginUser={currentLoginUser}
              // setAllPosts={setAllPosts}
              // setCurrentLoginUser={setCurrentLoginUser}
              />
            </myContext.Provider>
          </div>
        );
      })}
    </div>
  );
};

export default FeedPage;
