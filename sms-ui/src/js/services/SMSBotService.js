import { SMS_BOT_BASE_API } from '../env';

const baseOptions = {
  baseUrl: SMS_BOT_BASE_API,
  headers: [
    { key:'Content-type', value: 'application/json'}
  ]
  // baseUrl: 'https:sms.vesselstech.com'
}

export default class SMSBotService {

  static fetchServiceConfiguration(serviceId) {
    const options = {
      uri: '/console/service/:serviceId',
      qs: {
        ":serviceId": serviceId
      }
    }
    return this.getRequest(options)
      .catch(err => {
        console.log("Err fetchServiceConfiguration", err);
      });
  }

  static fetchServiceLogs(serviceId) {
    const options = {
      uri: '/console/service/:serviceId/logs',
      qs: {
        ":serviceId": serviceId
      }
    }
    return this.getRequest(options)
      .catch(err => {
        console.log("Err fetchServiceLogs", err);
      });
  }

  static getRequest(options) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      const url = baseOptions.baseUrl + this.parseQueryArguments(options.uri, options.qs) + this.parseRequestParams(options.params);
      xhr.open('GET', url);

      baseOptions.headers.forEach(header => xhr.setRequestHeader(header.key, header.value));

      xhr.onreadystatechange = () => { //Call a function when the state changes.
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          resolve(JSON.parse(xhr.responseText));
        }
      }

      xhr.onerror = err => {
        reject(err);
      }
      xhr.send(null);
    });
  }

  /**
   * Convert a dict of arguments to a pretty urlencoded string
   */
  static parseRequestParams(params) {
    if (!params) {
      return "";
    }

    let string = Object.keys(params).reduce((acc, key, idx) => {
      let firstChar = '?';
      if (idx != 0) {
        firstChar = '&';
      }
      return acc + `${firstChar}${key}=${params[key]}`;
    }, "");

    return encodeURI(string);
  }

  /**
   * Use find and replace to fill in the query params
   */
  static parseQueryArguments(uri, query) {
    let string = Object.keys(query).reduce((acc, key) => {
      acc = acc.replace(key, query[key]);
      return acc;
    }, uri)

    return string;
  }

}
