import { Message } from 'element-ui';

export function error (message = '错误', obj) {
  const msg = Object.assign({ showClose: true, message, type: 'error' }, obj);
  Message(msg);
}
export function info (message = '取消', obj) {
  const msg = Object.assign({ showClose: true, message, type: 'info' }, obj);
  Message(msg);
}
export function success (message = '成功', obj) {
  const msg = Object.assign({ showClose: true, message, type: 'success' }, obj);
  Message(msg);
}

export function warning (message = '警告', obj) {
  const msg = Object.assign({ showClose: true, message, type: 'warning' }, obj);
  Message(msg);
}
const VMessage = {
  error,
  info,
  success,
  warning
};

export default VMessage;
