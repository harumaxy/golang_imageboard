import React, { useState, FormEventHandler, FormEvent, ChangeEventHandler, ChangeEvent, useEffect } from "react"
import axios from "axios"
import { Button, TextField, Grid, Container, Paper, FormGroup, FormControl, CircularProgress } from "@material-ui/core"
import { API_ROOT } from "../setting"
import { isLoggedIn } from "../utils/isLoggedIn"
import { History } from "history"
import src from "*.jpeg"
import { For } from "@babel/types"


import { Modal, Backdrop } from '@material-ui/core'

type FormProps = {
    history: History
}

const Form: React.FC<FormProps> = ({ history }) => {
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("no name")
    const [description, setDescription] = useState("")
    const [imagePreviewSrc, setImagePreviewSrc] = useState("")
    const [imageFile, setImageFile] = useState(new File([], ""))
    const [submitted, setSubmitted] = useState(false)
    const fileInput = React.createRef<HTMLInputElement>()

    useEffect(() => {
        if (isLoggedIn()) {
            const user_info = JSON.parse(localStorage.getItem("user_info") || "{'nickname': 'no name'}")
            setAuthor(user_info.nickname)
        }
    }, [])


    const handleSubmit: FormEventHandler = async (event: FormEvent) => {
        event.preventDefault()
        setSubmitted(true)

        // post用のmultipart/form-dataを用意
        const submitData = new FormData()
        submitData.append("formData", JSON.stringify({ title, author, description, }))
        submitData.append("image", imageFile)

        // Postリクエスト
        await axios.post(`${API_ROOT}/posts`, submitData,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    "Authorization": `Bearer ${localStorage.getItem("id_token")}`,
                },
            })
        // Postが終わったらListに戻る
        history.push(`${API_ROOT}/posts`)
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
                    <h1>画像を投稿</h1>

                    <TextField required label="Title" name="title" onChange={handleChange} value={title} variant="outlined" />
                    <br />
                    <br />
                    <TextField label="Author" name="author" onChange={handleChange} value={author} variant="outlined" />
                    <br />
                    <br />
                    <TextField label="Description" name="description" onChange={handleChange} value={description} multiline
                        rows="4" fullWidth variant="outlined" />
                    <br />
                    <br />
                    <input type="file" name="image" accept="image/*"
                        onChange={handleChangeFile} ref={fileInput} />

                    <br />
                    <img src={imagePreviewSrc} style={{ width: "80%" }} />
                    <br />
                    <Button type="submit" variant="contained" color="primary" disabled={submitted}>
                        Submit
                    </Button>
                </form>
            </Grid>
            {/* ローディング用のモーダル */}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={submitted}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 0,
                  }}
                disableAutoFocus={true}
                disableEnforceFocus={true}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <CircularProgress size={100} variant="indeterminate" />
            </Modal>
        </Paper>
    )

}

export default Form
