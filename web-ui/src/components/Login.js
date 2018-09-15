import React from 'react'
import { Segment, Icon, Button } from 'semantic-ui-react'

const Login = ({ loginUser }) => {
  return (
    <Segment.Group>
      <Segment textAlign="center">
        <Button
          onClick={() => {
            loginUser()
          }}
          color="google plus"
        >
          <Icon name="google" />
          Log In with Google
        </Button>
      </Segment>
    </Segment.Group>
  )
}

export default Login
