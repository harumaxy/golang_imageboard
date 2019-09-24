import React, { useEffect } from "react";
import Auth0Lock from "auth0-lock"
import { Button } from "@material-ui/core";
import { IconButton, Avatar } from "@material-ui/core";



const Lock = () => {

    const lock = new Auth0Lock(
        "6bmuCVcM3yafc2vh2KJQ3P7rzhIMRHCt",
        "max-project.auth0.com",
        {
            closable: true,
            auth: {
                responseType: "token id_token",
                sso: true,
                redirectUrl: `${window.location.origin}/callback`


            },

        },
    )
    lock.on("authenticated", (authResult) => {
        const expiredAt = JSON.stringify(authResult.expiresIn * 1000) + new Date().getTime()
        localStorage.setItem("access_token", authResult.accessToken)
        localStorage.setItem("id_token", authResult.idToken)
        localStorage.setItem("expired_at", expiredAt)
        localStorage.setItem("user_info", JSON.stringify(authResult.idTokenPayload))
        console.log(authResult);
    })
    lock.on("authorization_error", (error) => {
        // error code
        console.log(error)
    })

    const user_info = isLoggedIn?(JSON.parse(localStorage.getItem("user_info") as string)) : null

    return (
        <>
            {isLoggedIn()? (
                <IconButton>
                    <Avatar srcSet={user_info.picture}/>
                </IconButton>
                
            ):(
                <Button onClick={()=>{lock.show()}}>Login</Button>
            )}
        </>
    )
}


export function isLoggedIn() {
    const expiredAt = localStorage.getItem("expired_at")
    return new Date().getTime() < parseInt(expiredAt || "0")
}

export default Lock