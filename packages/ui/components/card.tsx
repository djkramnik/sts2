import { Box, Card, Typography } from "@mui/material";
import { SerializableCard } from "shared";

export const CardElem = ({ card, greyed }: { card: SerializableCard, greyed?: boolean } ) => {
  return (
    <Card sx={{
      px: 2,
      py: 3,
      width: '100px',
      position: 'relative'
    }}>
      { greyed ? <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#eee',
        zIndex: 1,
        opacity: 0.5
      }}></div> : null}
      <Typography>
        {card.name}
      </Typography>
      <Typography>
        COST:{card.cost}
      </Typography>
      <Typography>
        ATK:{card.attack}
      </Typography>
      <Typography>
        DEF:{card.defense}
      </Typography>
    </Card>
  )
}

export const Deck = ({
  cards
}: {
  cards:  SerializableCard[]
}) => {
  return (
    <Box sx={{
      display: 'flex',
      gap: 3,
      alignItems: 'center'
      }}>
        { cards.map((c, index) => <CardElem key={index} card={c} greyed={index > 0} />)}
    </Box>
  )
}