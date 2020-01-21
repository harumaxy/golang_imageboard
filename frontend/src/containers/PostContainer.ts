import { useState } from "react"
import { createContainer } from "unstated-next"
import axios from "axios"
import _ from "lodash"
import { API_ROOT } from "../setting"
import { Post } from "../models/Post"
import { List } from "@material-ui/core"

const usePostContainer = () => {
  const [posts, setPosts] = useState([] as Post[])

  const fetch_posts = async () => {
    const res = await axios.get(`${API_ROOT}/posts`)
    setPosts(res.data)
  }

  const fetch_single_post = async (postID: number) => {
    const res = await axios.get(`${API_ROOT}/posts/${postID}`)
    const newPosts = posts.slice(0, posts.length)
    const newIndex = newPosts.findIndex(post => post.ID === res.data.ID)
    newPosts[newIndex] = res.data
    setPosts(newPosts)
  }

  return { posts, fetch_posts, fetch_single_post }
}

export const PostContainer = createContainer(usePostContainer)
