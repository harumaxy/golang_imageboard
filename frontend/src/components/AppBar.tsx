import React from "react"
import { AppBar, Toolbar, Typography } from "@material-ui/core"
import AuthButton from "./AuthButton";

const Appbar = ()=>{
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography variant="h6" style={{flexGrow: 1}}>
                    Golang_Imageboard
                </Typography>
                <AuthButton/>
            </Toolbar>
        </AppBar>
    )
}

export default Appbar