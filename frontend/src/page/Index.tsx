import React, { useEffect, useState } from "react"
import { PostContainer } from "../containers/PostContainer"
import _ from "lodash"
import { Card, CardMedia, CardContent, Typography, Link, Grid } from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"

import Pagination from "material-ui-flat-pagination"
import { Post } from "../models/Post"

export default () => {
  const { posts, fetch_posts } = PostContainer.useContainer()
  const [offset, setOffset] = useState(0)
  const [perPage, setPerPage] = useState(9)

  useEffect(() => {
    fetch_posts()
  }, [])

  console.log(posts)

  return (
    <React.Fragment>
      <LayoutGrid posts={posts} offset={offset} perPage={perPage} />
      <br />
      <br />
      <br />
      <Pagination
        limit={perPage}
        offset={offset}
        total={posts.length}
        onClick={(e, o) => {
          setOffset(o)
        }}
      />
    </React.Fragment>
  )
}

const LayoutGrid: React.FC<{ posts: Post[]; offset: number; perPage: number }> = ({ posts, offset, perPage }) => {
  const tail = posts.length - offset * perPage
  const head = tail - (offset + 1) * perPage

  // tail番目は含まず、直前までスライスする
  const shows = posts.slice(head < 0 ? 0 : head, tail).reverse()

  return (
    <Grid container spacing={2}>
      {shows.map(post => {
        return (
          <Grid item xs={12} sm={4} key={post.ID}>
            <Card>
              <CardContent>
                <Link to={`/posts/${post.ID}`} component={RouterLink}>
                  <CardMedia src={`https://${post.image_src}`} component="img" alt={post.title} height={window.innerHeight / 4} />
                </Link>
                <Link to={`/posts/${post.ID}`} component={RouterLink}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {post.title}
                  </Typography>
                </Link>
                <Typography variant="body2" color="textSecondary" component="p">
                  Posted by {post.author}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )
}
