import React from 'react'
import ReactDOM from 'react-dom'
import Router from './router'

const Content = Router.route( document.location );

function App(props) {
  return <Content {...props} />;
}

ReactDOM.render(<App />, document.getElementById('react-root'));
