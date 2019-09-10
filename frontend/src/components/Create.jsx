import React from "react"
import axios from "axios"
import { Button, TextField, Grid, Container, Paper, FormGroup, FormControl } from "@material-ui/core"





const API_ROOT = "http://localhost:8080"

class CreateForm extends React.Component {
    state = {
        submitted: false,
        formData: {
            title: "",
            author: "no name",
            description: "",
            image_src: "",
            image_file: new Blob(),
        }
    }

    constructor(props) {
        super(props)
        this.history = props.history
    }


    handleSubmit = async (event) => {
        event.preventDefault()
        this.setState({ submitted: true })
        const { formData } = this.state
        const submitData = new FormData()

        submitData.append("title", formData.title)
        submitData.append("author", formData.author)
        submitData.append("description", formData.description)
        submitData.append("image_src", formData.image_src)
        submitData.append("upload", formData.image_file)
        
        const res = await axios.post(`${API_ROOT}/posts`, submitData,
            {
                headers: {
                'content-type': 'multipart/form-data',
            },
          })
        this.history.push(`${API_ROOT}/posts`)

    }
    handleChange = (event) => {
        const { formData } = this.state
        formData[event.target.name] = event.target.value
        if(event.target.name == "image_file"){
            console.log(event.target.value);
            
        }
        this.setState(formData)
    }
    handleFileChange = (event, cb, filename)=>{
        

    }

    render = () => {
        const { formData, submitted } = this.state
        return (
            <Paper>
                <Grid container justify="flex-start">
                    <form encType="multipart/form-data"  onSubmit={this.handleSubmit} autoComplete="off" style={{ margin: 20, width: "100%" }}>
                        <h1>画像を投稿</h1>

                        <TextField
                            required
                            label="Title"
                            name="title"
                            onChange={this.handleChange}
                            value={this.state.formData.title}
                            variant="outlined"
                        />
                        <br />
                        <br />


                        <TextField
                            label="Author"
                            name="author"
                            onChange={this.handleChange}
                            value={this.state.formData.author}
                            variant="outlined"
                        />
                        <br />
                        <br />
                        <TextField
                            label="Description"
                            name="description"
                            onChange={this.handleChange}
                            value={this.state.formData.description}
                            multiline
                            rows="4"
                            fullWidth
                            variant="outlined"
                        />
                        <br />
                        <br />
                        <TextField
                            label="image_src"
                            name="image_src"
                            onChange={this.handleChange}
                            value={this.state.formData.image_src}
                            variant="outlined"
                            fullWidth
                        />
                        <br />
                        <br />
                        <input type="file" name="image_file" value={this.state.image_file} onChange={this.handleChange} accept="image/*" />
                        
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