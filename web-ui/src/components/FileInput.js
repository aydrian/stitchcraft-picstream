import React, { Component } from 'react'

class FileInput extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.fileInput = React.createRef()
    this.handleFileUpload = props.handleFileUpload
  }

  handleSubmit(event) {
    event.preventDefault()
    const file = this.fileInput.current.files[0]
    console.log(`Selected file - ${file.name}`)
    this.handleFileUpload(file)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input type="file" ref={this.fileInput} />
        </label>
        <br />
        <button type="submit">Upload</button>
      </form>
    )
  }
}

export default FileInput
