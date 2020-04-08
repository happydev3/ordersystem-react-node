import React from 'react';
import Layout from './shard/Layout';
import SignUp from './auth/SignUp';
import Login from './auth/Login';
import Home from './dashboard/Home';
import Users from './dashboard/Users';
import Order from './dashboard/Orders';
import OrderDetail from './dashboard/OrderDetail';
import Profile from './dashboard/Profile';
import UserDetail from './dashboard/UserDetail';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import { APP_LOAD } from './constants/actionTypes';
import {connect} from "react-redux";
import { baseUrl } from './constants/apiEnv';

const mapStateToProps = state => {
  return {
    ...state
  }};

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: APP_LOAD, payload}),
});

class App extends React.Component {
  constructor() {
    super();

  }
  componentDidMount() {
    const token = window.localStorage.getItem('jwt');
    if(token) {
      const payload = token ? Axios.get(`${baseUrl}/user`, { headers: {"Authorization" : `Bearer ${token}`} }) : null;
      this.props.onLoad(payload);
    }
  }
  render() {
    return (
      <div className="App">
        <Layout />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={SignUp} />
          <Route path="/users" component={Users} />
          <Route path="/orders" component={Order} />
          <Route path="/profile" component={Profile} />
          <Route path="/user_detail/:userID" component={UserDetail} />
          <Route path="/order_detail/:orderID" component={OrderDetail} />
        </Switch>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
