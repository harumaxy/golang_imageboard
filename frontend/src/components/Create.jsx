import React from "react"
import axios from "axios"
import { Button, TextField, Grid, Container, Paper, FormGroup, FormControl } from "@material-ui/core"
import {API_ROOT} from "../setting"
import { isLoggedIn } from "../utils/isLoggedIn"


class CreateForm extends React.Component {

    state = {
        submitted: false,
        formData: {
            title: "",
            author: "no name",
            description: "",
            image_src: "",
        },
    }

    constructor(props) {
        super(props)
        this.history = props.history
        this.fileInput = React.createRef()
        if (isLoggedIn()){
            const { formData } = this.state
            formData["author"] = JSON.parse(localStorage.getItem("user_info")).name
            this.setState(formData)
            
        }
        
        
    }


    handleSubmit = async (event) => {
        event.preventDefault()
        this.setState({ submitted: true })
        const { formData } = this.state
        const submitData = new FormData()

        submitData.append("formData", JSON.stringify(formData))
        submitData.append("image", this.fileInput.current.files[0])
        console.log(this.fileInput.current.files[0])
        await axios.post(`${API_ROOT}/posts`, submitData,
            {
                headers: {
                'content-type': 'multipart/form-data',
                "Authorization": `Bearer ${localStorage.getItem("id_token")}`,
            },
          })
        this.history.push(`${API_ROOT}/posts`)
    }
    handleChange = (event) => {
        const { formData } = this.state
        formData[event.target.name] = event.target.value
        this.setState(formData)
    }

    

    render = () => {
        const { formData, submitted } = this.state
        return (
            <Paper>
                <Grid container justify="flex-start">
                    <form encType="multipart/form-data"  onSubmit={this.handleSubmit} autoComplete="off" style={{ margin: 20, width: "100%" }}>
                        <h1>画像を投稿</h1>

                        <TextField required label="Title" name="title" onChange={this.handleChange} value={this.state.formData.title} variant="outlined" />
                        <br />
                        <br />
                        <TextField label="Author" name="author" onChange={this.handleChange} value={this.state.formData.author} variant="outlined"/>
                        <br />
                        <br />
                        <TextField label="Description" name="description" onChange={this.handleChange} value={this.state.formData.description} multiline
                            rows="4" fullWidth variant="outlined"/>
                        <br />
                        <br />
                        {/* <TextField label="image_src" name="image_src" onChange={this.handleChange} value={this.state.formData.image_src} variant="outlined" fullWidth/> */}
                        <br />
                        <br />
                        <input type="file" name="image" ref={this.fileInput} accept="image/*" />
                        
                        <Button type="submit" variant="contained" color="primary" disabled={submitted}>
                            Submit
                </Button>
                    </form>
                </Grid>
            </Paper>
        )
    }

}

export default CreateForm
