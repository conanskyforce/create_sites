import React,{Component} from 'react'
export default (WrappedComponent) =>{
	class Comp extends Component{
		constructor(){
			super()
			this.state = {
				high:'awesome!'
			}
		}
		componentWillMount(){
		}
		render(){
			return <WrappedComponent highOrderProp={this.state.high}/>
		}
	}
	return Comp
}