import { BrowserRouter, Switch, Route } from "react-router-dom";
import Coin from "./routes/Coin";
import Coins from "./routes/Coins";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/react-cointracker/:coinId">
          <Coin />
        </Route>
        <Route path="/react-cointracker">
          <Coins />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
