import { useState } from "react";
import { createContainer } from "unstated-next";
import axios from "axios";
import _ from "lodash";
import { API_ROOT } from "../setting";

const usePostContainer = () => {
  const [posts, setPosts] = useState({});

  const fetch_posts = async () => {
    const res = await axios.get(`${API_ROOT}/posts`);
    setPosts(_.mapKeys(res.data, "ID"));
  };

  const fetch_single_post = async postID => {
    const res = await axios.get(`${API_ROOT}/posts/${postID}`);
    let newPosts = {};
    Object.assign(newPosts, posts);
    newPosts[postID] = res.data;
    setPosts(newPosts);
  };

  return { posts, fetch_posts, fetch_single_post };
};

export const PostContainer = createContainer(usePostContainer);
