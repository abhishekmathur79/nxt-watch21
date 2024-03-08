import './index.css'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {SiYoutubegaming} from 'react-icons/si'

import GamingVideoItem from '../GamingVideoItem'
import Header from '../Header'
import NxtContext from '../../context/context'
import SideBar from '../SideBar'

import {
  GamingVideosList,
  FailureViewContainer,
  MainGamingPage,
  LoaderContainer,
  GamingVideosSection,
  MainContainer,
  FailureImg,
  FailureHeading,
  FailurePara,
  RetryButton,
  GamingVideoHeader,
  GamingIconContainer,
  GamingTitle,
} from './styledComponent'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class GamingVideos extends Component {
  state = {
    videosList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getGamingVideos()
  }

  getFormattedData = data => ({
    id: data.id,
    thumbnailUrl: data.thumbnail_url,
    title: data.title,
    viewCount: data.view_count,
    isSaved: false,
  })

  getGamingVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/videos/gaming'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const videosData = data.videos.map(each => this.getFormattedData(each))
      this.setState({
        videosList: videosData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <NxtContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        return (
          <LoaderContainer data-testid="loader">
            <Loader
              type="ThreeDots"
              color={isDarkTheme ? '#ffffff' : 'black'}
              height="50"
              width="50"
            />
          </LoaderContainer>
        )
      }}
    </NxtContext.Consumer>
  )

  renderVideosView = () => {
    const {videosList} = this.state
    return (
      <GamingVideosList>
        {videosList.map(each => (
          <GamingVideoItem key={each.id} video={each} />
        ))}
      </GamingVideosList>
    )
  }

  renderFailureView = () => (
    <NxtContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        return (
          <FailureViewContainer>
            <FailureImg
              src={
                isDarkTheme
                  ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'
                  : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'
              }
              alt="failure view"
            />
            <FailureHeading>Oops! Something Went Wrong</FailureHeading>
            <FailurePara>
              We are having some trouble to complete your request. Please try
              again.
            </FailurePara>
            <RetryButton
              data-testid="retry"
              type="button"
              onClick={this.getGamingVideos}
            >
              Retry
            </RetryButton>
          </FailureViewContainer>
        )
      }}
    </NxtContext.Consumer>
  )

  renderVideos = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderVideosView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <NxtContext.Consumer>
        {value => {
          const {isDarkTheme} = value
          return (
            <MainGamingPage isDarkTheme={isDarkTheme} data-testid="gaming">
              <Header />
              <MainContainer>
                <SideBar />
                <GamingVideosSection>
                  <GamingVideoHeader isDarkTheme={isDarkTheme}>
                    <GamingIconContainer isDarkTheme={isDarkTheme}>
                      <SiYoutubegaming
                        className="siYoutubegaming"
                        color="red"
                      />
                    </GamingIconContainer>
                    <GamingTitle>Gaming</GamingTitle>
                  </GamingVideoHeader>
                  {this.renderVideos()}
                </GamingVideosSection>
              </MainContainer>
            </MainGamingPage>
          )
        }}
      </NxtContext.Consumer>
    )
  }
}

export default GamingVideos
