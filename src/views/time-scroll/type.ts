import type { ComposeOption } from "echarts/core";
import type { LineSeriesOption, ScatterSeriesOption } from "echarts/charts";
import type {
  TooltipComponentOption,
  ToolboxComponentOption,
  DataZoomComponentOption,
  GridComponentOption,
  MarkLineComponentOption,
} from "echarts/components";

export interface DataItem {
  value: string | number;
}

export type EChartsOption = ComposeOption<
  | TooltipComponentOption
  | ToolboxComponentOption
  | DataZoomComponentOption
  | GridComponentOption
  | LineSeriesOption
  | ScatterSeriesOption
  | MarkLineComponentOption
>;

export interface MinMax {
  minCount: number;
  maxCount: number;
  maxCountDiff: number;
  minCountDiff: number;
  minYear: number;
  maxYear: number;
}
