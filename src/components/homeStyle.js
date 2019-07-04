import { makeStyles } from '@material-ui/styles'
import globalStyle from './globalStyle.js'

const useStyles = makeStyles({
  home: {
    background: `${globalStyle.lightShades}`,
    height: '100vh'
  }
})

export default useStyles
