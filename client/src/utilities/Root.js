import Notifications from 'react-notification-system-redux';
import moment from "moment";

import { setStorage } from '../actions/StorageActions';

const USAGE_TIPS = [
  `
    While viewing search results, you can search directly for an answerline on Google or Wikipedia
    by clicking the relevant icon at the bottom of the question.
  `,
  `
    You can help improve QuizDB! Consider applying to be an admin in the Admin portal, or
    reporting errors in questions as you notice them!
  `,
  `
    You can view Stats in QuizDB! You'll be able to see the usage history of questions by
    category and difficulty, as well as find the most relevant keywords to those questions.
  `,
  `
    You can use QuizDB offline! Visit the Settings page to download offline questions that can
    be used even when you don't have an internet connection.
  `,
  `
    You can manage your personal settings for QuizDB from the Settings page! These settings
    will persist for your current device, but not across different ones.
  `,
  `
    Certain question searches have been known to trigger new interactive content. Will you be
    able to find the secret keywords?...
  `,
  `
    QuizDB can be used as a mobile app on Android devices! Use the "Add to Home Page" feature
    in Chrome mobile to access QuizDB natively through your phone.
  `,
  `
    QuizDB has a huge list of external Quizbowl resources! Visit the Resources page to
    read through them all.
  `,
  `
    You can help build QuizDB by sending in feedback or even contributing code! See the About
    page to learn more.
  `,
  `
    QuizDB automatically highlights search results matching your search input. You can disable
    this in settings.
  `,
  `
    These tips can be disabled by clicking the button below, or toggled at any time from the Settings
    page.
  `
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
      action: {
        label: "Stop showing these tips.",
        callback: () => dispatch(setStorage("usageTips", false))
      }
    }));
  }
}
