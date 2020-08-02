// 除法函数，用来得到精确的除法结果
// 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
// 调用：accDiv(arg1,arg2)
// 返回值：arg1除以arg2的精确结果
export const accDiv = (arg1, arg2) => {
  let t1 = 0;
  let t2 = 0;
  try {
    t1 = arg1.toString().split('.')[1].length;
  } catch (e) {
  }
  try {
    t2 = arg2.toString().split('.')[1].length;
  } catch (e) {
  }
  const r1 = Number(arg1.toString().replace('.', ''));
  const r2 = Number(arg2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
};

// 乘法函数，用来得到精确的乘法结果
// 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
// 调用：accMul(arg1,arg2)
// 返回值：arg1乘以arg2的精确结果
export const accMul = (...args) => {
  let m = 0;
  let results = 1;
  for (const item of args) {
    try {
      m += item.toString().split('.')[1].length;
    } catch (e) {
    }
  }
  for (const arg of args) {
    try {
      results *= Number(arg.toString().replace('.', ''));
    } catch (e) {
    }
  }
  return results / Math.pow(10, m);
};

// 加法函数，用来得到精确的加法结果
// 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
// 调用：accAdd(arg1,arg2)
// 返回值：arg1加上arg2的精确结果
export const accAdd = (...args) => {
  const list = [];
  for (const item of args) {
    let r = 0;
    try {
      r = item.toString().split('.')[1].length;
    } catch (e) {
      r = 0;
    }
    list.push(r);
  }
  const m = Math.pow(10, Math.max.apply(null, list));
  let result = 0;
  for (const arg of args) {
    result += accMul(arg, m);
  }
  return result / m;
};

// 减法函数，用来得到精确的减法结果
// 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
// 调用：accAdd(arg1,arg2)
// 返回值：arg1减arg2的精确结果
export const accSub = (...args) => {
  const list = [];
  for (const item of args) {
    let r = 0;
    try {
      r = item.toString().split('.')[1].length;
    } catch (e) {
      r = 0;
    }
    list.push(r);
  }
  const m = Math.pow(10, Math.max.apply(null, list));
  const result = args.reduce((pre, cur) => {
    return accMul(pre, m) - accMul(cur, m);
  });
  return result / m;
};
