import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import star from '../images/star.png'
import fork from '../images/fork.png'
import GitHub from '../images/GitHub.png'
import PropTypes from 'prop-types'

class MyItem extends Component {
	static propTypes = {
		item:PropTypes.object
	}
	static defaultProps = {
		liked:false
	}
	static contextTypes = {
		themeColor:PropTypes.string
	}
	constructor(){
		super()
		this.state = {
			count:0,
			GitHub:''
		}
	}
	shouldComponentUpdate(nextProps,nextState){
		return true
	}
	componentWillMount(){
		this.setState({GitHub})
	}
	
	changeState(){
		this.setState({
			count:this.state.count
		})
	}
	decideBgColor(lang){
		switch(lang){
			case 'JavaScript':
				return '#efdf70'
			case 'C':
				return '#555555'
			case 'Java':
				return '#a9742f'
			case 'Python':
				return '#4272a1'
			case 'PHP':
				return '#505e91'
			case 'C++':
				return '#e3597e'
			case 'CSS':
				return 'red'
			case 'C#':
				return '#3d8324'
			case 'Vue':
				return '#62b587'
			case 'React':
				return '#76d01f'
			case 'HTML':
				return '#d45635'
			default:
				return 'grey'
		}
	}
	render(){
		return (
				<div className='item-wrapper' onClick={this.changeState.bind(this)}>
					<div className='avatar'>
					<img src={this.props.item.owner.avatar_url} alt='avatar'/>
					</div>
					<div className='right'>
						<div className='name'><Link to={{pathname:this.props.item.name,query:this.props.item}} >{this.props.item.name}</Link></div>
						<div className='desp'>{this.props.item.description}</div>
						<div className='other-data'>
							<div className='left'>
								<div className='lang'><span style={{backgroundColor:this.decideBgColor.call(this,this.props.item.language)}} className='lang-dot'></span><span title={this.props.item.language} className='lang-content'>{this.props.item.language==='JavaScript'?'JS':this.props.item.language}</span></div>
								<div className='star'><img src={star} alt='star' title='star'/>{this.props.item.stargazers_count}</div>
								<div className='fork'><img src={fork} alt='fork' title='fork'/>{this.props.item.forks_count}</div>
							</div>
							<div className='github'><a title={this.props.item.html_url} rel="noopener noreferrer" target="_blank" href={this.props.item.html_url}><img src={this.state.GitHub} alt="GitHub" /></a></div>
						</div>
					</div>
				</div>
			)
	}
}

export default MyItem;