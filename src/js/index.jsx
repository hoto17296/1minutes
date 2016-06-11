import React from 'react'
import ReactDOM from 'react-dom'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import Router from './router'

injectTapEventPlugin();

const Content = Router.route( document.location );

const App = (props) => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Content {...props} />
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('react-root'));
