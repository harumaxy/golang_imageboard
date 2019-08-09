import React, { useEffect } from "react"
import { PostContainer } from "../containers/PostContainer"
import _ from "lodash"
import { Paper, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button, Container, GridList, GridListTile, ListSubheader, GridListTileBar, IconButton } from "@material-ui/core";

import InfoIcon from "@material-ui/icons/Info";

import dummy_img from './dummy.jpeg'

const List = () => {
    const { posts, fetch_posts } = PostContainer.useContainer()
    useEffect(() => {
        fetch_posts()
    }, [])
    return (
        LayoutCard(posts)
    )
}

const LayoutGrid = (posts) => {
    return (
        <Paper>
            <GridList cellHeight={300} cols={3}>
                <GridListTile key="SubHeader" style={{ height: "auto" }} cols={3}>
                    <ListSubheader component="div">Posts</ListSubheader>
                </GridListTile>

                {_.map(posts, (post) => (
                    <GridListTile key={post.image_src}>
                        <img src={post.image_src} alt={post.title} />
                        <GridListTileBar
                            title={post.title}
                            subtitle={<span>by: {post.author}</span>}
                            actionIcon={
                                <IconButton aria-label={`info about ${post.title}`} style={{ color: "white" }}>
                                    <InfoIcon />
                                </IconButton>
                            }
                        />
                    </GridListTile>
                ))}
            </GridList>
        </Paper>
    )
}


// Cardスタイル
const LayoutCard = (posts) => {
    return (
        <Paper>
            <GridList cols={3} cellHeight="auto">
                <GridListTile key="SubHeader" cols={3}>
                    <ListSubheader component="div">Posts</ListSubheader>
                </GridListTile>

                {_.map(posts, (post)=>(
                    <GridListTile cols={1}>
                        {renderCard(post)}
                    </GridListTile>
                ))}
            </GridList>
        </Paper>
    )
}

const renderCard = (post)=>(
    <Card>
        <CardContent>
            <CardMedia image={dummy_img} component="img" alt={post.title}/>
            <Typography gutterBottom variant="h5" component="h2">
                {post.title}
            </Typography>
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