import React,{Component} from 'react'


class MyFooter extends Component{
	constructor(){
		super()
		this.state = {
			copyright:'© 2018,ioplus',//copyright
			beian:'蜀ICP备16036699号-3',//beian
			link:'http://www.miitbeian.gov.cn/'//link
		}
	}
	render(){
		return (
			<footer className='footer'>
				<div className='copyright'><a href={this.state.link}>{this.state.copyright+this.state.beian}</a></div>
			</footer>
			)
	}
}

export  default MyFooter;