import { makeStyles } from '@material-ui/styles'
import globalStyle from '../globalStyle'

const useStyles = makeStyles({
  title: {
    fontFamily: globalStyle.headerFont,
    fontWeight: 400,
    textShadow: `1px 1px 5px ${globalStyle.darkShades}`,
    color: `${globalStyle.lightShades}`,
    padding: 5,
    margin: 'auto 0',
    display: 'inline',
    verticalAlign: 'middle',
  },
  homeLink: {
    textDecoration: 'none'
  },
  appbar: {
    background: `${globalStyle.mainBrandColor}`
  },
  menuButton: {
    color: `${globalStyle.lightShades}`,
    padding: 18
  },
  grow: {
    flexGrow: 1
  },
  search: {
    margin: '0 5px'
  },
  logInButton: {
    color: `${globalStyle.accent}`,
    borderColor: `${globalStyle.accent}`,
    margin: '0 5px'
  },
  signUpButton: {
    background: `${globalStyle.accent}`,
    margin: '0 5px',
    '&:hover': {
      background: `${globalStyle.lightAccent}`
    }
  }
})

export default useStyles
