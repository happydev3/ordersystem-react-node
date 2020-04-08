import React , {Fragment} from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Axios from 'axios';
import { baseUrl } from '../constants/apiEnv';

import {
    ORDERS_LOAD,
    ORDER_SUBMIT
} from "../constants/actionTypes";
import { connect } from 'react-redux';
import buttonImg from '../assets/img/plus.png';
import MinusImg from '../assets/img/minus.png';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
const mapStateToProps = state => {
    return {
      restaurantList : state.restaurantList,
      redirectTo : state.redirectTo
    }
};
  
const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: ORDERS_LOAD, payload}),
    onSubmitOrder: (payload) => dispatch({type : ORDER_SUBMIT, payload})
});

class Orders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            spacing : 10,
            selectRest : null,
            selectedMenuItem : null,
            orderList : [],
        }
    }
    handleChange = (ev) => {
        this.setState({selectRest : ev.target.value, orderList : [] , selectedMenuItem : null})
    };
    onCategoryHandle = (ev, menuItem) => {
        this.setState({selectedMenuItem : menuItem})
    }
    onOrderHandle = (ev, item) => {
        let orders = this.state.orderList;
        orders.push(item);
        this.setState({orderList : orders});
    }
    componentDidMount() {
        const token = localStorage.getItem("jwt");
        const payload = Axios.get(`${baseUrl}/restaurant_list`, { headers : { "Authorization" : `Bearer ${token}`}})
        this.props.onLoad(payload);
    }
    onSubmitOrder = (ev, subTotal) => {
        const originList = this.state.orderList;
        const orderNameList = originList.map(order => order.name);
        const newOrderlist = originList.filter((order, index) => {
            return orderNameList.indexOf(order.name) === index;
        });
        const final = newOrderlist.map(order => {
            const quantity = originList.filter(data => data.name === order.name).length;
            return {
                quantity: quantity,
                name: order.name,
                price: order.price
            };
        })
        const detail = this.props.restaurantList.filter(rest => rest.value === this.state.selectRest)[0];
        const data = {
            restaurantID: detail.intro.id ,
            restaurantName: this.state.selectRest,
            subtotal: subTotal,
            total: subTotal + detail.intro.delivery_fee,
            fee: detail.intro.delivery_fee,
            tax: subTotal * 0.1,
            orders : final
        }
        const token = localStorage.getItem('jwt');
        const payload = Axios.post(`${baseUrl}/orders`, data, { headers : { "Authorization" : `Bearer ${token}`}});
        this.props.onSubmitOrder(payload);
    }
    onPopList = () => {
        let list = this.state.orderList;
        list.pop();
        this.setState({orderList: list});
    }
    render() {
        const Rest = this.props.restaurantList.length && this.state.selectRest ? this.props.restaurantList.filter(rest => rest.value === this.state.selectRest)[0] : null;
        const OrderedList = this.state.orderList;
        const subTotal = OrderedList.length && OrderedList.reduce((accumulator, currentValue, currentIndex, array)=>{ return { price : accumulator.price + currentValue.price };}).price;
        const deliveryFee = Rest && Rest.intro.delivery_fee;
        const remaindCost = Rest && Rest.intro.min_order - (OrderedList.length && OrderedList.reduce((accumulator, currentValue, currentIndex, array)=>{ return { price : accumulator.price + currentValue.price };}).price) - Rest.intro.delivery_fee;
        const Total = subTotal + deliveryFee;
        return(
            <Fragment>
                <Grid container style={{marginTop: "30px"}} spacing={this.state.spacing}>
                    <Grid item xs={12}>
                        <Grid container justify="space-between" >
                            <Grid item xs={3}>
                            <Card style={{ padding: "10px", position: "fixed",marginLeft: "50px"}} variant="outlined">
                                <h2 style={{color: "green"}}>Restraunt</h2>
                                <FormControl>
                                    <InputLabel id="demo-simple-select-label">Select Restraunt</InputLabel>
                                    <Select
                                        style={{width: "170px"}} 
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        defaultValue = ""
                                        onChange={ev => this.handleChange(ev)}
                                    >
                                        {
                                            this.props.restaurantList.map((rest, index) => {
                                                return <MenuItem key={index} value={rest.value}> {rest.name} </MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <hr/>
                                <ButtonGroup
                                    orientation="vertical"
                                    color="primary"
                                    aria-label="vertical outlined primary button group" 
                                    size="large"
                                    style={{listStyleType: "none", fontSize: "20px",marginTop: "20px", width: "250px"}} 
                                >
                                {
                                    Rest ? Rest.intro.menu.map((menuItem, index) => {
                                        return <Button style={{paddingBottom: "10px"}} key={index} onClick={ev => this.onCategoryHandle(ev, menuItem)}>
                                                    <a href={`#${menuItem.category}`}>{menuItem.category}</a>
                                                </Button>
                                    }) : null
                                }
                                </ButtonGroup>
                                <h2></h2>
                            </Card>
                            </Grid>
                            <Grid item xs={5}>
                            <Card style={{ padding: "10px"}} variant="outlined">
                                <h2 style={{color: "green"}}>Order Form</h2>
                                {
                                    Rest ? Rest.intro.menu.map((menuItem, index) => {
                                        return (
                                            <div key={index} >
                                                <h4 style={{color: "#007bff", marginTop: "20px"}} id={`${menuItem.category}`}>{menuItem.category}</h4>
                                                <ul style={{listStyleType: "none" , textAlign: "left"}}>
                                                    {
                                                        menuItem.detail.map((item, index) => {
                                                            return (
                                                                    <React.Fragment key={index}>
                                                                         <Card style={{display: "flex", marginBottom: "20px" ,justifyContent: "space-between", padding: "10px"}} variant="outlined">
                                                                             
                                                                        {/* <div style={{display: "flex", marginBottom: "20px" ,justifyContent: "space-between"}}> */}
                                                                            <div>
                                                                                <li style={{fontWeight: "600"}}><span style={{color: "darkorchid"}}>Name:&nbsp;&nbsp; </span>{item.name}</li>
                                                                                <li style={{fontWeight: "600"}}><span style={{color: "darkorchid"}}>Description:&nbsp;&nbsp; </span>{item.description}</li>
                                                                                <li style={{fontWeight: "600"}}><span style={{color: "darkorchid"}}>Price:&nbsp;&nbsp;  </span>{item.price}</li>
                                                                            </div>
                                                                            <img src={buttonImg} style={{height: "30px", marginTop: "20px"}} onClick={ev => this.onOrderHandle(ev,item)}></img>
                                                                        {/* </div> */}
                                                                        </Card>
                                                                    </React.Fragment>
                                                            );
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        )
                                    }) : null
                                }
                                </Card>
                            </Grid>
                            <Grid item xs={4}>
                            <Card style={{ padding: "10px", position: "fixed", marginLeft: "50px"}} variant="outlined">
                                <h2 style={{color: "green"}}>Order Summary</h2>
                                <ul style={{listStyleType: "none", textAlign: "left"}}>
                                    {
                                        this.state.orderList.length 
                                        ? this.state.orderList.map((orderItem, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <li>
                                                            <span style={{color: "#007bff"}}>"{orderItem.name}"</span>, <span style={{color: "orange"}}>"{orderItem.description}"</span>, <span style={{color: "blue"}}>"{orderItem.price}"</span> 
                                                            <img src={MinusImg} style={{height: "20px"}} onClick={ev => this.onPopList()}></img>
                                                        </li>
                                                    </React.Fragment>
                                                );
                                            }) 
                                        : null
                                    }
                                </ul>
                                <ul style={{listStyleType: "none",textAlign: "left", color: "red"}}>
                                    <li>Subtotal: { subTotal }</li>
                                    <li>Tax:{ subTotal*0.1 }</li>
                                    <li>Delivery Fee:$ { deliveryFee }</li>
                                    <li>Total: $ { Total }
                                    </li>
                                    <li>Add $ {remaindCost > 0 ? remaindCost : null} more to your order.
                                    </li>
                                </ul>
                                <hr />
                                {  remaindCost < 0 ?
                                <Button variant="contained" color="secondary" onClick={ev => this.onSubmitOrder(ev, subTotal)}>order</Button>
                                : null}
                                <span></span>
                                    </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }
}
export default connect(mapStateToProps, mapDispatchToProps) (Orders);