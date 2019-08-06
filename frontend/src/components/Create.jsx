import React from "react"
import axios from "axios"
import { Button, TextField } from "@material-ui/core"





const API_ROOT = "http://localhost:8080"

export default class CreateForm extends React.Component {
    state = {
        submitted: false,
        formData: {
            title: "",
            author: "no name",
            description: "",
            image_src: ""
        }
    }


    handleSubmit = async (event)=>{
        event.preventDefault()
        this.setState({submitted: true})
        const {formData} = this.state
        const res = await axios.post(`${API_ROOT}/posts`, {
            title: formData.title,
            author: formData.author,
            description: formData.description,
            image_src: formData.image_src
        })
        this.props.history.push(`${API_ROOT}/posts`)
        
    }
    handleChange = (event)=>{
        const {formData} = this.state
        formData[event.target.name] = event.target.value
        this.setState(formData)
    }

    render = ()=> {
        const {formData, submitted} = this.state
        return (
            <form onSubmit={this.handleSubmit} autoComplete="off" >
                <TextField
                    required
                    label="Title"
                    name="title"
                    onChange={this.handleChange}
                    value={this.state.formData.title}
                />
                <br/>
                <TextField
                    label="Author"
                    name="author"
                    onChange={this.handleChange}
                    value={this.state.formData.author}
                />
                <br/>
                <TextField
                    label="Description"
                    name="description"
                    onChange={this.handleChange}
                    value={this.state.formData.description}
                    multiline
                    rows="4"
                />
                <br/>
                <TextField
                    label="image_src"
                    name="image_src"
                    onChange={this.handleChange}
                    value={this.state.formData.image_src}
                />
                <br/>
                <Button type="submit" variant="contained" color="primary" disabled={submitted}>
                    Submit
                </Button>
            </form>
        )
        }
    
}