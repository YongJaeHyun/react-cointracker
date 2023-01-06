import { useParams, useLocation } from "react-router";
import { Switch, Route, Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Price from "./Price";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLightAtom } from "../atoms";
import { useState } from "react";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 600px;
  margin: 0px auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Utils = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
`;

const HomeBtn = styled.div`
  display: flex;
  justify-content: center;
  width: 90px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  margin-bottom: 3vh;
  transition: all 0.2s ease-in-out;
  a {
    padding: 8px 10px;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
    color: whitesmoke;
  }
`;

const ToggleBG = styled.button<{ isChecked: boolean }>`
  display: flex;
  width: 80px;
  height: 35px;
  border: 2px solid ${(props) => (props.isChecked ? "white" : "black")};
  border-radius: 20px;
  align-items: center;
  background-color: ${(props) => (props.isChecked ? "#353b48" : "whitesmoke")};
  position: relative;
  cursor: pointer;
  color: ${(props) => (props.isChecked ? "whitesmoke" : "#353b48")};
  transition: all 0.2s ease-in-out;
  &:hover {
    border-color: ${(props) => props.theme.accentColor};
    span {
      color: ${(props) => props.theme.accentColor};
    }
    div {
      background-color: ${(props) => props.theme.accentColor};
    }
  }
`;

const ToggleText = styled.span<{ isChecked: boolean }>`
  left: ${(props) => (props.isChecked ? "8px" : "38px")};
  position: absolute;
  transition: all 0.4s ease-in-out;
`;

const ToggleFG = styled.div<{ isChecked: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 15px;
  background-color: ${(props) => (props.isChecked ? "white" : "black")};
  left: ${(props) => (props.isChecked ? "45px" : "3px")};
  position: absolute;
  transition: all 0.4s ease-in-out;
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface RouteParams {
  coinId: string;
}

interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

const Coin = () => {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const isLight = useRecoilValue(isLightAtom);
  const [isChecked, setIsChecked] = useState(!isLight);
  const setIsLight = useSetRecoilState(isLightAtom);

  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId),
    {
      refetchInterval: 10000,
    }
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId)
  );

  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Utils>
            <HomeBtn>
              <Link to="/">&larr; Home</Link>
            </HomeBtn>
            <ToggleBG
              isChecked={isChecked}
              onClick={() => {
                setIsChecked(!isChecked);
                setIsLight(!isLight);
              }}
            >
              <ToggleText isChecked={isChecked}>
                {isChecked ? "Dark" : "Light"}
              </ToggleText>
              <ToggleFG isChecked={isChecked} />
            </ToggleBG>
          </Utils>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>${infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>${tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Total Suply:</span>
              <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply:</span>
              <span>{tickersData?.max_supply}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>
          <Switch>
            <Route path="/:coinId/price">
              <Price coinId={coinId} />
            </Route>
            <Route path="/:coinId/chart">
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
};

export default Coin;
