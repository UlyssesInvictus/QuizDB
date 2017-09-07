import Notifications from 'react-notification-system-redux';

function success(dispatch, notice) {
  dispatch(Notifications.success(notice));
}

function error(dispatch, notice) {
  dispatch(Notifications.error(notice));
}

export function handleSearchInput(dispatch, query) {
  if (query.match(/harvard/)) {
    success(dispatch, {
      title: 'Yuck Fale'
    })
  } else if (query.match(/yale/)) {
    error(dispatch, {
      title: 'Yuck Fale'
    })
  } else if (query.match(/^(b|B)ee$/)) {
    success(dispatch, {
      title: "BEEEEEEEES"
    })
  } else if (query.match(/(R|r)ilke/)) {
    success(dispatch, {
      title: "\"Like the poet?\"",
      message: "I've given up on trying to get Starbucks to spell my name right."
    })
  }
}
export default handleSearchInput;
