import React from "react"
import { AppBar, Toolbar, Typography, Link, Grid } from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"
import AuthButton from "./AuthButton"

const Appbar = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Link to="/" component={RouterLink} color="inherit" variant="h6">
          Golang_Imageboard
        </Link>
        <span id="spacer" style={{ flexGrow: 1 }} />
        <Grid container direction="row" spacing={2} alignItems="center" justify="flex-end">
          <Grid item>
            <Link to="/posts/create" component={RouterLink} color="inherit" variant="h6">
              投稿する
            </Link>
          </Grid>

          <AuthButton />
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default Appbar
