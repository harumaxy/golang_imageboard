import React, { useState } from "react"
import Axios, { AxiosResponse, AxiosError } from "axios"
import useReactRouter from "use-react-router"
import { API_ROOT } from "../setting"
import { Post } from "../models/Post"

import { Button, Typography } from "@material-ui/core"
import { useAuth0 } from "../containers/react-auth0-spa"
import { PostContainer } from "../containers/PostContainer"

export const DeleteButton: React.FC<Post> = post => {
  const { history } = useReactRouter()
  const { getTokenSilently } = useAuth0()
  const { fetch_posts } = PostContainer.useContainer()

  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const onClick = async () => {
    let token
    try {
      token = await getTokenSilently()
      console.log({ token })
    } catch (error) {
      setIsError(true)
      setErrorMsg("認証エラー")
      setSubmitted(false)
    }

    Axios.delete(`${API_ROOT}/posts/${post.ID}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res: AxiosResponse) => {
        switch (res.status) {
          case 204:
            // Postが終わったらListに戻る
            console.log("delete successed!")
            await fetch_posts()
            history.push(`/`)
            break
          case 401:
            setIsError(true)
            setErrorMsg("認証エラー")
            setSubmitted(false)
          default:
            console.log("想定していないステータスコード")
            break
        }
      })
      .catch((err: AxiosError) => {
        setIsError(true)
        setErrorMsg(err.message)
        setSubmitted(false)
      })
    history.push("/")
  }

  return (
    <>
      <Button variant="contained" color="secondary" onClick={() => onClick()} disabled={submitted}>
        Delete
      </Button>
      {isError && <Typography color="error">{errorMsg}</Typography>}
    </>
  )
}
