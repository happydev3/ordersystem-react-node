import React, {Fragment} from 'react';
import Switch from '@material-ui/core/Switch';
import { connect } from 'react-redux';
import Axios from 'axios';
import { baseUrl } from '../constants/apiEnv';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {
    PRIVACY_UPDATE,
    GET_ORDERS_BY_USERID
} from '../constants/actionTypes';
import { green } from '@material-ui/core/colors';

const mapStateToProps = state => ({
    currentUser : state.currentUser,
    userOrderedList: state.userOrderedList
});
const mapDispatchToProps = dispatch => ({
    onPrivacyUpdate: (payload) => dispatch({type : PRIVACY_UPDATE, payload}),
    onLoad:(payload) => dispatch({type : GET_ORDERS_BY_USERID, payload}),
});

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }
    onHandleCheck = (ev) => {
        this.setState({checked : !this.state.checked}, () => {
            const token = localStorage.getItem("jwt");
            const data = {
                privacy : this.state.checked
            }
            const payload = Axios.post(`${baseUrl}/profile`,data, { headers : { "Authorization" : `Bearer ${token}`}});
            this.props.onPrivacyUpdate(payload);
        });
    }
    componentDidMount() {
        const token = localStorage.getItem('jwt');
        const payload = Axios.get(`${baseUrl}/orders`, { headers : { "Authorization" : `Bearer ${token}`}});
        this.props.onLoad(payload);
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({checked : nextProps.currentUser && nextProps.currentUser.privacy});
    }
    componentDidUpdate(prevProps, prevState, snapShot) {
    }
    render(){
        return(
            <Fragment>
                <Card style={{marginTop: "30px", padding: "20px"}}>
                    <h3><span style={{color:"red"}}>"{this.props.currentUser ? this.props.currentUser.username : null}"</span> Information</h3>
                    <CardContent>
                        <h4 style={{}}><span style={{color:"green"}}>UserName:</span> {this.props.currentUser ? this.props.currentUser.username : null} </h4>
                        <h4><span style={{color: "green"}}>Privacy setting: </span>
                            <Switch
                                onChange={this.onHandleCheck}
                                checked={this.state.checked}
                            />
                        </h4>
                    </CardContent>
                    <h4 style={{color: "#007bff"}}>Order History</h4>
                    <CardContent style={{display: "flex"}}>
                        <Grid container spacing={3}>
                            {
                                this.props.userOrderedList && this.props.userOrderedList.length > 0
                                ? this.props.userOrderedList.map((order) => {
                                    return (
                                        <Grid item xs={6} md={4}>
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
                                                        order.orders.map((orderItem) => {
                                                            return (
                                                                <>
                                                                    <hr/>
                                                                    <ul style={{listStyleType: "none"}}>
                                                                        <li style={{fontWeight: "600"}}><span style={{fontWeight: "600", color: "blue"}}>Order Name:&nbsp;</span>{orderItem.name}</li>
                                                                        <li style={{fontWeight: "600"}}><span style={{fontWeight: "600", color: "blue"}}>Order Price:&nbsp;</span>{orderItem.price}</li>
                                                                        <li style={{fontWeight: "600"}}><span style={{fontWeight: "600", color: "blue"}}>Order Quantity:&nbsp;</span>{orderItem.quantity}</li>
                                                                    </ul>
                                                                    
                                                                </>
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
export default connect(mapStateToProps, mapDispatchToProps)(Profile);