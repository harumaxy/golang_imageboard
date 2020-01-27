import React, { useEffect } from "react"
import { Button } from "@material-ui/core"
import { IconButton, Avatar } from "@material-ui/core"
import { MenuItem, Menu } from "@material-ui/core"
import { Snackbar, Slide } from "@material-ui/core"
import useReactRouter from "use-react-router"
import SncakbarContainer from "../containers/SncakbarContainer"

import { useAuth0 } from "../containers/react-auth0-spa"

const Lock = () => {
  const { isAuthenticated, user, loginWithPopup } = useAuth0()
  const { isSnackBarOpen, snackbarMsg, setIsSnackBarOpen } = SncakbarContainer.useContainer()

  return (
    <>
      {isAuthenticated && user !== undefined ? (
        <AvatarButton nickname={user.nickname} picture_src={user.picture} />
      ) : (
        <Button
          onClick={() => {
            loginWithPopup()
          }}
          color="inherit"
        >
          Login
        </Button>
      )}
      {/* ログインしたらスナックバーで通知 */}
      <Snackbar
        open={isSnackBarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setIsSnackBarOpen(false)}
        TransitionComponent={SlideTransitins}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">{snackbarMsg}</span>}
      />
    </>
  )
}

type AvatarProps = {
  nickname: string
  picture_src: string
}

const AvatarButton: React.FC<AvatarProps> = ({ nickname, picture_src }) => {
  const { logout } = useAuth0()
  const [anchorEl, setAnchorEl] = React.useState(null as any)
  const { history } = useReactRouter()

  const { setIsSnackBarOpen, setSnackbarMsg } = SncakbarContainer.useContainer()

  useEffect(() => {
    setAnchorEl(null)
    setSnackbarMsg("ログインしました。")
    setIsSnackBarOpen(true)
  }, [])

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMyAccount = () => {
    setAnchorEl(null)
    setSnackbarMsg("この機能はまだ実装してません")
    setIsSnackBarOpen(true)
  }

  const handleLogout = () => {
    setAnchorEl(null)
    logout()
    setSnackbarMsg("ログアウトしました")
    setIsSnackBarOpen(true)
  }

  return (
    <>
      <IconButton aria-controls="simple-menu" aria-haspopup="false" onClick={handleClick}>
        <Avatar alt={nickname} srcSet={picture_src} />
      </IconButton>

      {/* メニュー */}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        // メニューをアバターの下に表示するためのスタイリング
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        elevation={0}
        getContentAnchorEl={null}
      >
        <MenuItem onClick={handleMyAccount}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  )
}

const SlideTransitins: React.FC<any> = props => {
  return <Slide {...props} direction="down" />
}

export default Lock
