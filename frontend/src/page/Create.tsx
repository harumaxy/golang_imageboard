import React, { useState, FormEventHandler, FormEvent, ChangeEventHandler, ChangeEvent, useEffect } from "react"
import axios, { AxiosError, AxiosResponse } from "axios"
import { API_ROOT } from "../setting"
import { History } from "history"
import { Backdrop, Paper, Grid, TextField, Button, Typography, Modal, CircularProgress } from "@material-ui/core"

import { useAuth0 } from "../containers/react-auth0-spa"

type FormProps = {
  history: History
}

type Auth0_Data = {
  isAuthenticated: boolean
  user: any
  getTokenSilently: any
  getIdTokenClaims: any
}

const Form: React.FC<FormProps> = ({ history }) => {
  const { isAuthenticated, user, getTokenSilently, getIdTokenClaims } = useAuth0() as Auth0_Data

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("no name")
  const [description, setDescription] = useState("")
  const [imagePreviewSrc, setImagePreviewSrc] = useState("")
  const [imageFile, setImageFile] = useState(new File([], ""))
  const [submitted, setSubmitted] = useState(false)
  const fileInput = React.createRef<HTMLInputElement>()
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (isAuthenticated && user !== undefined) {
      setAuthor(user.nickname)
    }
  }, [isAuthenticated, user])

  const handleSubmit: FormEventHandler = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)

    // post用のmultipart/form-dataを用意
    const submitData = new FormData()
    submitData.append("formData", JSON.stringify({ title, author, description }))
    submitData.append("image", imageFile)

    let token
    // Auth0 JWTを取得
    try {
      token = await getTokenSilently()
      console.log({ token })
    } catch (error) {
      setIsError(true)
      setErrorMsg("認証エラー")
      setSubmitted(false)
    }
    // Postリクエスト
    axios
      .post(`${API_ROOT}/posts`, submitData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        validateStatus: status => {
          return status === 201 || status == 401
        }
      })
      .then((res: AxiosResponse) => {
        switch (res.status) {
          case 201:
            // Postが終わったらListに戻る
            console.log("successed!")
            history.push(`${API_ROOT}/posts`)
            break
          case 401:
            setIsError(true)
            setErrorMsg("認証が切れているか、ログインしていません。右上のボタンでログインし直してください。")
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
  }

  // 発生したイベントに応じて、値を変更する
  const handleChange: ChangeEventHandler = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement
    switch (target.name) {
      case "title":
        setTitle(target.value)
        break
      case "author":
        setAuthor(target.value)
        break
      case "description":
        setDescription(target.value)
        break
    }
  }

  const handleChangeFile = (e: ChangeEvent) => {
    const files = (fileInput.current as HTMLInputElement).files as FileList
    let file = files[0]
    console.log(file)

    if (file === undefined) {
      return
    }
    let reader = new FileReader()
    reader.onload = () => {
      setImageFile(file)
      setImagePreviewSrc(reader.result as string)
    }

    reader.readAsDataURL(file)
  }

  return (
    <Paper>
      <Grid container justify="flex-start">
        <form encType="multipart/form-data" onSubmit={handleSubmit} autoComplete="off" style={{ margin: 20, width: "100%" }}>
          <Typography variant="h4" component="h1">
            画像を投稿
          </Typography>
          <br />

          <TextField required label="Title" name="title" onChange={handleChange} value={title} variant="outlined" />
          <br />
          <br />
          <TextField label="Author" name="author" onChange={handleChange} value={author} variant="outlined" />
          <br />
          <br />
          <TextField label="Description" name="description" onChange={handleChange} value={description} multiline rows="4" fullWidth variant="outlined" />
          <br />
          <br />
          <input type="file" name="image" accept="image/*" onChange={handleChangeFile} ref={fileInput} required />

          <br />
          <img src={imagePreviewSrc} style={{ width: "80%" }} />
          <br />
          <Button type="submit" variant="contained" color="primary" disabled={submitted}>
            Submit
          </Button>
          {isError ? (
            <Typography variant="h6" color="error">
              {errorMsg}
            </Typography>
          ) : null}
        </form>
      </Grid>
      <LoadingModal isSubmitted={submitted} />
    </Paper>
  )
}

interface LMProps {
  isSubmitted: boolean
}

const LoadingModal: React.FC<LMProps> = ({ isSubmitted }) => (
  <Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
    open={isSubmitted}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: 0
    }}
    disableAutoFocus={true}
    disableEnforceFocus={true}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500
    }}
  >
    <CircularProgress size={100} variant="indeterminate" style={{ outline: 0 }} />
  </Modal>
)

export default Form
