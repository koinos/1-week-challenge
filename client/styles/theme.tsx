import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  initialColorMode: 'system',
  fonts: {
    heading: `'Comic Neue', sans-serif`,
    body: `'Comic Neue', sans-serif`,
  }
})

export default theme