import React,{Component} from 'react'
import MyNav from './my-nav'
import logoImg from '../images/logo.png'

import PropTypes from 'prop-types'

class MyHeader extends Component{
	static contextTypes = {
		themeColor:PropTypes.string
	}
	componentDidMount(){
	}
	render(){
		return (
			<header className='header'>
				<div className='header-wrapper'>
					<div className='logo'>
						<img src={logoImg} alt="logo" />
						<span><a style={{color:'black',textDecoration:'none'}} href='/' title="logo">Ioplus</a></span>
					</div>
					<MyNav />
				</div>
			</header>
			)
	}
}

export  default MyHeader;