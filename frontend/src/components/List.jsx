import React, { useEffect } from "react"
import { PostContainer } from "../containers/PostContainer"
import _ from "lodash"
import { Paper, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button, Container, GridList, GridListTile, ListSubheader, GridListTileBar, IconButton, Link, Grid } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";


import InfoIcon from "@material-ui/icons/Info";

import dummy_img from './dummy.jpeg'

const List = () => {
    const { posts, fetch_posts } = PostContainer.useContainer()
    useEffect(() => {
        fetch_posts()
    }, [])
    return (
        LayoutGrid(posts)
    )
}

const LayoutGrid = (posts) => {
    return (
        <Grid container spacing={2} >
            {_.map(posts, (post) => (
                <Grid item xs={12} sm={4}>
                    {renderCard(post)}
                </Grid>
            ))}
        </Grid>
    )
}


// GridTileスタイル
const LayoutGridTile = (posts) => {
    return (

        <Paper>
            <GridList cols={3} cellHeight="auto">
                <GridListTile key="SubHeader" cols={3}>
                    <ListSubheader component="div">Posts</ListSubheader>
                </GridListTile>

                {_.map(posts, (post) => (
                    <GridListTile cols={1}>
                        {renderCard(post)}
                    </GridListTile>
                ))}
            </GridList>
        </Paper>

    )
}

const renderCard = (post) => (
    <Card>
        <CardContent>
            <Link to={`/posts/${post.ID}`} component={RouterLink}>
                <CardMedia image={post.image_src} component="img" alt={post.title} />
            </Link>
            <Link to={`/posts/${post.ID}`} component={RouterLink}>
                <Typography gutterBottom variant="h5" component="h2">
                    {post.title}
                </Typography>
            </Link>
            <Typography variant="body2" color="textSecondary" component="p">
                {post.description || "nothing"}
            </Typography>
        </CardContent>
    </Card>
)

export default () => {
    return (
        <PostContainer.Provider>
            <List />
        </PostContainer.Provider>
    )
}