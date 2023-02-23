import React from "react";
import ReactDOM from 'react-dom/client';
import { Chart } from "react-google-charts";

// 變數宣告
const root = ReactDOM.createRoot(document.getElementById("testArea"));
var maxNum = 10
var chartDataArray = [
  ['Timestamp', 'Tokyo', 'London', 'Average']
]

// 更新 chartDataArray 的資料
async function updateArray() {

  // 使用 fetch 取得 API 資料
  fetch('http://59.127.3.132:8000/')
  // 首次執行 fetch 後的資料還沒辦法使用 json 資料
  .then((response) => {
    return response.json()
  })
  // 於第二次的 then 中開始使用 json 資料
  .then((json_data) => {
    var newData = json_data

    // 設置 Y 軸的最大值，超過時取代原值
    if (newData['tokyo'] + 20 > maxNum) {
      maxNum = newData['tokyo'] + 20
    }
    if (newData['london'] + 20 > maxNum) {
      maxNum = newData['london'] + 20
    }

    // 將資料放入 chartDataArray 中
    // ['Timestamp', 'Tokyo', 'London', 'Average']
    var currentTime = new Date();
    chartDataArray.push(
      [
        ("0" + currentTime.getUTCMinutes()).slice(-2) + ":" + ("0" + currentTime.getUTCSeconds()).slice(-2),
        newData['tokyo'],
        newData['london'],
        (newData['tokyo'] + newData['london']) / 2
      ]
    )

    // 每 10 秒會載入一次新資料，也就是 60 筆資料就會達到限制的 10 分鐘
    // 含標頭在內，超過 61 筆資料後刪除 index 1 的資料（保留標頭但移除最舊的資料）
    if (chartDataArray.length > 61) {
      chartDataArray.splice(1, 1)
    }

    // 重新 render 圖表
    root.render(ChartApp())

  })
}

// Render
export function ChartApp() {
  console.log(maxNum)
  return (
    <Chart
      chartType="LineChart"
      width="100%"
      height="400px"
      data={chartDataArray}
      options={{
        title: "002 React Chart",
        curveType: "function",
        legend: { position: "bottom" },
        vAxis: { viewWindow: {
          min: 0,
          max: {maxNum}
        }}
      }}
    />
  );
}

// 首次執行取得資料與 render
updateArray()

// 每 10 秒再重新執行一次
setInterval(function() { updateArray() }, 10000)