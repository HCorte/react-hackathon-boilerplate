/**
 * Epics
 */
export const logInUserSuccessEpic = socket => action$ =>
  action$.ofType(`LOG_IN_USER_SUCCESS`)
    .forEach(() => {
      console.warn(`logInUserSuccessEpic: socket.close()`)
      socket.close()
      console.warn(`logInUserSuccessEpic: socket.open()`)
      socket.open()
    })

export const logOutUserSuccessEpic = socket => action$ =>
  action$.ofType(`LOG_OUT_USER_SUCCESS`)
    .forEach(() => {
      console.warn(`logOutUserSuccessEpic: socket.close()`)
      socket.close()
      console.warn(`logOutUserSuccessEpic: socket.open()`)
      socket.open()
    })

export const epics = [logInUserSuccessEpic, logOutUserSuccessEpic]
