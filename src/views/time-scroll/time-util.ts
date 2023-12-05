import { EChartsOption, IDataItem, IMinMax } from "./type";

export const getMinMax = ({
  lineData,
  xAxisData,
}: {
  lineData: Array<string | number | IDataItem>;
  xAxisData: Array<string | number | IDataItem>;
}): IMinMax => {
  const minMax: IMinMax = {
    minCount: 0,
    maxCount: 0,
    maxCountDiff: 0,
    minCountDiff: 0,
    minYear: 0,
    maxYear: 0,
  };

  const sortFn = (
    a: string | number | IDataItem,
    b: string | number | IDataItem
  ) => Number.parseInt(`${a}`) - Number.parseInt(`${b}`);

  const getValue = (item: string | number | IDataItem) =>
    typeof item === "object" ? item.value : item;

  const countData = lineData.map(getValue).sort(sortFn);
  const yearData = xAxisData.map(getValue).sort(sortFn);

  minMax.minCount = Number.parseInt(`${countData.at(0)}`);
  minMax.maxCount = Number.parseInt(`${countData.at(-1)}`);
  minMax.maxCountDiff = (minMax.maxCount - minMax.minCount) / 2;
  minMax.minCountDiff = Number.parseInt(`${countData.at(1)}`) - minMax.minCount;

  minMax.minYear = Number.parseInt(`${yearData.at(0)}`);
  minMax.maxYear = Number.parseInt(`${yearData.at(-1)}`);

  return minMax;
};

export const getOptions = ({
  xAxisData,
  minMax,
  lineData,
  scatterData,
  color
}): EChartsOption => ({
  tooltip: {
    // show: false,
    trigger: "axis",
    axisPointer: {
      animation: false,
      // lineStyle: {
      //   type: "solid",
      //   width: 1,
      //   color: "red",
      // },
    },
    formatter: "{c}",
  },
  dataZoom: [
    {
      show: false,
      realtime: true,
    },
    {
      type: "inside",
      show: false,
      realtime: false,
    },
  ],
  grid: [
    {
      left: 10,
      top: 0,
      right: 40,
      bottom: 0,
    },
  ],
  xAxis: [
    {
      type: "category",
      show: false,
      boundaryGap: false,
      data: xAxisData,
      splitLine: {
        show: false,
      },
    },
  ],
  yAxis: [
    {
      name: "",
      type: "value",
      show: false,
      max: minMax.maxCount + minMax.maxCountDiff,
      min: minMax.minCount - minMax.minCountDiff,
      splitLine: {
        show: false,
      },
    },
  ],
  series: [
    {
      name: "line",
      type: "line",
      symbol: "circle",
      symbolSize: 4,
      data: lineData,
      itemStyle: {
        color
      },
      lineStyle: {
        color
      },
      markLine: {
        symbol: "none",
        label: {
          show: false,
        },
        lineStyle: {
          color: "#fff",
          width: 1,
          type: "solid",
        },
        data: [
          {
            name: "",
            yAxis: minMax.maxCount + minMax.maxCountDiff / 3,
          },
        ],
        silent: true,
      },
    },
    {
      name: "scatter",
      type: "line",
      symbol: "circle",
      symbolSize: 6,
      data: scatterData,
      lineStyle: {
        color: "rgba(0, 0, 0, 0)",
      },
      itemStyle: {
        color
      },
    },
  ],
});
