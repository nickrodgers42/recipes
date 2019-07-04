import React, { useState } from 'react'
import {
  Divider,
  IconButton,
  InputBase,
  Paper,
} from '@material-ui/core'
import useStyles from './searchComponentStyle'
import {
  Search as SearchIcon
} from '@material-ui/icons'
import { withRouter } from 'react-router-dom'

const SearchComponent = (props) => {
  const [searchVal, setSearchVal] = useState('')
  const classes = useStyles()
  const { history } = props

  const submitSearch = () => {
    history.push(`/search?value=${searchVal}`)
  }

  return (
    <Paper className={classes.searchField}>
      <InputBase
        placeholder='Search Recipes'
        className={classes.searchInput}
        onChange={(e) => { setSearchVal(e.target.value) }}
        onKeyPress={(e) => { e.key === 'Enter' && submitSearch() }}
      />
      <Divider className={classes.divider} />
      <IconButton onClick={() => { submitSearch() }}>
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}

export default withRouter(SearchComponent)
