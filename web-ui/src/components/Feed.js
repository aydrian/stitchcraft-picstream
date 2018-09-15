import React from 'react'
import { Card } from 'semantic-ui-react'

const Feed = ({ entries }) => {
  return (
    <Card.Group itemsPerRow={3}>
      {entries.length > 0 ? (
        entries.map(entry => {
          return <Card image={entry.url} key={entry._id} />
        })
      ) : (
        <Card header="No Entries Found ☹️" />
      )}
    </Card.Group>
  )
}

export default Feed
