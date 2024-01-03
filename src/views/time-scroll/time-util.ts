import { EChartsOption, DataItem, MinMax } from "./type";

export const getMinMax = ({
  lineData,
  xAxisData,
}: {
  lineData: Array<string | number | DataItem>;
  xAxisData: Array<string | number | DataItem>;
}): MinMax => {
  const minMax: MinMax = {
    minCount: 0,
    maxCount: 0,
    maxCountDiff: 0,
    minCountDiff: 0,
    minYear: 0,
    maxYear: 0,
  };

  const sortFn = (
    a: string | number | DataItem,
    b: string | number | DataItem
  ) => Number.parseInt(`${a}`) - Number.parseInt(`${b}`);

  const getValue = (item: string | number | DataItem) =>
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
  color,
  isShowScatter
}): EChartsOption => ({
  tooltip: {
    show: true,
    enterable: false,
    trigger: "axis",
    formatter: "{c}",
    transitionDuration: 0
  },
  grid: [
    {
      left: 10,
      top: 0,
      right: 40,
      bottom: 20,
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
      markLine: isShowScatter ? {
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
      } : {},
      connectNulls: true
    },
    {
      name: "scatter",
      type: "scatter",
      symbol: "circle",
      symbolSize: 6,
      data: isShowScatter ? scatterData : [],
      // lineStyle: {
      //   color: "rgba(0, 0, 0, 0)",
      // },
      itemStyle: {
        color
      }
    },
  ],
});
