import { NextPage } from 'next'
import {
  Box,
  Container,
} from '@mui/material'

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
       hi
      </Container>
    </Box>
  )
}

export default HomePage
