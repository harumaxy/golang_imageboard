import React from "react"
import { AppBar, Toolbar, Typography, Link } from "@material-ui/core"
import { Link as RouterLink } from 'react-router-dom'
import AuthButton from "./AuthButton";

const Appbar = () => {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Link to="/" component={RouterLink} color="inherit" variant="h6">
                    Golang_Imageboard
                </Link>
                <span id="spacer" style={{flexGrow: 1}}/>
                <AuthButton />
            </Toolbar>
        </AppBar>
    )
}

export default Appbar