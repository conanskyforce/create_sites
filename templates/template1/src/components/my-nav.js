import React,{Component} from 'react'
import {Link} from 'react-router-dom'

class MyNav extends Component{

	render(){
		return (
			<ul className='nav-ul'>
				<li>
				<Link to="/"><span>首页</span></Link>
				</li>
				<li>
				<a href="javascript:alert('ioplus.top')"><span>关于</span></a>
				</li>
			</ul>
			)
	}
}

export default MyNav;