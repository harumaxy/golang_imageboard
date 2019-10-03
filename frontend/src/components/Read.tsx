import React, {useState, useEffect, ReactNode} from "react"
import { Container, Grid , Typography, Hidden, Paper} from "@material-ui/core";
import { PostContainer } from "../containers/PostContainer"
import { string } from "prop-types";
import Axios, { AxiosResponse } from "axios";
import {API_ROOT} from '../setting'


type Post = {
    ID: number,
    CreatedAt: string,
    title: string,
	author: string,
	description: string,
	image_src: string,
	comments: {}[]
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
        <Container>
            <img src={post.image_src} alt={post.title} width="100%"/>
            <Typography variant="h4" component="h1">{post.title}</Typography>
            <Typography variant="subtitle1" component="h2">{post.author}</Typography>
            <Typography variant="body1" component="p">{post.description}</Typography>
            <Typography variant="srOnly">{post.image_src}</Typography>
            <Typography variant="srOnly">{id}</Typography>
        </Container>
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


}
type CommentListProps = {
    post_id: number,
    CreatedAt: string,
}
const CommentList: React.FC<CommentListProps> = (props: CommentListProps) => {
    const [comments, setComments] = useState([]);
    const { post_id } = props
    useEffect(() => {
        Axios.get(`${API_ROOT}/${post_id}/comments`).then(
            (res: AxiosResponse) => {setComments(res.data)}
        )
    }, [])
    
    return(
        <>
        

        </>
    )
}

export default Read