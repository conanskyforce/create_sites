import React,{Component} from 'react'
import {Link} from 'react-router-dom'

class MyPageNavigation extends Component{
	constructor(){
		super();
		this.state = {
			prev:'<',
			next:'>',
			statePage:''
		}
	}
	componentWillMount(){
		this.setState({
			statePage:this.props.page
		})
	}
	changeNavigation(idx){
		if(idx == this.state.statePage) return
		this.setState({statePage:idx})
		if(this.props.onClick){
			this.props.onClick(idx)
		}
	}
	prevNavigation(){
		if(this.state.statePage == 1) return
		this.changeNavigation(this.state.statePage-1)
	}
	nextNavigation(){
		if(this.state.statePage == 10) return
		this.changeNavigation(this.state.statePage+1)
	}
	render(){
		return (
			<div className="page-navigation">
				<ul className='page-nav-ul'>
					<li className='prev'  onClick={this.prevNavigation.bind(this)} >{this.state.prev}</li>
					{[1,2,3,4,5,6,7,8,9,10].map((ele,idx)=>{
						return <li 
						style={{backgroundColor:((this.state.statePage)==ele)?'red':'',color:((this.state.statePage)==ele)?'white':''}} 
						key={ele} 
						className='page-nav-li'
						onClick={this.changeNavigation.bind(this,ele)}
						>{ele}</li>
					})}
					<li className='next' onClick={this.nextNavigation.bind(this)} >{this.state.next}</li>
				</ul>
			</div>
			)
	}
}

export default MyPageNavigation;