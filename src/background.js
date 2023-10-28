/*
 * @Author: Vincent Young
 * @Date: 1984-01-24 03:00:00
 * @LastEditors: Vincent Young
 * @LastEditTime: 2023-10-27 20:23:39
 * @FilePath: /iina-chrome-yt/background.js
 * @Telegram: https://t.me/missuo
 * 
 * Copyright © 2023 by Vincent, All Rights Reserved. 
 */
import { updateBrowserAction, openInIINA, getOptions } from "./common.js";

updateBrowserAction();

const dict = {
  page: "pageUrl",
  link: "linkUrl",
  video: "srcUrl",
  audio: "srcUrl",
};

Object.keys(dict).forEach((item) => {
  chrome.contextMenus.create({
    title: `Open this ${item} in IINA`,
    id: `openiniina_${item}`,
    contexts: [item],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId.startsWith("openiniina")) {
    const key = info.menuItemId.split("_")[1];
    const url = info[dict[key]];
    if (url) {
      openInIINA(tab.id, url);
    }
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    if (tabs.length === 0) {
      return;
    }
    const tab = tabs[0];
    if (tab.id === chrome.tabs.TAB_ID_NONE) {
      return;
    }
    getOptions((options) => {
      openInIINA(tab.id, tab.url, {
        mode: options.iconActionOption,
      });
    });
  });
});

const processedTabs = new Set();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.status === 'complete' && tab.url && tab.url.includes('https://www.youtube.com/watch') && !processedTabs.has(tabId)) {
    processedTabs.add(tabId);
    getOptions((options) => {
      openInIINA(tabId, tab.url, {
        mode: options.iconActionOption,
      });
    });
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  processedTabs.delete(tabId);
});