import React from "react"
import { PostContainer } from "../containers/PostContainer"
import _ from "lodash"

const List = () => {
    const { posts, fetch_posts } = PostContainer.useContainer()
    return (
        <React.Fragment>
            {_.map(posts, (post) => {
                return (
                    <div>
                        <p>{post.ID}</p>
                        <p>{post.title}</p>
                        <p>{post.author}</p>
                        <p>{post.description}</p>
                        <p>{post.image_src}</p>
                    </div>
                )
            })}
            <button onClick={() => {fetch_posts()}}>Fetch Posts</button>
        </React.Fragment>
    )
}

export default () => {
    return (
        <PostContainer.Provider>
            <List />
        </PostContainer.Provider>
    )
}