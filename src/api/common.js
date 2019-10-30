import MD5 from "js-md5";
// 时间戳转时间
export function _timestampToTime(timestamp) {
  let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '年';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
  let D = change(date.getDate()) + '日 ';
  let h = change(date.getHours()) + ':';
  let m = change(date.getMinutes()) + ':';
  let s = change(date.getSeconds());
  return Y + M + D + h + m + s;
}

function change(t) {
  if (t < 10) {
    return "0" + t;
  } else {
    return t;
  }
}

// 获取单位
export function _getUnit(unitNumber) {
  let unit = "";
  switch (unitNumber) {
    case 1:
      unit = "次";
      break;
    case 2:
      unit = "小时";
      break;
    case 3:
      unit = "日";
      break;
    case 4:
      unit = "周";
      break;
    case 5:
      unit = "月";
      break;
    case 6:
      unit = "套";
      break;
    default:
      break;
  }
  return unit;
}

// 处理时间选择数据
export function _getTimeList(eachTime) {
  console.log('_getTimeList')
  console.log(eachTime)
  // 处理时间间隔
  let [areaList, timeList, keyList, valList] = [new Object(), new Object(), [],
    []
  ];
  let city_list = {
    110100: "08",
    110200: "09",
    110300: "10",
    110400: "11",
    120100: "12",
    120200: "13",
    120300: "14",
    120400: "15",
    120500: "16",
    120600: "17",
    120700: "18",
    120800: "19",
    120900: "20",
    121000: "21",
    121100: "22"
  }
  let size = 15 - eachTime;
  for (let b in city_list) {
    if (size == 0) break;
    size--;
    keyList.push(b);
    valList.push(city_list[b]);
  }
  keyList.forEach((key, index) => {
    timeList[key] = valList[index];
  });
  areaList = {
    province_list: {
      110000: "上午",
      120000: "下午"
    },
    city_list: timeList,
    county_list: {
      110101: "00",
      110102: "30",
      110201: "00",
      110202: "30",
      110301: "00",
      110302: "30",
      110401: "00",
      110402: "30",
      120101: "00",
      120102: "30",
      120201: "00",
      120202: "30",
      120301: "00",
      120302: "30",
      120401: "00",
      120402: "30",
      120501: "00",
      120502: "30",
      120601: "00",
      120602: "30",
      120701: "00",
      120702: "30",
      120801: "00",
      120802: "30",
      120901: "00",
      120902: "30",
      121001: "00",
      121002: "30",
      121101: "00",
      121102: "30"
    }
  };
  return areaList;
}

// code js-md5
export function _getMd5Str(phone) {
  // MD5.enCode(
  //   MD5.enCode(timestamp + phone) +
  //   timestamp +
  //   MD5.enCode(timestamp + lastNumber) +
  //   phone
  // );
  let md5Str = '';
  let lastNumber = phone
    .split("")
    .reverse()
    .join("")
    .substr(0, 4)
    .split("")
    .reverse()
    .join("");
  let timestamp = +new Date();
  let str =
    timestamp +
    "" +
    phone +
    "" +
    timestamp +
    "" +
    timestamp +
    "" +
    lastNumber +
    "" +
    phone;
  md5Str = MD5(MD5(timestamp + phone) + timestamp + MD5(timestamp + lastNumber) + phone);
  return [timestamp, md5Str]
}
