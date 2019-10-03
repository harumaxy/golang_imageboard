import React from "react"
import { AppBar, Toolbar, Typography, Link } from "@material-ui/core"
import { Link as RouterLink } from 'react-router-dom'
import AuthButton from "./AuthButton";

const Appbar = () => {
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Link to="/" component={RouterLink} color="inherit" variant="h6" style={{flexGrow: 1}}>
                    Golang_Imageboard
                </Link>
                <AuthButton />
            </Toolbar>
        </AppBar>
    )
}

export default Appbar