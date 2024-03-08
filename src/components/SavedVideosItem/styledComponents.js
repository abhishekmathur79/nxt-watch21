import styled from 'styled-components'
import {Link} from 'react-router-dom'

export const VideoItem = styled.li`
  width: 100%;
`
export const VideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
`
export const LinkEl = styled(Link)`
  color: 'grey';
  text-decoration: none;
`

export const VideoThumbnail = styled.img`
  height: 220px;
  @media screen and (min-width: 768px) {
    width: 40%;
  }
`
export const VideoTitle = styled.p`
  margin: 3px 0px;
  font-size: 17px;
  font-weight: 600;
  @media screen and (min-width: 1024px and max-width: 768px) {
    font-size: 25px;
  }
  @media screen and (min-width: 768px) {
    font-size: 25px;
    margin: 8px 0px;
  }
`

export const TrendingVideosStats = styled.div``

export const VideoStats = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 0px 5px 10px 0px;
  @media screen and (min-width: 768px) {
    padding: 5px 5px 5px 0px;
    gap: 4px;
  }
`

export const ChannelName = styled.p`
  margin: 4px 0px;
  font-size: 16px;
  @media screen and (min-width: 768px) {
    margin: 8px 0px;
    font-size: 25px;
  }
`
export const TrendingVideoPostDate = styled.p`
  margin: 4px 0px;
  font-size: 16px;
  @media screen and (min-width: 768px) {
    margin: 8px 0px;
    font-size: 25px;
  }
`
export const TrendingVideoViews = styled.p`
  font-size: 16px;
  margin: 0;
  @media screen and (min-width: 768px) {
    font-size: 25px;
  }
`
