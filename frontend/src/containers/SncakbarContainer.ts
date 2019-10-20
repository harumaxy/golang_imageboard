// SncakBar通知をアプリ全体から行うための試み

import {createContainer} from 'unstated-next'
import { useState } from 'react'

const SncakbarContainer = ()=>{
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("")

  return {
    isSnackBarOpen, setIsSnackBarOpen,
    snackbarMsg, setSnackbarMsg,
  }

}

export default createContainer(SncakbarContainer)