import React from 'react';
import ReactDOM from 'react-dom';
import ExampleReactSubComponent from './ExampleReactSubComponent'

class ExampleReactComponent extends React.Component {
	render() {
		return (
			<div>
				<p>React things are a mix of normal HTML, and other React compoents</p>
				<ExampleReactSubComponent name="Steven" />
                <p>All this react jsx converts to JavaScript that, when run, builds the HTML</p>
			</div>);
	}
}


ReactDOM.render(<ExampleReactComponent/>, document.getElementById('reactHostDiv'));