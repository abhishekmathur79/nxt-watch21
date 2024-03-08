import {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import NxtContext from './context/context'
import Login from './components/Login'
import Home from './components/Home'
import TrendingVideos from './components/TrendingVideos'
import ProtectedRoute from './components/ProtectedRoute'
import GamingVideos from './components/Gaming'
import SavedVideos from './components/SavedVideos'
import NotFound from './components/NotFound'
import './App.css'
import Video from './components/Video'

// Replace your code here
class App extends Component {
  state = {
    isDarkTheme: false,
    buyPremiumShow: true,
    savedVideosList: [],
    likedVideosList: [],
    dislikedVideosList: [],
    isPopupOpened: false,
  }

  changeTheme = () => {
    this.setState(prev => ({isDarkTheme: !prev.isDarkTheme}))
  }

  onClosedPremiumView = () => {
    this.setState({buyPremiumShow: false})
  }

  addSaveVideoToList = obj => {
    const {savedVideosList} = this.state
    const isPresentInList = savedVideosList.some(each => each.id === obj.id)
    if (isPresentInList) {
      const filteredList = savedVideosList.filter(each => each.id !== obj.id)
      this.setState({
        savedVideosList: filteredList,
      })
    } else {
      const changedObj = {...obj}
      changedObj.isSaved = !changedObj.isSaved

      this.setState(prev => ({
        savedVideosList: [...prev.savedVideosList, obj],
      }))
    }
  }

  addLikedVideosToList = id => {
    const {likedVideosList, dislikedVideosList} = this.state
    const includesId = likedVideosList.some(each => each === id)
    const filteredDislikedVideosList = dislikedVideosList.filter(
      each => each !== id,
    )
    if (includesId) {
      this.setState({
        likedVideosList: likedVideosList.filter(each => each !== id),
      })
    } else {
      this.setState(prev => ({
        likedVideosList: [...prev.likedVideosList, id],
        dislikedVideosList: filteredDislikedVideosList,
      }))
    }
  }

  addDislikedVideosToList = id => {
    const {dislikedVideosList, likedVideosList} = this.state
    const includesId = dislikedVideosList.some(each => each === id)
    const filteredLikedVideosList = likedVideosList.filter(each => each !== id)
    if (includesId) {
      this.setState({
        dislikedVideosList: likedVideosList.filter(each => each !== id),
      })
    } else {
      this.setState(prev => ({
        dislikedVideosList: [...prev.dislikedVideosList, id],
        likedVideosList: filteredLikedVideosList,
      }))
    }
  }

  onPopupOpened = () => {
    this.setState({isPopupOpened: true})
  }

  onPopupClosed = () => {
    this.setState({isPopupOpened: false})
  }

  render() {
    const {
      isPopupOpened,
      isDarkTheme,
      likedVideosList,
      savedVideosList,
      dislikedVideosList,
      buyPremiumShow,
    } = this.state
    return (
      <NxtContext.Provider
        value={{
          isPopupOpened,
          isDarkTheme,
          buyPremiumShow,
          savedVideosList,
          likedVideosList,
          dislikedVideosList,
          changeTheme: this.changeTheme,
          closedPremiumView: this.onClosedPremiumView,
          addSaveVideoToList: this.addSaveVideoToList,
          addLikedVideosToList: this.addLikedVideosToList,
          addDislikedVideosToList: this.addDislikedVideosToList,
          onPopupClosed: this.onPopupClosed,
          onPopupOpened: this.onPopupOpened,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/videos/:id" component={Video} />
          <ProtectedRoute exact path="/trending" component={TrendingVideos} />
          <ProtectedRoute exact path="/gaming" component={GamingVideos} />
          <ProtectedRoute exact path="/saved-videos" component={SavedVideos} />
          <Route path="/bad-path" component={NotFound} />
          <Redirect to="/bad-path" />
        </Switch>
      </NxtContext.Provider>
    )
  }
}

export default App
