import Notifications from 'react-notification-system-redux';
import moment from "moment";

import { setStorage } from '../actions/StorageActions';

const USAGE_TIPS = [
  "test1",
  "test2",
  "test3"
];

export function showUsageTip(dispatch, storage) {
  console.log(storage);
  let usageTips = storage.usageTips;
  if (usageTips === null || usageTips === undefined) {
    dispatch(setStorage("usageTips", true));
    usageTips = true;
  }
  const lastUsageTipTime = !!storage.lastUsageTipTime ?
    moment(storage.lastUsageTipTime) : moment().subtract(2, 'days');
  console.log(moment().diff(lastUsageTipTime, 'days', true));
  if (usageTips && moment().diff(lastUsageTipTime, 'days', true) > 1) {
    dispatch(setStorage("lastUsageTipTime", new Date()));
    dispatch(Notifications.success({
      title: "QuizDB Usage Tips",
      message: USAGE_TIPS[Math.floor(Math.random() * USAGE_TIPS.length)],
      autoDismiss: 10,
    }));
  }
}
