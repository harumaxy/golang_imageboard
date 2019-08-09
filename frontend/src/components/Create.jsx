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
            image_src: ""
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
        const res = await axios.post(`${API_ROOT}/posts`, {
            title: formData.title,
            author: formData.author,
            description: formData.description,
            image_src: formData.image_src
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
                    <form onSubmit={this.handleSubmit} autoComplete="off" style={{ margin: 20, width: "100%" }}>


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