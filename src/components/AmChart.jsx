import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AmChart() {
  useEffect(() => {
    const amChartFetch = async () => {
      try {
        const response = await axios.post(process.env.REACT_APP_DATA);

        let root = am5.Root.new("chartdiv");

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([am5themes_Animated.new(root)]);

        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        let chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX: true,
            paddingLeft: 0,
          })
        );

        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        let cursor = chart.set(
          "cursor",
          am5xy.XYCursor.new(root, {
            behavior: "none",
          })
        );
        cursor.lineY.set("visible", false);

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        let xAxis = chart.xAxes.push(
          am5xy.DateAxis.new(root, {
            maxDeviation: 0.5,
            baseInterval: {
              timeUnit: "day",
              count: 1,
            },
            renderer: am5xy.AxisRendererX.new(root, {
              minGridDistance: 80,
              minorGridEnabled: true,
              pan: "zoom",
            }),
            tooltip: am5.Tooltip.new(root, {}),
          })
        );

        let yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            maxDeviation: 1,
            renderer: am5xy.AxisRendererY.new(root, {
              pan: "zoom",
            }),
          })
        );

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        let series = chart.series.push(
          am5xy.SmoothedXLineSeries.new(root, {
            name: "Series",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            valueXField: "date",
            tooltip: am5.Tooltip.new(root, {
              labelText: "{valueY}",
            }),
          })
        );

        series.fills.template.setAll({
          visible: true,
          fillOpacity: 0.2,
        });

        series.bullets.push(function () {
          return am5.Bullet.new(root, {
            locationY: 0,
            sprite: am5.Circle.new(root, {
              radius: 4,
              stroke: root.interfaceColors.get("background"),
              strokeWidth: 2,
              fill: series.get("fill"),
            }),
          });
        });

        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        chart.set(
          "scrollbarX",
          am5.Scrollbar.new(root, {
            orientation: "horizontal",
          })
        );

        series.data.processor = am5.DataProcessor.new(root, {
          dateFormat: "yyyy-MM-dd",
          dateFields: ["date"],
        });

        series.data.setAll(response.data.amcharMonthSales);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);
      } catch (error) {
        console.error("Error posting data:", error);
      }
    };

    amChartFetch();
  }, []);

  return (
    <div>
      <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
}
