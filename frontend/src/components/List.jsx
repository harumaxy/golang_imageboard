import React, { useEffect, useState } from "react"
import { PostContainer } from "../containers/PostContainer"
import _ from "lodash"
import { Paper, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button, Container, GridList, GridListTile, ListSubheader, GridListTileBar, IconButton, Link, Grid } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

import Pagination from "material-ui-flat-pagination"



export default  () => {
    const { posts, fetch_posts } = PostContainer.useContainer({})
    const [offset, setOffset] = useState(0)
    const [perPage, setPerPage] = useState(9)
    

    useEffect(() => {
        fetch_posts()
    }, [])

    return (
        <React.Fragment>
        <LayoutGrid posts={posts} offset={offset} perPage={perPage}/>
        <br/>
        <br/>
        <br/>
        <Pagination
            limit={perPage}
            offset={offset}
            total={Object.keys(posts).length}
            onClick={(e, o)=>{setOffset(o)}}

        />
        </React.Fragment>
    )
}

const LayoutGrid = ({posts, offset, perPage}) => {
    console.log(posts);
    
    const begin = Object.keys(posts).length - offset
    const range = _.filter(posts, (_, index)=>{return (begin >= index && index > begin - perPage)}).reverse()


    return (
        <Grid container spacing={2} >
            {_.map(range, (post) => {
                return (
                    <Grid item xs={12} sm={4} key={post.ID} alignItems="stretch">
                        <Card >
                            <CardContent>
                                <Link to={`/posts/${post.ID}`} component={RouterLink}>
                                    <CardMedia image={post.image_src} component="img" alt={post.title} height={(window.innerHeight) / 4} />
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
                    </Grid>
                )
            })}
        </Grid>
    )
}



