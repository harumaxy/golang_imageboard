import React, { useState, useEffect, ReactNode } from "react"
import { Container, Grid, Typography, Hidden, Paper, Grow } from "@material-ui/core";
import { PostContainer } from "../containers/PostContainer"
import { string } from "prop-types";
import Axios, { AxiosResponse } from "axios";
import { API_ROOT } from '../setting'


type Post = {
    ID: number,
    CreatedAt: string,
    title: string,
    author: string,
    description: string,
    image_src: string,

    // UpdatedAt: string,
    // DeletedAt: string,
    // comments: []
}

const Read = (props: any) => {


    const { params } = props.match
    const id = parseInt(params.id, 10)
    const { posts, fetch_single_post } = PostContainer.useContainer()
    console.log(posts);
    const post = (posts as Array<Post>)[id]
    if (post === undefined) {
        fetch_single_post(id)
        return (
            <React.Fragment>
                <p>loading...</p>
                <p>if this page is showing a long time, page may be not exist.</p>
            </React.Fragment>
        )
    }

    return (
        <Paper>
            <br />
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Container>
                        <img src={post.image_src} alt={post.title} width="100%" />
                        <Typography variant="h4" component="h1">{post.title}</Typography>
                        <Typography variant="subtitle1" component="h2">{post.author}</Typography>
                        <Typography variant="body1" component="p">{post.description}</Typography>
                        <Typography variant="srOnly">{post.image_src}</Typography>
                        <Typography variant="srOnly">{id}</Typography>
                    </Container>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Container>
                        <CommentList post_id={id} />
                    </Container>
                </Grid>
            </Grid>
        </Paper>
    )
}

const CommentForm = () => {

}

const fetchComments = async (post_id: number) => {

}

type Comment = {
    ID: number,
    CreatedAt: string,
    author: string,
    body: string,

    // 使わないフィールド
    // post_id: number,
    // UpdatedAt: string,
    // DeletedAt: string,
}
type CommentListProps = {
    post_id: number,
}
const CommentList: React.FC<CommentListProps> = (props: CommentListProps) => {
    const [comments, setComments] = useState([] as Comment[]);
    const { post_id } = props
    useEffect(() => {
        Axios.get(`${API_ROOT}/posts/${post_id}/comments`).then(
            (res: AxiosResponse) => { setComments(res.data) }
        )
    }, [])

    return (
        <>
            <hr />
            <h3>Comments</h3>
            <div style={{ overflow: "scroll", height: 300, border: "solid 1px gray" }}>

                {comments.map((com, index) => (
                    <>
                        <Grid container style={{ margin: 10 }}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h6">{com.ID}: {com.author}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">{com.CreatedAt}</Typography>
                            </Grid>
                            <p>{com.body}</p>
                        </Grid>
                        <hr />
                    </>
                ))}

            </div>
        </>
    )
}

export default Read