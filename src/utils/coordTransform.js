// 坐标转换工具
// GCJ-02 (火星坐标系，高德地图) <-> WGS84 (GPS标准坐标系，大疆设备)

const PI = Math.PI;
const EARTH_RADIUS = 6378137.0; // 地球半径

// 判断是否在中国境内
function isInChina(lng, lat) {
  return lng >= 72.004 && lng <= 137.8347 && lat >= 0.8293 && lat <= 55.8271;
}

// 转换偏移量
function transformLat(lng, lat) {
  let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

function transformLng(lng, lat) {
  let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
  return ret;
}

// GCJ-02 转 WGS84 (高德地图坐标 -> GPS坐标)
export function gcj02ToWgs84(lng, lat) {
  if (!isInChina(lng, lat)) {
    return { lng, lat };
  }

  let dlat = transformLat(lng - 105.0, lat - 35.0);
  let dlng = transformLng(lng - 105.0, lat - 35.0);
  const radlat = lat / 180.0 * PI;
  let magic = Math.sin(radlat);
  magic = 1 - 0.00669342162296594323 * magic * magic;
  const sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / ((EARTH_RADIUS * (1 - 0.00669342162296594323)) / (magic * sqrtmagic) * PI);
  dlng = (dlng * 180.0) / (EARTH_RADIUS / sqrtmagic * Math.cos(radlat) * PI);
  const mglat = lat + dlat;
  const mglng = lng + dlng;
  
  // 使用迭代方法提高精度
  return {
    lng: lng * 2 - mglng,
    lat: lat * 2 - mglat
  };
}

// WGS84 转 GCJ-02 (GPS坐标 -> 高德地图坐标)
export function wgs84ToGcj02(lng, lat) {
  if (!isInChina(lng, lat)) {
    return { lng, lat };
  }

  let dlat = transformLat(lng - 105.0, lat - 35.0);
  let dlng = transformLng(lng - 105.0, lat - 35.0);
  const radlat = lat / 180.0 * PI;
  let magic = Math.sin(radlat);
  magic = 1 - 0.00669342162296594323 * magic * magic;
  const sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / ((EARTH_RADIUS * (1 - 0.00669342162296594323)) / (magic * sqrtmagic) * PI);
  dlng = (dlng * 180.0) / (EARTH_RADIUS / sqrtmagic * Math.cos(radlat) * PI);
  
  return {
    lng: lng + dlng,
    lat: lat + dlat
  };
}
