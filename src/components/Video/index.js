// DETAILED VIDEO VIEW FROM HOME
import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import ReactPlayer from 'react-player'
import {formatDistanceToNow} from 'date-fns'
import {BsDot} from 'react-icons/bs'
import {CgPlayListAdd} from 'react-icons/cg'

import {BiLike, BiDislike} from 'react-icons/bi'

import NxtContext from '../../context/context'

import {
  VideoStats,
  VideoViews,
  VideoPostDate,
  LoaderContainer,
  VideoSectionContainer,
  VideoMainContainer,
  PostLikeContainer,
  LikeDislikeContainer,
  ChannelDetails,
  ChannelIconContainer,
  ChannelImg,
  VideoDescriptionL,
  ChannelDetailsContainer,
  ChannelName,
  ChannelSubscribers,
  //   VideoDescription,
  LikeButton,
  SaveButton,
  FailureViewContainer,
  DislikeButton,
  VideoDetailsViewContainer,
  FailureImg,
  FailureHeading,
  FailurePara,
  RetryButton,
} from './styledComponent'

import Header from '../Header'
import SideBar from '../SideBar'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Video extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    videoDetails: {},
  }

  componentDidMount() {
    this.getVideoDetails()
  }

  formattedData = data => ({
    channel: {
      name: data.channel.name,
      profileImageUrl: data.channel.profile_image_url,
      subscriberCount: data.channel.subscriber_count,
    },
    description: data.description,
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
    title: data.title,
    videoUrl: data.video_url,
    viewCount: data.view_count,
    thumbnailUrl: data.thumbnail_url,
  })

  getVideoDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/videos/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = this.formattedData(data.video_details)
      this.setState({
        apiStatus: apiStatusConstants.success,
        videoDetails: formattedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <NxtContext.Consumer>
      {value => {
        const {isDarkTheme} = value
        return (
          <LoaderContainer data-testid="loader">
            <Loader
              className="loader-center"
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
    const {videoDetails} = this.state
    const {
      id,
      videoUrl,
      description,
      title,
      publishedAt,
      viewCount,
      channel,
    } = videoDetails
    const {name, profileImageUrl, subscriberCount} = channel // changes

    return (
      <NxtContext.Consumer>
        {value => {
          const {
            likedVideosList,
            savedVideosList,
            dislikedVideosList,
            addSaveVideoToList,
            addLikedVideosToList,
            addDislikedVideosToList,
          } = value

          let isSaved
          let isLiked
          let isDisliked

          const onLiked = () => {
            addLikedVideosToList(id)
          }

          if (likedVideosList.length === 0) {
            isLiked = false
          } else {
            const isLikedIdPresent = likedVideosList.includes(id)
            if (isLikedIdPresent) {
              isLiked = true
            } else isLiked = false
          }

          const onDisliked = () => {
            addDislikedVideosToList(id)
          }

          if (dislikedVideosList.length === 0) {
            isDisliked = false
          } else {
            const [isLikedVideoId] = dislikedVideosList.filter(
              each => each === id,
            )
            if (isLikedVideoId === undefined) {
              isDisliked = false
            } else isDisliked = true
          }

          const onSaved = () => {
            addSaveVideoToList(videoDetails)
          }

          if (savedVideosList.length === 0) {
            isSaved = false
          } else {
            const [isSavedVideo] = savedVideosList.filter(
              each => each.id === id,
            )
            if (isSavedVideo === undefined) {
              isSaved = false
            } else isSaved = true
          }

          return (
            <>
              <ReactPlayer className="player-styled" url={videoUrl} controls />
              <p>{title}</p>
              <PostLikeContainer>
                <VideoStats>
                  <VideoViews>{viewCount} views</VideoViews>
                  <BsDot color="grey" />
                  <VideoPostDate>{publishedAt}</VideoPostDate>
                </VideoStats>
                <LikeDislikeContainer>
                  <LikeButton type="button" isLiked={isLiked} onClick={onLiked}>
                    <BiLike className="Icon" />
                    Like
                  </LikeButton>
                  <DislikeButton
                    type="button"
                    isDisliked={isDisliked}
                    onClick={onDisliked}
                  >
                    <BiDislike className="Icon" />
                    Dislike
                  </DislikeButton>
                  <SaveButton type="button" isSaved={isSaved} onClick={onSaved}>
                    <CgPlayListAdd className="saveIcon" />
                    {isSaved ? 'Saved' : 'Save'}
                  </SaveButton>
                </LikeDislikeContainer>
              </PostLikeContainer>
              <hr className="horizontalLine" />
              <ChannelDetailsContainer>
                <ChannelIconContainer>
                  <ChannelImg src={profileImageUrl} alt="channel logo" />
                  <ChannelDetails>
                    <ChannelName>{name}</ChannelName>
                    <ChannelSubscribers>
                      {subscriberCount} subscribers
                    </ChannelSubscribers>
                    <VideoDescriptionL>{description}</VideoDescriptionL>
                  </ChannelDetails>
                </ChannelIconContainer>
              </ChannelDetailsContainer>
            </>
          )
        }}
      </NxtContext.Consumer>
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
              onClick={this.getVideoDetails}
            >
              Retry
            </RetryButton>
          </FailureViewContainer>
        )
      }}
    </NxtContext.Consumer>
  )

  renderVideo = () => {
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
            <VideoMainContainer
              data-testid="videoItemDetails"
              isDarkTheme={isDarkTheme}
            >
              <Header />
              <VideoSectionContainer>
                <SideBar />
                <VideoDetailsViewContainer>
                  {this.renderVideo()}
                </VideoDetailsViewContainer>
              </VideoSectionContainer>
            </VideoMainContainer>
          )
        }}
      </NxtContext.Consumer>
    )
  }
}

export default Video
