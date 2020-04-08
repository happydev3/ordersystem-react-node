import React, {Fragment} from "react";
import Input from '@material-ui/core/Input';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Axios from 'axios';
import {
    GET_USERS
} from '../constants/actionTypes';
import { baseUrl } from '../constants/apiEnv';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

const mapStateToProps = state => {
    return {
        searchedUsers : state.searchedUsers
    }};
  
const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: GET_USERS, payload}),
    onSubmitOrder: (payload) => dispatch({type : GET_USERS, payload})
});

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state  = {
            searchUserName: ""
        } 
    }
    onSubmit = () => {
        // console.log("_____________user search Input box___________", this.state.searchUserName);
        // let url = `${baseUrl}/getUsers/${this.state.searchUserName}`;
        // console.error("url", url);
        // const payLoad = Axios.get(url);
        // this.props.onLoad(payLoad);
    }
    onChangeHandle = (ev) => {
        this.setState({searchUserName: ev.target.value});
    }
    componentDidUpdate() {
        if(this.state.searchUserName.length >= 2 ) {
            let url = `${baseUrl}/getUsers/${this.state.searchUserName}`;
            console.error("url", url);
            const payLoad = Axios.get(url);
            this.props.onLoad(payLoad);
        } else {
            this.props.onLoad([]);
        }
    }
    render(){
        return(
            <Fragment>
                <div style={{marginTop: "90px"}}>
                    <span style={{fontSize: "20px"}}>User Search:   </span>
                    <Input 
                        onChange={ev => this.onChangeHandle(ev)} 
                        value={this.state.searchUserName}
                        type="text" 
                        name="searchParams"/>    
                    {/* <Button variant="contained" color="secondary" type="submit" onClick={this.onSubmit}>Search</Button> */}
                </div>
                <TableContainer style={{marginTop: "20px", width: "40%", marginLeft: "30%"}} component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                <TableCell align="right">Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.props.searchedUsers && this.props.searchedUsers.length ? 
                                    this.props.searchedUsers.map((user, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell component="th" scope="row">
                                                    {user.username}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {
                                                        user.privacy == false
                                                        ? <Link to={`/user_detail/${user._id}`}>
                                                            <Button color="primary">
                                                                Detail
                                                            </Button>
                                                        </Link>
                                                        
                                                        :<Link to={`/user_detail/${user._id}`} style={{cursor: "none"}} onClick={ (event) => event.preventDefault() }>
                                                            <Button style={{cursor: "not-allowed"}} color="primary">
                                                                Detail
                                                            </Button>
                                                        </Link>
                                                    }
                                                    
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }) 
                                : null
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Fragment>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Users);