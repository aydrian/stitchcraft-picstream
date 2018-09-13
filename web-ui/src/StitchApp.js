import React, { Component } from 'react'
import { Stitch, GoogleRedirectCredential } from 'mongodb-stitch-browser-sdk'
import { RemoteMongoClient } from 'mongodb-stitch-browser-services-mongodb-remote'
import {
  AwsServiceClient,
  AwsRequest
} from 'mongodb-stitch-browser-services-aws'

import FileInput from './components/FileInput'

import './App.css'

const convertImageToBSONBinaryObject = file => {
  return new Promise(resolve => {
    var fileReader = new FileReader()
    fileReader.onload = event => {
      resolve({
        $binary: {
          base64: event.target.result.split(',')[1],
          subType: '00'
        }
      })
    }
    fileReader.readAsDataURL(file)
  })
}

class StitchApp extends Component {
  constructor(props) {
    super(props)
    this.appId = props.appId
    this.client = Stitch.initializeDefaultAppClient(this.appId)
    this.mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      'mongodb-atlas'
    )
    this.aws = this.client.getServiceClient(AwsServiceClient.factory, 'AWS')

    const isAuthed = this.client.auth.isLoggedIn

    this.state = {
      isAuthed
    }

    this.handleFileUpload = this.handleFileUpload.bind(this)
  }

  componentDidMount() {
    if (this.client.auth.hasRedirectResult()) {
      this.client.auth.handleRedirectResult().then(user => {
        this.setState({ isAuthed: this.client.auth.isLoggedIn })
      })
    }
  }

  handleFileUpload(file) {
    if (!file) {
      return
    }

    convertImageToBSONBinaryObject(file).then(result => {
      const picstream = this.mongodb.db('data').collection('picstream')
      const key = `${this.client.auth.user.id}-${file.name}`
      const bucket = 'stitchcraft-picstream'
      const url = `http://${bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`

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

      this.aws
        .execute(request.build())
        .then(result => {
          console.log(result)
          console.log(url)
          return picstream.insertOne({
            owner_id: this.client.auth.user.id,
            url,
            file: {
              name: file.name,
              type: file.type
            },
            ETag: result.ETag,
            ts: new Date()
          })
        })
        .then(result => {
          console.log(result)
        })
        .catch(err => {
          console.log(err)
        })
    })
  }

  render() {
    const { isAuthed } = this.state
    return (
      <div className="App">
        {isAuthed ? (
          <div>
            <h2>Your authed</h2>
            <FileInput handleFileUpload={this.handleFileUpload} />
          </div>
        ) : (
          <button
            onClick={() => {
              const credential = new GoogleRedirectCredential()
              this.client.auth.loginWithRedirect(credential)
            }}
          >
            Sign in using Google
          </button>
        )}
      </div>
    )
  }
}

export default StitchApp
