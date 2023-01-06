import { useRecoilValue } from "recoil";
import { isLightAtom } from "../atoms";
import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import styled from "styled-components";

const Table = styled.table<{ isLight: boolean }>`
  display: table;
  width: 100%;
  min-width: min-content;
  border: 1px solid #bababa;
  border-bottom-width: 1px;
  table-layout: fixed;
  border-collapse: collapse;
  border-radius: 10px;
  border-style: hidden;
  box-shadow: 0 0 0 1px ${(props) => (props.isLight ? "#353b48" : "white")};
  line-height: 30px;
  margin-bottom: 20px;
`;
const Thead = styled.thead`
  border-spacing: 0;
  border-collapse: separate;
`;
const Tr = styled.tr`
  display: table-row;
`;
const Th = styled.th``;
const Tbody = styled.tbody``;
const Td = styled.td`
  border-top: 2px solid #bababa;
  text-align: center;
`;

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

const Price = ({ coinId }: ChartProps) => {
  const isLight = useRecoilValue(isLightAtom);
  const columns = [
    "date",
    "open",
    "close",
    "high",
    "low",
    "change" /* current closing price - previous closing price */,
  ];
  const { isLoading, data: priceData } = useQuery<IHistory[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId)
  );
  const dateFormatter = new Intl.RelativeTimeFormat("en");
  const dollarFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "usd",
    maximumFractionDigits: 2,
  });
  return (
    <div>
      {isLoading ? (
        "Loading Price..."
      ) : (
        <Table isLight={isLight}>
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th key={column}>{column}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {priceData?.map(({ open, close, high, low }, index) => (
              <Tr key={open + close + low + high}>
                <Td>{dateFormatter.format((index + 1) * -1, "day")}</Td>
                <Td>${open}</Td>
                <Td>${close}</Td>
                <Td>${high}</Td>
                <Td>${low}</Td>
                <Td>
                  {dollarFormatter.format(
                    parseFloat(close) - parseFloat(priceData[index + 1]?.close)
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
};

export default Price;
