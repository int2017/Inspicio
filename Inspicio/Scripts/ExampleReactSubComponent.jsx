import React from 'react';
import PropTypes from 'prop-types'; // prop types are used for (runtime) type checking

class ExampleReactSubComponent extends React.Component {
	render() {
		return (
			<div style={{ textAlign: 'center' }}>
				<h1>Hello from a React component called {this.props.name}</h1>
			</div>);
	}
}


// Each of these "prop types" will be usabile as attributes on ExampleReactSubComponent where the 
// component is used. Inside the compoent, you can use this.props.<property name> to access the value
ExampleReactSubComponent.propTypes = {
	name: PropTypes.string.isRequired
}


export default ExampleReactSubComponent;