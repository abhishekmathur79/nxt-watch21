import {Component} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BiSearchAlt2} from 'react-icons/bi'
import {formatDistanceToNow} from 'date-fns'
import NxtContext from '../../context/context'
import Header from '../Header'
import SideBar from '../SideBar'
import VideoItem from '../VideoItem'

import BuyPremiumView from '../BuyPremiumView'

import {
  MainContainer,
  VideoListUl,
  HomeSection,
  //   SearchButton,
  SearchContainer,
  SearchInput,
  VideosSection,
  MainHomePage,
  FailureViewContainer,
  FailureImg,
  FailureHeading,
  FailurePara,
  //   RetryButton,
  LoaderContainerH,
  FailureSearchImg,
  ShowNoResultsViewContainer,
  SearchFailureHeading,
  SearchFailurePara,
  //   SearchRetryButton,
} from './styledComponent'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    searchedInput: '',
    videosList: [],
    apiStatus: apiStatusConstants.initial,
    showNoResults: false,
  }

  componentDidMount() {
    this.getHomePageData()
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
    viewCount: data.view_count,
    isSaved: false,
  })

  getHomePageData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {searchedInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/videos/all?search=${searchedInput}`
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
      if (videosData.length === 0) {
        this.setState({
          showNoResults: true,
          apiStatus: apiStatusConstants.failure,
        })
      } else {
        this.setState({
          videosList: videosData,
          apiStatus: apiStatusConstants.success,
        })
      }
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderVideosView = () => {
    const {videosList} = this.state
    return (
      <VideoListUl>
        {videosList.map(each => (
          <VideoItem key={each.id} video={each} />
        ))}
      </VideoListUl>
    )
  }

  showNoResultsView = () => (
    <ShowNoResultsViewContainer>
      <FailureSearchImg
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
        alt="no videos"
      />
      <SearchFailureHeading>No Search results found</SearchFailureHeading>
      <SearchFailurePara>
        Try different key words or remove search filter
      </SearchFailurePara>
      <button
        className="retry-button"
        data-testid="retry"
        type="button"
        onClick={this.retried}
      >
        Retry
      </button>
    </ShowNoResultsViewContainer>
  )

  retried = () => {
    this.setState(
      {showNoResults: false, searchedInput: ''},
      this.getHomePageData,
    )
  }

  renderFailureView = () => {
    const {showNoResults} = this.state
    return showNoResults ? (
      this.showNoResultsView()
    ) : (
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
              <button
                className="retry-button"
                type="button"
                data-testid="retry"
                onClick={this.getHomePageData}
              >
                Retry
              </button>
            </FailureViewContainer>
          )
        }}
      </NxtContext.Consumer>
    )
  }

  renderLoadingView = () => (
    <NxtContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        return (
          <LoaderContainerH data-testid="loader">
            <Loader
              type="ThreeDots"
              color={isDarkTheme ? '#ffffff' : '#0f0f0f'}
              height="50"
              width="50"
            />
          </LoaderContainerH>
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

  onChangeSearchInput = event => {
    this.setState({searchedInput: event.target.value})
  }

  onSearched = () => {
    const {searchedInput, videosList} = this.state

    if (searchedInput === '') {
      this.setState({
        apiStatus: apiStatusConstants.failure,
        showNoResults: true,
      })
    } else {
      const filteredList = videosList.filter(each =>
        each.title.toLowerCase().includes(searchedInput.toLowerCase()),
      )
      this.setState({videosList: filteredList}, this.getHomePageData)
    }
  }

  render() {
    const {searchedInput} = this.state

    return (
      <NxtContext.Consumer>
        {value => {
          const {isDarkTheme, buyPremiumShow} = value
          return (
            <MainHomePage data-testid="home" isDarkTheme={isDarkTheme}>
              <Header />
              <MainContainer>
                <SideBar />
                <HomeSection isDarkTheme={isDarkTheme}>
                  {buyPremiumShow && <BuyPremiumView />}

                  <VideosSection>
                    <SearchContainer>
                      <SearchInput
                        value={searchedInput}
                        type="search"
                        placeholder="Search"
                        onChange={this.onChangeSearchInput}
                      />
                      <button
                        type="button"
                        className="searchButton"
                        data-testid="searchButton"
                        onClick={this.onSearched}
                      >
                        <BiSearchAlt2 color="grey" />
                      </button>
                    </SearchContainer>
                    {this.renderVideos()}
                  </VideosSection>
                </HomeSection>
              </MainContainer>
            </MainHomePage>
          )
        }}
      </NxtContext.Consumer>
    )
  }
}

export default Home
