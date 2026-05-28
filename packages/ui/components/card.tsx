import { Card, Typography } from "@mui/material";
import { SerializableCard } from "shared";

export const CardElem = (card: SerializableCard) => {
  return (
    <Card sx={{
      px: 2,
      py: 3,
      width: '100px'
    }}>
      <Typography>
        {card.name}
      </Typography>
    </Card>
  )
}