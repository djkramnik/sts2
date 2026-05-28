import { NextPage } from 'next'
import {
  Box,
  Container,
} from '@mui/material'
import { Card } from 'shared'
import { CardElem } from '../components/card'
const HomePage: NextPage = () => {
  const sample = new Card(
    {
      name: "Strike",
      flavor: "A straightforward attack.",
    },
    {
      cost: 1,
      attack: 6,
      defense: 0,
    },
  )
  console.log(sample.serialize())
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.50',
      }}
    >
      <Box height={8} />
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          py: 3,
        }}
      >
       <CardElem {...sample} />
      </Container>
    </Box>
  )
}

export default HomePage
