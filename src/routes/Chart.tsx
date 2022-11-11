import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isLightAtom } from "../atoms";

interface ChartProps {
  coinId: string;
}

interface IHistory {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

interface IChartColumn {
  x: Date;
  y: number[];
}

const Chart = ({ coinId }: ChartProps) => {
  const isLight = useRecoilValue(isLightAtom);
  const { isLoading, data: priceData } = useQuery<IHistory[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId)
  );
  return (
    <div>
      {isLoading ? (
        "Loading Chart..."
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data: priceData?.map((price) => {
                return {
                  x: new Date(price.time_close),
                  y: [price.open, price.high, price.low, price.close].map(
                    Number
                  ),
                };
              }) as IChartColumn[],
            },
          ]}
          options={{
            theme: {
              mode: isLight ? "light" : "dark",
            },
            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            grid: {
              show: false,
            },
            xaxis: {
              labels: { show: false },
              categories: priceData?.map((price) =>
                new Date(price.time_close).toISOString()
              ) as string[],
              type: "datetime",
              axisTicks: {
                show: false,
              },
            },
            yaxis: {
              show: false,
            },
            plotOptions: {
              candlestick: {
                wick: {
                  useFillColor: true,
                },
                colors: { upward: "#4cd137", downward: "#e84118" },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default Chart;
