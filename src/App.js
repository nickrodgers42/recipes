import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './index.css'
import Home from './components/home'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat',
    title: {
      fontFamily: 'Playfair Display'
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Route exact path='/' component={Home} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
