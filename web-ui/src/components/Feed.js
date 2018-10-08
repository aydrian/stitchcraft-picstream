import React from 'react'
import { Card, Image, Menu, Label } from 'semantic-ui-react'
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
                {entry.tags ? (
                  entry.tags.map(tag => {
                    return (
                      <Label color="green" tag>
                        {tag.Name}
                      </Label>
                    )
                  })
                ) : (
                  <span>processing image</span>
                )}
              </Card.Content>
              <Card.Content extra>
                <Menu secondary size="tiny">
                  <Menu.Item fitted>
                    <span
                      title={moment(entry.ts).format(
                        'dddd, MMMM Do YYYY, h:mm a'
                      )}
                    >
                      {formatDate(entry.ts)}
                    </span>
                  </Menu.Item>
                  <Menu.Item fitted position="right">
                    <ShareModal entry={entry} share={share} />
                  </Menu.Item>
                </Menu>
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
