import React from 'react'
import Navbar from './navbar/navbar'
import useStyles from './homeStyle'

export default function Home() {
  const classes = useStyles()
  return (
    <div className={classes.home}>
      <Navbar />
    </div>
  )
}
