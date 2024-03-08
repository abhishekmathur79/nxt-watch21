import './index.css'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaFire} from 'react-icons/fa'

import {formatDistanceToNow} from 'date-fns'
import Header from '../Header'
import TrendingVideoItem from '../TrendingVideoItem'
import NxtContext from '../../context/context'
import SideBar from '../SideBar'

import {
  MainContainer,
  VideosSection,
  MainTrendingVideosPage,
  TrendingVideosList,
  TrendingVideoHeader,
  TrendingTitle,
  LoaderContainer,
  FailureImg,
  FailureHeading,
  FailurePara,
  RetryButton,
  FireImgContainer,
  FailureViewContainer,
  TrendingVideosSection,
} from './styledComponent'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class TrendingVideos extends Component {
  state = {
    videosList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrendingVideos()
  }

  getFormattedData = data => ({
    channel: {
      name: data.channel.name,
      profileImageUrl: data.channel.profile_image_url,
    },
    id: data.id,
    // publishedAt: formatDistanceToNow(new Date(data.published_at)),
    publishedAt: formatDistanceToNow(new Date(data.published_at), {
      addSuffix: true,
    })
      .split(' ')
      .reverse()
      .slice(0, 3)
      .reverse()
      .join(' '),
    thumbnailUrl: data.thumbnail_url,
    title: data.title,
    isSaved: false,
    viewCount: data.view_count,
  })

  getTrendingVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/videos/trending'
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
      <TrendingVideosList>
        {videosList.map(each => (
          <TrendingVideoItem key={each.id} video={each} />
        ))}
      </TrendingVideosList>
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
              onClick={this.getTrendingVideos}
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
            <MainTrendingVideosPage
              data-testid="trending"
              isDarkTheme={isDarkTheme}
            >
              <Header />
              <MainContainer>
                <SideBar />
                <TrendingVideosSection>
                  <VideosSection>
                    <TrendingVideoHeader isDarkTheme={isDarkTheme}>
                      <FireImgContainer isDarkTheme={isDarkTheme}>
                        <FaFire className="faFire" color="red" />
                      </FireImgContainer>
                      <TrendingTitle>Trending</TrendingTitle>
                    </TrendingVideoHeader>
                    {this.renderVideos()}
                  </VideosSection>
                </TrendingVideosSection>
              </MainContainer>
            </MainTrendingVideosPage>
          )
        }}
      </NxtContext.Consumer>
    )
  }
}

export default TrendingVideos
