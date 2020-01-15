import React, { useEffect, useState } from "react";
import Auth0Lock from "auth0-lock";
import { Button, BottomNavigation } from "@material-ui/core";
import { IconButton, Avatar } from "@material-ui/core";

import { isLoggedIn } from "../utils/isLoggedIn";
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from "../setting";

import { MenuItem, Menu } from "@material-ui/core";
import { Snackbar, Slide } from "@material-ui/core";

import useReactRouter from "use-react-router";
import SncakbarContainer from "../containers/SncakbarContainer";

const Lock = () => {
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);

  const {
    isSnackBarOpen,
    snackbarMsg,
    setIsSnackBarOpen
  } = SncakbarContainer.useContainer();

  useEffect(() => {
    setAuthed(isLoggedIn());
  });

  const user_info = authed
    ? JSON.parse(localStorage.getItem("user_info") as string)
    : null;

  const lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
    closable: true,
    auth: {
      responseType: "token id_token",
      sso: true,
      redirectUrl: `${window.location.origin}`
    }
  });
  lock.on("authenticated", authResult => {
    const expiredAt = authResult.expiresIn * 1000 + new Date().getTime();
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expired_at", expiredAt.toString());
    localStorage.setItem(
      "user_info",
      JSON.stringify(authResult.idTokenPayload)
    );
    console.log(authResult);
    // 認証情報をlocalStorageに保存したあとに再レンダリングする。
    setLoading(true);
  });
  lock.on("authorization_error", error => {
    // error code
    console.log(error);
  });

  return (
    <>
      {authed ? (
        <AvatarButton
          nickname={user_info.nickname}
          picture_src={user_info.picture}
          setAuthed={setAuthed}
        />
      ) : (
        <Button
          onClick={() => {
            lock.show();
          }}
          color="inherit"
        >
          Login
        </Button>
      )}
      {/* スナックバー */}
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
  );
};

type AvatarProps = {
  nickname: string;
  picture_src: string;
  setAuthed: (authed: boolean) => void;
};

const AvatarButton: React.FC<AvatarProps> = ({
  nickname,
  picture_src,
  setAuthed
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null as any);
  const { history } = useReactRouter();

  const {
    setIsSnackBarOpen,
    setSnackbarMsg
  } = SncakbarContainer.useContainer();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyAccount = () => {
    setAnchorEl(null);
    setSnackbarMsg("この機能はまだ実装してません");
    setIsSnackBarOpen(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setAnchorEl(null);
    setAuthed(false);
    setSnackbarMsg("Logout しました");
    setIsSnackBarOpen(true);
  };

  return (
    <>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="false"
        onClick={handleClick}
      >
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
  );
};

const SlideTransitins: React.FC<any> = props => {
  return <Slide {...props} direction="down" />;
};

export default Lock;
