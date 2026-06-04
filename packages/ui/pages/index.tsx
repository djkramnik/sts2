import { NextPage } from 'next'
import {
  Box,
  Container,
} from '@mui/material'
import { Card } from 'shared'
import { CardElem, Deck } from '../components/card'
import { useEffect } from 'react'

const getRandomUUID = () => new Date().getTime().toString()

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
  getRandomUUID
)
const sample2 = new Card(
  {
    name: "Defend",
    flavor: "Basic protection.",
  },
  {
    cost: 1,
    attack: 0,
    defense: 5,
  },
  getRandomUUID
)

const deckOCards = [
  sample.serialize(),
  sample2.serialize()
]

const HomePage: NextPage = () => {

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
       <Deck cards={deckOCards} />
      </Container>
    </Box>
  )
}

export default HomePage
