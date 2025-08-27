chrome.runtime.onMessage.addListener((msg) => {
  if (msg.notify) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "AI Data Leak Detector",
      message: msg.notify
    });
  }
});
