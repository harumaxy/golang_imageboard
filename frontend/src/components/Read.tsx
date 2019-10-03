import React, { useState, useEffect, ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler } from "react"
import { Container, Grid, Typography, Hidden, Paper, Grow, Input, InputAdornment, Avatar } from "@material-ui/core";
import { TextField, Button, FormControl, InputLabel } from "@material-ui/core";
import { AccountCircle } from '@material-ui/icons';

import { PostContainer } from "../containers/PostContainer"
import { string } from "prop-types";
import Axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { API_ROOT } from '../setting'

import { isLoggedIn } from '../utils/isLoggedIn'


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
                        <Typography variant="body1" component="p" style={{ whiteSpace: "pre-line" }}>{post.description}</Typography>
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
    const update = () => {
        Axios.get(`${API_ROOT}/posts/${post_id}/comments`).then(
            (res: AxiosResponse) => { setComments(res.data) }
        )
    }

    useEffect(() => {
        update()
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
                                <Typography variant="h6">{index + 1}: {com.author}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2">{com.CreatedAt}</Typography>
                            </Grid>
                            <p style={{ whiteSpace: "pre-line" }}>{com.body}</p>
                        </Grid>
                        <hr />
                    </>
                ))}
            </div>
            <Container>
                <CommentForm post_id={post_id} update={update} />
            </Container>
        </>
    )
}

type CommentFormProps = {
    post_id: number,
    update: () => void,
}

const CommentForm: React.FC<CommentFormProps> = (props: CommentFormProps) => {
    const user_info = isLoggedIn ? (JSON.parse(localStorage.getItem("user_info") as string)) : null
    const [author, setAuthor] = useState(user_info.name || "no name")
    const [body, setBody] = useState("")


    const { post_id, update } = props

    const handleSubmit: FormEventHandler = (e: FormEvent) => {
        e.preventDefault()
        setBody("")
        Axios.post(`${API_ROOT}/posts/${post_id}/comments`,
            {
                post_id: post_id,
                author: author,
                body: body
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("id_token")}`,
                }
            }
        ).then(
            () => { update(); alert("submitted") }
        )
    }

    const handleChange: ChangeEventHandler = (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement
        switch (target.name) {
            case "author":
                setAuthor(target.value)
                break
            case "body":
                setBody(target.value)
                break
            default:
                console.log("Impossible change event");
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center" style={{ padding: 10 }}>
                    <Grid item xs={1}>
                        <Avatar
                            alt={user_info.name}
                            srcSet={user_info.picture}
                        />
                    </Grid>
                    <Grid item xs={9}>
                        <TextField
                            label="comment"
                            name="body"
                            onChange={handleChange}
                            value={body}
                            multiline
                            rows="2"
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}


export default Read