import React, { Component } from 'react'
import { Input } from 'semantic-ui-react'

class FileInput extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.fileInput = React.createRef()
    this.handleFileUpload = props.handleFileUpload
  }

  handleSubmit(event) {
    event.preventDefault()
    const file = this.fileInput.current.inputRef.files[0]
    console.log(`Selected file - ${file.name}`)
    this.handleFileUpload(file)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          type="file"
          action={{
            color: 'blue',
            labelPosition: 'left',
            icon: 'cloud upload',
            content: 'Upload',
            role: 'submit',
            size: 'small'
          }}
          ref={this.fileInput}
          size="small"
        />
      </form>
    )
  }
}

export default FileInput
