import React, { useState, useEffect, useRef } from 'react'
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
  const searchRef = useRef('')
  const classes = useStyles()
  const { history, location } = props

  useEffect(() => {
    console.log(history)
    console.log(location)
    const params = new URLSearchParams(location.search)
    const query = params.get('query')
    if (query) {
      setSearchVal(decodeURIComponent(query))
      searchRef.current.value = decodeURIComponent(query)
    }
  }, [location])

  const submitSearch = () => {
    history.push(`/search?query=${encodeURIComponent(searchVal.trim())}`, { searchVal: searchVal.trim() })
  }

  return (
    <Paper className={classes.searchField}>
      <InputBase
        inputRef={searchRef}
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
