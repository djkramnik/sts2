import { Box, Card, Typography } from '@mui/material'
import { SerializableCard } from 'shared'

export const CardElem = ({
  card,
  greyed,
  highlightIdx,
}: {
  card: SerializableCard
  greyed?: boolean
  highlightIdx?: number
}) => {
  return (
    <Box sx={{ position: 'relative' }}>
      {typeof highlightIdx === 'number' ? (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            border: '1px solid red',
            borderRadius: '8px',
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              border: '1px solid red',
              borderRadius: '50%',
              top: 0,
              left: 0,
              width: '20px',
              height: '20px',
              color: 'red',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {highlightIdx}
          </Box>
        </Box>
      ) : null}

      <Card
        sx={{
          px: 2,
          py: 3,
          width: '100px',
          position: 'relative',
          borderRadius: '8px',
        }}
      >
        {greyed ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#eee',
              zIndex: 1,
              opacity: 0.5,
            }}
          ></div>
        ) : null}
        <Typography>{card.name}</Typography>
        <Typography>COST:{card.cost}</Typography>
        <Typography>ATK:{card.attack}</Typography>
        <Typography>DEF:{card.defense}</Typography>
      </Card>
    </Box>
  )
}

// highlights mark which cards were played and in what order.
// it is an array of the actual card ids
export const Deck = ({
  cards,
  highlights,
}: {
  cards: SerializableCard[]
  highlights?: string[]
}) => {
  console.log('HIGHLIGHTS?', highlights)
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 3,
        alignItems: 'center',
      }}
    >
      {cards.map((c, index) => (
        <CardElem key={index} card={c} greyed={index > 0} />
      ))}
    </Box>
  )
}
