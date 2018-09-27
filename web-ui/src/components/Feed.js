import React from 'react'
import { Card, Image } from 'semantic-ui-react'
import moment from 'moment'

import ShareModal from './ShareModal'

const formatDate = date => {
  date = moment(date)
  let str = ''
  if (date.isBefore(moment().add(7, 'days'), 'day')) {
    str = date.fromNow()
  } else if (date.isSame(moment(), 'year')) {
    str = date.format('MMMM D')
  } else {
    str = date.format('MMMM D, YYYY')
  }
  return str.toUpperCase()
}

const Feed = ({ entries, share }) => {
  return (
    <Card.Group itemsPerRow={3}>
      {entries.length > 0 ? (
        entries.map(entry => {
          return (
            <Card key={entry._id}>
              <Image src={entry.url} />
              <Card.Content>
                <Card.Header>{entry.owner_name || entry.owner_id}</Card.Header>
              </Card.Content>
              <Card.Content extra>
                <span
                  title={moment(entry.ts).format('dddd, MMMM Do YYYY, h:mm a')}
                >
                  {formatDate(entry.ts)}
                </span>
                <ShareModal entry={entry} share={share} />
              </Card.Content>
            </Card>
          )
        })
      ) : (
        <Card header="No Entries Found ☹️" />
      )}
    </Card.Group>
  )
}

export default Feed
