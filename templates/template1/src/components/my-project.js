import React, {Component} from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import marked from 'marked'
import {Base64} from 'js-base64'
import readmeImg from '../images/book.png'
import starImg from '../images/star.png'
import forkImg from '../images/fork.png'
import watcherImg from '../images/watch.png'
import authorImg from '../images/head.png'
import MyLoading from './my-loading'

class MyProject extends Component{
	constructor(){
		super()
		this.state = {
			project:'',
			readme:''
		}
	}
	static propTypes = {
		location:PropTypes.object.isRequired
	}
	componentWillMount(){
		//get project name by query pass
		let project = this.props.location.query;
		if(!project){
			try{
				project = JSON.parse(localStorage.latestProject)
			}catch(e){
				//no query and cannot parse local correctly;
				//back to idnex
				return window.location.href= '/'
			}
		}
		this.setState({project})
		//save project to local,to avoid fresh lose data;
		localStorage.latestProject = JSON.stringify(project)
		this.fetchReadme(project.name,project.url+'/readme')
	}
	fetchReadme(name,url){
		try{
			let readme = JSON.parse(localStorage[name+'-readme'])
			this.setState({readme})
		}catch(e){
			axios.get(url)
				 .then(res=>{
				 	let readme = res.data.content
				 	readme = Base64.decode(res.data.content)
				 	this.setState({readme});
				 	localStorage[name+'-readme'] = readme;
				 })
		}
	}
	getMarkedReadme(){
		let readme = this.state.readme
		var rawMarkedup = marked(readme);
		return {__html:rawMarkedup}
	}
	render(){
		return (
			<div className="project-container">
				<div className='basic-info'>
				<div className='name-and-icon'>
					<img className='icon' src={this.state.project.owner.avatar_url} alt="avatar"/>
					<h1>{this.state.project.name}</h1>
				</div>
				<div className='author'>
				<img className='author-img' src={authorImg} alt="author_image" />
				<span>{this.state.project.owner.login}</span>
				</div>
				<p className='project-desp'>{this.state.project.description}</p>
				<div className='data-info'>
					<div><img title='stars' src={starImg} alt="stars"/><span title='stars'>{this.state.project.stargazers_count}</span></div>
					<div><img title='forks' src={forkImg} alt="forks"/><span title='forks'>{this.state.project.forks_count}</span></div>
					<div><img title='watchers' src={watcherImg} alt="watchers"/><span title='watchers'>{this.state.project.watchers_count}</span></div>
				</div>
				<div className='site'>
					<div><a target='_blank' rel="noopener noreferrer" href={this.state.project.homepage||''}><button >Homepage</button></a></div>
					<div><a target='_blank' rel="noopener noreferrer" href={this.state.project.html_url} ><button >Github</button></a></div>
				</div>
				</div>
				<div className='readme'>
					<div className='readme-tag'><span><img src={readmeImg} alt="readme_image"/></span><span>README</span></div>
					{this.state.readme?<div className='readme-content' dangerouslySetInnerHTML={this.getMarkedReadme()} />:<MyLoading/>}
				</div>
			</div>
			)
	}
}

export default MyProject