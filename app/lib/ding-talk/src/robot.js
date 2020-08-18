const crypto = require('crypto');

class Robot {
  constructor(options = {}) {
    this.accessToken = options.accessToken;
    this.secret = options.secret || "";
    this.isSession = false;
    this.curl = options.curl;
    if (options.sessionWebhook) {
      this.webhook = options.sessionWebhook;
      this.isSession = true;
    } else {
      if (!this.accessToken) {
        throw new Error("accessToken is required!")
      }

      this.webhook = `https://oapi.dingtalk.com/robot/send?access_token=${this.accessToken}`;
    }
  }

  getWebHook() {
    let signStr = "";

    if (this.secret && this.isSession === false) {
      const timeStamp = Date.now();

      const hash = encodeURIComponent(crypto.createHmac('sha256', this.secret)
        .update(timeStamp + '\n' + this.secret)
        .digest('base64'));

      signStr = "&sign=" + hash + "&timestamp=" + timeStamp;
    }

    return this.webhook + signStr;
  }

  request(body) {
    const url = this.getWebHook();
    return this.curl(url, {
      method: 'POST',
      contentType: 'json',
      data: body,
      dataType: 'json',
    })
  }

  send(message) {
    let body = message.get();

    return this.request(body)
  }
}

module.exports = Robot;
