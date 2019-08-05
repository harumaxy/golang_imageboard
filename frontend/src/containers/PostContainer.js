import { useState } from "react"
import { createContainer } from "unstated-next"
import axios from "axios"
import _ from "lodash"


const API_ROOT = "http://localhost:8080"

const usePostContainer = ()=>{
    const [posts, setPosts] = useState({})

    const fetch_posts = async () => {
        const res = await axios.get(`${API_ROOT}/posts`)
        setPosts({ posts : _.mapKeys(res.data) })
    }

    const fetch_single_post = async (postID) => {
        const res = await axios.get(`${API_ROOT}/posts/${postID}`)
        const newPosts = {}
        Object.assign(newPosts, posts)
        newPosts[postID] = res.data
        setPosts({ posts: newPosts })
    }

    return {posts, fetch_posts, fetch_single_post}
}

export const PostContainer = createContainer(usePostContainer)
