import React, { Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import { LOGOUT } from '../constants/actionTypes';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Button
} from "reactstrap";
import Axios from "axios";
import { baseUrl } from "../constants/apiEnv";
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom';

const mapStateToProps = state => ({
    currentUser : state.currentUser,
    redirectTo : state.redirectTo
})
const mapDispatchToProps = dispatch => ({
    onSubmmit: () => dispatch({ type: LOGOUT })
});

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmmit = () => {
      this.props.onSubmmit();
      this.props.history.push(this.props.redirectTo || "/");
  }
  render() {
    return (
    <Fragment>
        <Navbar style={{backgroundColor: "green", fontWeight: "700", fontSize: "20px"}} dark expand="md">
            <Collapse navbar>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <NavLink href="/">Home</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/users">Users</NavLink>
                    </NavItem>
                    {
                        this.props.currentUser ? 
                        <>
                            <NavItem>
                                <NavLink href="/profile">Profile</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/orders">Orders</NavLink>
                            </NavItem>
                        </>
                        : null
                    }
                    
                </Nav>
                <Nav navbar>
                    {
                        this.props.currentUser ? 
                        <>
                        <NavItem>
                            <NavLink className="logout" onClick={this.onSubmmit}>Logout</NavLink>
                        </NavItem>
                        </>
                        : <>
                        <NavItem>
                            <NavLink href="/login">LogIn</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/register">Register</NavLink>
                        </NavItem>
                        </>
                    }
                </Nav>
            </Collapse>
        </Navbar>
    </Fragment>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
