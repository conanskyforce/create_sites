import React,{Component} from 'react'

import MyItem from './my-item'
import axios from 'axios'
import MyLoading from './my-loading'
import MyScreenLoading from './my-screen-loading'
import HighOrderComp from './high-order-comp'
import MyPageNavigation from './my-page-navigation'

class MyContent extends Component{
	constructor(){
		super()
		this.state = {
			loading:'',
			showLoading:false,
			page:1,
			itemsData:'',
			items:[]
		}
	}
	fetchDataFromGitHub(){
		const query = 'io';
		axios.get(`https://api.github.com/search/repositories?q=${query}&per_page=30&sort=stars&page=${this.state.page}`)
			.then((res)=>{
				localStorage.githubIoApi = JSON.stringify(res.data);				
				this.setState({
					itemsData:res.data,
					items:res.data.items
				})
				setTimeout(()=>{
					this.setState({
						showLoading:false
					})
				},500)
			})
	}
	componentWillMount(){
		try{
			let localData = JSON.parse(localStorage.githubIoApi)
			this.setState({
				itemsData:localData,
				items:localData.items
			})
		}catch{
			this.fetchDataFromGitHub()
		}
		//高阶组件传递的props
		//console.log(this.props.highOrderProp)
	}
	handleNavigation(idx){
		this.setState({ page: idx },()=>{
			this.fetchDataFromGitHub()
			this.setState({
				showLoading:true
			});
			this.timer = setTimeout(()=>{
				if(this.state.showLoading == true){
					this.setState({
						showLoading:false
					})
					// console.log('timeout...')
				}
			},8000)
		})
	}
	render(){
		return (
			<div className='content'>
				{this.state.showLoading?<MyScreenLoading />:''}
				{!this.state.itemsData?<MyLoading />:this.state.items.map((item,idx)=>{
					return <MyItem rand={Math.random()} key={idx} item={item}>
									<div>
										<h1>穿了个jsx</h1>
										<span>厉害吧</span>
									</div>
								 </MyItem>
				}).concat(<MyPageNavigation onClick={this.handleNavigation.bind(this)} page={this.state.page} />)}
			</div>
			)
	}
}
MyContent = HighOrderComp(MyContent)
export default MyContent;