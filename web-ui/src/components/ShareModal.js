import React, { Component } from 'react'
import { Button, Modal, Icon, Form, Header } from 'semantic-ui-react'

class ShareModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      shareWithInput: ''
    }
  }

  render() {
    const { entry, share } = this.props
    const trigger = (
      <Button animated="vertical" onClick={() => this.setState({ open: true })}>
        <Button.Content hidden>Share</Button.Content>
        <Button.Content visible>
          <Icon name="send" />
        </Button.Content>
      </Button>
    )

    return (
      <Modal
        trigger={trigger}
        onClose={() => this.setState({ open: false })}
        open={this.state.open}
      >
        <Modal.Header>Share</Modal.Header>
        <Modal.Content>
          <Header>Share via Email</Header>
          <Form
            onSubmit={() => {
              share(entry, this.state.shareWithInput)
                .then(result => {
                  console.log(result)
                  this.setState({
                    open: false,
                    shareWithInput: ''
                  })
                })
                .catch(err => {
                  console.log(err)
                })
            }}
          >
            <Form.Input
              fluid
              name="shareWithInput"
              action="Share"
              placeholder="someone@example.com"
              value={this.state.shareWithInput}
              onChange={(e, { name, value }) =>
                this.setState({ [name]: value })
              }
            />
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

export default ShareModal
