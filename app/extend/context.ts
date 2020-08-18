import { Response } from '../interface';

module.exports = {
  success({
    status = 200,
    code = 0,
    msg = '',
    data = {},
  }: Response = {}): void {
    this.body = {
      code,
      msg: msg || this.helper.errorMsg(code),
      data,
    };
    this.status = status;
  },

  badRequest({
    status = 400,
    code = 20001,
    msg = '',
    data = {},
  }: Response = {}): void {
    this.body = {
      code,
      msg: msg || this.helper.errorMsg(code),
      data,
    };
    this.status = status;
  },

  unauthorized({
    status = 200,
    code = 10004,
    msg = '',
    data = {},
  }: Response): void {
    this.body = {
      code,
      msg: msg || this.helper.errorMsg(code),
      data,
    };
    this.status = status;
  },

  forbidden({
    status = 403,
    code = 20003,
    msg = '',
    data = {},
  }: Response = {}): void {
    this.body = {
      code,
      msg: msg || this.helper.errorMsg(code),
      data,
    };
    this.status = status;
  },

  notFound({ status = 404, code, msg = '', data = {} }: Response): void {
    this.body = {
      code,
      msg: msg || this.helper.errorMsg(code),
      data,
    };
    this.status = status;
  },

  failure({
    status = 200,
    code = 20002,
    msg = '',
    data = {},
  }: Response = {}): void {
    this.body = {
      code,
      msg: msg || this.helper.errorMsg(code),
      data,
    };
    this.status = status;
  },
};
