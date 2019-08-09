import React from "react"
import { Container, Grid , Typography, Hidden, Paper} from "@material-ui/core";
import { PostContainer } from "../containers/PostContainer"

const Read = (props) => {
    console.log(props);
    console.log(props.props);


    const { params } = props.match
    const id = parseInt(params.id, 10)
    const { posts, fetch_single_post } = PostContainer.useContainer()
    console.log(posts);
    const post = posts[id]
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

export default Read