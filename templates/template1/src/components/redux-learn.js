// body结构
<body>
  <div id='title'></div>
  <div id='content'></div>
</body>
//state状态

const appState = {
	title:{
		text:'awesome',
		color:'red'
	},
	context:{
		text:'Nodejs内容',
		color:'blue'
	}
}

//render函数

function renderApp(appState){
	renderTitle(appState.title)
	renderContent(appState.content)
}

function renderTitle(title){
	const titleDOM = document.getElementById('title')
	titleDOM.innerHTML = title.text;
	titleDOM.style.color = title.color;
}

function renderContent(content){
	const contentDOM = document.getElementById('content')
	contentDOM.innerHTML = content.text;
	contentDOM.style.color = content.color;
}
//状态会被修改,十分麻烦, 他人即地狱

//创建一个dispatch, 专门负责数据的修改
function dispatch(action){
	switch(action.type){
		case 'UPDATE_TITLE_TEXT':
			appState.title.text = action.text
			break
		case 'UPDATE_TITLE_COLOR':
			appState.title.text = action.color
			break
		default:
			break
	}	
}
//所有了数据操作必须全通过dispatch
renderApp(appState)
dispatch({type:'UPDATE_TITLE_TEXT',text:'呵呵'})
dispatch({type:'UPDATE_TITLE_COLOR',color:'red'})
renderApp(appState)

//抽离dispatch, 起个名字叫store

function createStore(state, stateChanger){
	const getState = () => state
	const dispatch = (action) =>stateChanger(state,action)
	return {getState,dispatch}
}

//重构刚刚的代码
function stateChanger(state,action){
	switch(action.type){
		case 'UPDATE_TITLE_TEXT':
			state.title.text = action.text
			break
		case 'UPDATE_TITLE_COLOR':
			state.title.text = action.color
			break
		default:
			break
	}	
}
const store = createStore(appState,stateChanger)
renderApp(store.getState())
store.dispatch({type:'UPDATE_TITLE_TEXT',text:'呵呵'})
store.dispatch({type:'UPDATE_TITLE_COLOR',color:'red'})
renderApp(store.getState())

//我们可以给 createStore 传入初始的数据 appState，
//和一个描述数据变化的函数 stateChanger，然后生成一个 store。
//需要修改数据的时候通过 store.dispatch，需要获取数据的时候
//通过 store.getState

//监控数据变化
function createStore(state,stateChanger){
	const listeners = []
	const subscribe = (listener) => listeners.push(listener)
	const getState = () => state
	const dispatch = (action) => {
		stateChanger(state,action);
		listeners.forEach((listener)=>listener())
	}
	return {getState,dispatch,subscribe}
}

const store = createStore(appState,stateChanger)
store.subscribe(()=>renderApp(store.getState()))
renderApp(store.getState())
store.dispatch({type:'UPDATE_TITLE_TEXT',text:'呵呵'})
store.dispatch({type:'UPDATE_TITLE_COLOR',color:'red'})

//现在我们有了一个比较通用的 createStore，
//它可以产生一种我们新定义的数据类型 store，
//通过 store.getState 我们获取共享状态，
//而且我们约定只能通过 store.dispatch 
//修改共享状态。store 也允许我们通过 store.subscribe 
//监听数据数据状态被修改了，并且进行后续的例如重新渲染页面的操作。

// 解决每次渲染都重复渲染的问题

function renderApp(newAppState, oldAppState = {}) {
	if(newAppState === oldAppState) return
	console.log('render app...')
	renderTitle(newAppState.title,oldAppState.title)
	renderContent(newAppState.content,oldAppState.content)
}

function renderTitle(newTitle, oldTitle = {}){
	if(newTitle === oldTitle) return
	console.log('render title...')
  const titleDOM = document.getElementById('title')
  titleDOM.innerHTML = newTitle.text
  titleDOM.style.color = newTitle.color
}

function renderContent (newContent, oldContent = {}) {
  if (newContent === oldContent) return // 数据没有变化就不渲染了
  console.log('render content...')
  const contentDOM = document.getElementById('content')
  contentDOM.innerHTML = newContent.text
  contentDOM.style.color = newContent.color
}

const store = createStore(appState, stateChanger)
let oldState = store.getState()
store.subscribe(() => {
	const newState = stote.getState()
	renderApp(newState,oldState)
	oldState = newState
})

function stateChanger (state, action) {
	switch(action.type) {
		case 'UPDATE_TITLE_TEXT':
			return {
				...state,
				title:{
					...state.title,
					text:action.text
				}
			}
		case 'UPDATE_TITLE_COLOR':
			return {
				...state,
				title:{
					...state.title,
					color:action.color
				}
			}
		default:
			return state
	}
}

function createStore(state,stateChanger) {
	const listeners = []
	const subscribe = (listener) => listeners.push(listener)
	const getState = () => state;
	const dispatch = (action) => {
		state = stateChanger(state,action)
		listeners.forEach((listener)=>listener())
	}
	return { getState, dispatch, subscribe}
}












