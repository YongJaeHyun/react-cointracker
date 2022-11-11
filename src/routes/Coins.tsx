import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLightAtom } from "../atoms";
import { useState } from "react";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0px auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Utils = styled.div`
  display: flex;
  justify-content: flex-end;
  border-radius: 10px;
  margin-bottom: 25px;
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
`;

const ToggleText = styled.span<{ isChecked: boolean }>`
  left: ${(props) => (props.isChecked ? "8px" : "38px")};
  position: absolute;
  transition: all 0.5s ease-in-out;
`;

const ToggleFG = styled.div<{ isChecked: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 15px;
  background-color: ${(props) => (props.isChecked ? "white" : "black")};
  left: ${(props) => (props.isChecked ? "45px" : "3px")};
  position: absolute;
  transition: all 0.5s ease-in-out;
`;

const CoinsList = styled.ul``;

const Coin = styled.li<{ isLight: boolean }>`
  background-color: white;
  color: black;
  border-radius: 15px;
  margin-bottom: 10px;
  border: 1px solid ${(props) => (props.isLight ? "#bababa" : "whitesmoke")};
  a {
    display: flex;
    align-items: center;
    padding: 18px;
    transition: color 0.2s ease-in;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

const Coins = () => {
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);
  const isLight = useRecoilValue(isLightAtom);
  const [isChecked, setIsChecked] = useState(!isLight);
  const setIsLight = useSetRecoilState(isLightAtom);

  return (
    <Container>
      <Helmet>
        <title>The Cointracker</title>
      </Helmet>
      <Header>
        <Title>The Cointracker</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Utils>
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
          <CoinsList>
            {data?.slice(0, 100).map((coin) => (
              <Coin key={coin.id} isLight={isLight}>
                <Link
                  to={{
                    pathname: `/${coin.id}`,
                    state: { name: coin.name },
                  }}
                >
                  <Img
                    alt={`${coin.name}`}
                    src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                  />
                  {coin.name} &rarr;
                </Link>
              </Coin>
            ))}
          </CoinsList>
        </>
      )}
    </Container>
  );
};

export default Coins;
