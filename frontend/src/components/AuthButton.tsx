import React, { useEffect, useState } from "react";
import Auth0Lock from "auth0-lock"
import { Button } from "@material-ui/core";
import { IconButton, Avatar } from "@material-ui/core";

import {isLoggedIn} from '../utils/isLoggedIn'
import {AUTH0_DOMAIN, AUTH0_CLIENT_ID} from '../setting'


const Lock = () => {
    const [loading, setLoading] = useState(false)
    const user_info = isLoggedIn?(JSON.parse(localStorage.getItem("user_info") as string)) : null
    
    const lock = new Auth0Lock(
        AUTH0_CLIENT_ID,
        AUTH0_DOMAIN,
        {
            closable: true,
            auth: {
                responseType: "token id_token",
                sso: true,
                redirectUrl: `${window.location.origin}`
            },
    
        },
    )
    lock.on("authenticated", (authResult) => {
        const expiredAt = authResult.expiresIn * 1000 + new Date().getTime()
        localStorage.setItem("access_token", authResult.accessToken)
        localStorage.setItem("id_token", authResult.idToken)
        localStorage.setItem("expired_at", expiredAt.toString())
        localStorage.setItem("user_info", JSON.stringify(authResult.idTokenPayload))
        console.log(authResult);
        // 認証情報をlocalStorageに保存したあとに再レンダリングする。
        setLoading(true)
    })
    lock.on("authorization_error", (error) => {
        // error code
        console.log(error)
    })


    return (
        <>
            {isLoggedIn()? (
                <IconButton>
                    <Avatar alt={user_info.nickname} srcSet={user_info.picture}/>
                </IconButton>
                
            ):(
                <Button onClick={()=>{lock.show()}} color="inherit" >Login</Button>
            )}
        </>
    )
}

export default Lock