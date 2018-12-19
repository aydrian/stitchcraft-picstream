import React, { Component } from 'react'
import { Header, Icon, Container, Menu, Image } from 'semantic-ui-react'
import {
  Stitch,
  GoogleRedirectCredential,
  RemoteMongoClient
} from 'mongodb-stitch-browser-sdk'
import {
  AwsServiceClient,
  AwsRequest
} from 'mongodb-stitch-browser-services-aws'
import BSON from 'bson'

import Login from './components/Login'
import FileInput from './components/FileInput'
import Feed from './components/Feed'

const convertImageToBSONBinaryObject = file => {
  return new Promise(resolve => {
    var fileReader = new FileReader()
    fileReader.onload = event => {
      var eventBinary = new BSON.Binary(new Uint8Array(event.target.result))
      resolve(eventBinary)
    }
    fileReader.readAsArrayBuffer(file)
  })
}

class StitchApp extends Component {
  constructor(props) {
    super(props)
    this.appId = props.appId
    if (!Stitch.hasAppClient(this.appId)) {
      this.client = Stitch.initializeDefaultAppClient(this.appId)
    }

    this.mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      'mongodb-atlas'
    )
    this.aws = this.client.getServiceClient(AwsServiceClient.factory, 'AWS')

    const isAuthed = this.client.auth.isLoggedIn

    this.state = {
      isAuthed,
      entries: []
    }

    this.handleFileUpload = this.handleFileUpload.bind(this)
  }

  componentDidMount() {
    if (this.client.auth.hasRedirectResult()) {
      this.client.auth.handleRedirectResult().then(user => {
        this.setState({ isAuthed: this.client.auth.isLoggedIn })
      })
    }

    if (this.client.auth.isLoggedIn) {
      this.getEntries()
    }
  }

  login = async (type, { email, password } = {}) => {
    const { isAuthed } = this.state

    if (isAuthed) {
      return
    }

    this.client.auth.loginWithRedirect(new GoogleRedirectCredential())
  }

  logout = async () => {
    this.client.auth.logout()
    this.setState({ isAuthed: false })
  }

  getEntries = async () => {
    this.mongodb
      .db('data')
      .collection('picstream')
      .find({}, { sort: { ts: -1 } })
      .asArray()
      .then(entries => {
        this.setState({ entries })
      })
  }

  handleFileUpload(file) {
    if (!file) {
      return
    }

    const key = `${this.client.auth.user.id}-${file.name}`
    const bucket = 'stitchcraft-picstream'
    const url = `http://${bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`

    return convertImageToBSONBinaryObject(file)
      .then(result => {
        // AWS S3 Request
        const args = {
          ACL: 'public-read',
          Bucket: bucket,
          ContentType: file.type,
          Key: key,
          Body: result
        }

        const request = new AwsRequest.Builder()
          .withService('s3')
          .withAction('PutObject')
          .withRegion('us-east-1')
          .withArgs(args)
          .build()

        return this.aws.execute(request)
      })
      .then(result => {
        console.log(result)
        // MongoDB Request
        const picstream = this.mongodb.db('data').collection('picstream')
        return picstream.insertOne({
          owner_id: this.client.auth.user.id,
          owner_name: this.client.auth.user.profile.name,
          url,
          file: {
            name: file.name,
            type: file.type
          },
          s3: {
            bucket,
            key,
            ETag: result.ETag
          },
          ts: new Date()
        })
      })
      .then(result => {
        console.log(result)
        this.getEntries()
      })
      .catch(console.error)
  }

  share = async (entry, email) => {
    const args = {
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
                <h1>Enjoy this pic!</h1>
                <img src="${entry.url}" />
               `
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `Picture shared by ${entry.owner_name}`
        }
      },
      Source: 'picstream@ses.aydrian.me'
    }

    const request = new AwsRequest.Builder()
      .withService('ses')
      .withAction('SendEmail')
      .withRegion('us-east-1')
      .withArgs(args)
      .build()

    return this.aws.execute(request)
  }

  render() {
    const { isAuthed } = this.state
    return (
      <Container>
        <Header as="h2" icon textAlign="center">
          <Icon name="camera retro" circular />
          <Header.Content>PicStream</Header.Content>
          <Header.Subheader>
            Built using MongoDB Stitch and AWS S3
          </Header.Subheader>
        </Header>
        {isAuthed ? (
          <div>
            <Menu>
              <Menu.Item>
                <Image src={this.client.auth.user.profile.pictureUrl} avatar />
                Welcome, {this.client.auth.user.profile.firstName}
              </Menu.Item>
              <Menu.Item>
                <FileInput handleFileUpload={this.handleFileUpload} />
              </Menu.Item>
              <Menu.Item
                position="right"
                content="Logout"
                onClick={() => {
                  this.logout()
                }}
              />
            </Menu>
            <Feed entries={this.state.entries} share={this.share} />
          </div>
        ) : (
          <Login loginUser={this.login} />
        )}
      </Container>
    )
  }
}

export default StitchApp
