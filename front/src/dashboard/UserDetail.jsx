import React, { Fragment } from 'react';
import Axios from 'axios';
import { baseUrl } from '../constants/apiEnv';
import { connect } from 'react-redux';
import {
    GET_USER_DETAIL_BY_ID
} from '../constants/actionTypes';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const mapStateToProps = state => ({
    username : state.username,
    userDetail: state.userDetail
});
const mapDispatchToProps = dispatch => ({
    onLoad:(payload) => dispatch({type : GET_USER_DETAIL_BY_ID, payload}),
});

class UserDetail extends React.Component {
    constructor(props){
        super(props);
    }
    componentWillMount() {
        console.log("__params USERID___", this.props.match.params.userID);
    }
    componentDidMount() {
        const userID = this.props.match.params.userID;
        const payload = Axios.get(`${baseUrl}/users/${userID}`);
        this.props.onLoad(payload);
        const username = this.props.username;
        const userDetail = this.props.userDetail;
    }
    render() {
        return (
            <Fragment>
                <Card style={{marginTop: "30px", padding: "20px"}}>
                    <h3><span style={{color:"red"}}>"{this.props.username ? this.props.username : null}"</span> Information</h3>
                    <CardContent>
                        <h4 style={{}}><span style={{color:"green"}}>UserName:</span> {this.props.username ? this.props.username : null} </h4>
                    </CardContent>
                    <h4 style={{color: "#007bff"}}>Order History</h4>
                    <CardContent style={{display: "flex"}}>
                        <Grid container spacing={3}>
                            {
                                this.props.userDetail && this.props.userDetail.length > 0
                                ? this.props.userDetail.map((order, index) => {
                                    return (
                                        <Grid key={index} item xs={6} md={4}>
                                            <Card style={{ background: "yellowgreen", marginTop: "10px"}}>
                                                <CardContent style={{ marginLeft: "10%", textAlign: "left"}}>
                                                    <Typography style={{fontWeight: "600"}}><span style={{color: "blueviolet" , fontWeight: "600"}}>RestaurantName: &nbsp;</span>{order.restaurantName}</Typography>
                                                    <Typography style={{fontWeight: "600"}}><span style={{color: "blueviolet" , fontWeight: "600"}}>OriginCost:&nbsp; </span>${order.subtotal}</Typography>
                                                    <Typography style={{fontWeight: "600"}}><span style={{color: "blueviolet" , fontWeight: "600"}}>TotalCost:&nbsp; </span>${order.total}</Typography>
                                                    <Typography style={{fontWeight: "600"}}><span style={{color: "blueviolet" , fontWeight: "600"}}>DeliveryFee:&nbsp; </span>${order.fee}</Typography>
                                                    <Typography style={{fontWeight: "600"}}><span style={{color: "blueviolet" , fontWeight: "600"}}>Tax: &nbsp;</span>${order.tax}</Typography>
                                                    <Typography style={{fontWeight: "600"}}><span style={{color: "blueviolet" , fontWeight: "600"}}>OrderDate: &nbsp;</span>{order.createdAt}</Typography>
                                                    <hr/>
                                                    <Typography style={{fontWeight: "600"}}><span style={{color: "red" , fontWeight: "600"}}>OrderList:&nbsp;</span></Typography>
                                                    {
                                                        order.orders.map((orderItem, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <hr/>
                                                                    <ul style={{listStyleType: "none"}}>
                                                                        <li style={{fontWeight: "600"}}><span style={{fontWeight: "600", color: "blue"}}>Order Name:&nbsp;</span>{orderItem.name}</li>
                                                                        <li style={{fontWeight: "600"}}><span style={{fontWeight: "600", color: "blue"}}>Order Price:&nbsp;</span>{orderItem.price}</li>
                                                                        <li style={{fontWeight: "600"}}><span style={{fontWeight: "600", color: "blue"}}>Order Quantity:&nbsp;</span>{orderItem.quantity}</li>
                                                                    </ul>
                                                                    
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )
                                })
                                : null 
                            }
                        </Grid>
                    </CardContent>
                </Card>
            </Fragment>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);