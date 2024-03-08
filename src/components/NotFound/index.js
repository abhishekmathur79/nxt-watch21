import './index.css'
import {NotFoundImg, NotFoundHeading, NotFoundPara} from './styledComponent'
import NxtContext from '../../context/context'
import {HomeSection as NotFoundContainer} from '../Home/styledComponent'
import {
  VideoMainContainer as MainContainer,
  VideoSectionContainer as SideBarNotFound,
} from '../Video/styledComponent'
import Header from '../Header'
import SideBar from '../SideBar'

const NotFound = () => (
  <NxtContext.Consumer>
    {value => {
      const {isDarkTheme} = value
      return (
        <MainContainer className={isDarkTheme ? 'dark' : ''}>
          <Header />
          <SideBarNotFound>
            <SideBar />
            <NotFoundContainer
              className={
                isDarkTheme
                  ? 'dark container-styling'
                  : 'light container-styling'
              }
            >
              <NotFoundImg
                src={
                  isDarkTheme
                    ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-dark-theme-img.png'
                    : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-light-theme-img.png'
                }
                alt="not found"
              />
              <NotFoundHeading>Page Not Found</NotFoundHeading>
              <NotFoundPara>
                We are sorry, the page you requested could not be found.
              </NotFoundPara>
            </NotFoundContainer>
          </SideBarNotFound>
        </MainContainer>
      )
    }}
  </NxtContext.Consumer>
)

export default NotFound
