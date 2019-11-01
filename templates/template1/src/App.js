import React,{Component} from 'react';
import {Switch, Route} from 'react-router-dom'
import './App.css';
import './styles/header.css';
import './styles/normalize.css';
import './styles/my-item.css';
import './styles/footer.css';
import './styles/loading.css';
import './styles/project.css';
import './styles/page-navagation.css';
import MyHeader from './components/my-header'
import MyContent from './components/my-content'
import MyFooter from './components/my-footer'
import MyProject from './components/my-project'

import PropTypes from 'prop-types'

class App extends Component {
	constructor(){
		super()
		this.state = {
			themeColor:'white'
		}
	}
	static childContextTypes = {
		themeColor:PropTypes.string
	}
	getChildContext(){
		return {
			themeColor:this.state.themeColor
		}
	}
	componentDidMount(){
	}
  render() {
    return (
      <div className='all-wrapper'>
      <MyHeader />
      	<Switch>
      		<Route exact path='/' component={MyContent} />
      		<Route path='/:project' component={MyProject} />
      	</Switch>
      <MyFooter />
      </div>
    );
  }
}

export default App;
