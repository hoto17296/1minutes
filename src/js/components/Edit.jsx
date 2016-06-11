import React from 'react'
import ReactDOM from 'react-dom'
import RaisedButton from 'material-ui/RaisedButton'
import marked from 'marked'

const realtimeUtils = new utils.RealtimeUtils({ clientId: process.env.GOOGLE_CLIENT_ID });

const RENDER_DEDLAY = 1000; // ms

class Edit extends React.Component {
  constructor(props) {
    super(props);
    realtimeUtils.authorize((res) => res.error ? this.showAuthButton() : this.startRealtime());
    this.state = {
      id: null,
      loading: true,
      showAuthButton: false,
      delayTimerId: null,
      html: '',
    };
  }

  render() {
    if ( this.state.loading ) {
      return <main>loading...</main>;
    }
    if ( this.state.showAuthButton ) {
      return (
        <main>
          <RaisedButton label="Authorize" primary onClick={this.authorize.bind(this)} />
        </main>
      );
    }
    return (
      <main>
        <textarea ref='text' onChange={this.textChanged.bind(this)}></textarea>
        <div dangerouslySetInnerHTML={{ __html: this.state.html }} />
      </main>
    );
  }

  showAuthButton() {
    this.setState({ loading: false, showAuthButton: true });
  }

  authorize() {
    this.setState({ loading: true, showAuthButton: false });
    realtimeUtils.authorize((res) => res.error ? this.showAuthButton() : this.startRealtime(), true);
  }

  startRealtime() {
    // With auth taken care of, load a file, or create one if there
    // is not an id in the URL.
    var id = realtimeUtils.getParam('id');
    if (id) {
      // Load the document id from the URL
      realtimeUtils.load(id.replace('/', ''), this.onFileLoaded.bind(this), this.onFileInitialize.bind(this));
      this.setState({ id: id });
    } else {
      // Create a new document, add it to the URL
      realtimeUtils.createRealtimeFile('1MINUTES Markdown', (createResponse) => {
        window.history.pushState(null, null, '?id=' + createResponse.id);
        realtimeUtils.load(createResponse.id, this.onFileLoaded.bind(this), this.onFileInitialize.bind(this));
        this.setState({ id: createResponse.id });
      });
    }
  }

  // The first time a file is opened, it must be initialized with the
  // document structure. This function will add a collaborative string
  // to our model at the root.
  onFileInitialize(model) {
    var string = model.createString();
    string.setText('Welcome to the 1MINUTES Markdown App!');
    model.getRoot().set('text', string);
  }

  // After a file has been initialized and loaded, we can access the
  // document. We will wire up the data model to the UI.
  onFileLoaded(doc) {
    var Model = doc.getModel();
    var collaborativeString = Model.getRoot().get('text');
    Model.getRoot().addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, this.textChanged.bind(this));
    this.setState({
      loading: false,
      showAuthButton: false,
      html: marked( collaborativeString.getText() ),
    }, () => this.wireTextBoxes(collaborativeString));
  }

  // Connects the text boxes to the collaborative string
  wireTextBoxes(collaborativeString) {
    var textNode = ReactDOM.findDOMNode( this.refs.text );
    gapi.drive.realtime.databinding.bindString(collaborativeString, textNode);
  }

  textChanged(event) {
    if ( this.state.delayTimerId ) {
      window.clearTimeout( this.state.delayTimerId );
    }
    var timerId = window.setTimeout(() => {
      var text = ReactDOM.findDOMNode( this.refs.text ).value;
      this.setState({ delayTimerId: null, html: marked(text) });
    }, RENDER_DEDLAY);
    this.setState({ delayTimerId: timerId });
  }

}

export default Edit
