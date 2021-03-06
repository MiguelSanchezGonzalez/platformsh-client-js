import Ressource from "./Ressource";
import { getConfig } from "../config";
import _urlParser from "../urlParser";
import request from "../api";

const _url = "/platform/setup/config";
const paramDefaults = {};
// /api/platform/setup/registry\?service\=redis-persistent

export default class SetupConfig extends Ressource {
  constructor(setupConfig, url = `${_url}?service=:service&format=:format`) {
    // _url
    //   paramDefaults,
    //   params,
    //   data = {},
    //   _creatableField = [],
    //   _modifiableField = []
    // ) {
    super(url, paramDefaults, {}, setupConfig, []);
    this._queryUrl = Ressource.getQueryUrl(url);
    this.app = "";
    this.service = "";
  }

  static get({ service, format = "commented" }, customUrl) {
    const { api_url } = getConfig();
    const url =
      customUrl || `${api_url}${_url}?service=:service&format=:format`;
    const parsedUrl = _urlParser(url, { service, format });
    return request(parsedUrl, "POST").then(data => {
      return typeof data === "undefined"
        ? undefined
        : new this.prototype.constructor(data, _url);
    });
  }
}
