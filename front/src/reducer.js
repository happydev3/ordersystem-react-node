import {
    LOGIN,
    REGISTER,
    LOGOUT,
    ASYNC_START,
    APP_LOAD,
    ORDERS_LOAD,
    ORDER_SUBMIT,
    PRIVACY_UPDATE,
    GET_USERS,
    GET_ORDERS_BY_USERID,
    GET_USER_DETAIL_BY_ID
} from './constants/actionTypes';

const initialState = {
    currentUser : null,
    redirectTo : null,
    restaurantList : [],
    searchedUsers : [],
    userOrderedList : [],
    userDetail: [],
    username: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
        case REGISTER:
            return {
                ...state,
                errors: action.error ? action.payload : null,
                currentUser: action.error ? state.currentUser : action.payload.user,
                redirectTo: action.error ? null : '/profile'
            };
        case LOGOUT:
            return { 
                ...state, 
                redirectTo: '/',
                currentUser: null,
            };
        case APP_LOAD:
            return {
                ...state,
                currentUser : action.error ? null : action.payload.user
            }
        case ORDERS_LOAD:
            return {
                ...state,
                restaurantList: action.error ? [] : action.payload.restaurantList
            }
        case ORDER_SUBMIT:
            return {
                ...state,
                redirectTo : action.error ? '/orders' : '/profile'
            }
        case PRIVACY_UPDATE:
            return {
                ...state
            }
        case GET_USERS:
            return {
                ...state,
                searchedUsers: action.error ? [] : action.payload.users
            }
        case GET_ORDERS_BY_USERID:
            return {
                ...state,
                userOrderedList : action.error ? [] : action.payload.orders
            }

        case GET_USER_DETAIL_BY_ID:
            return {
                ...state,
                userDetail: action.error ? [] : action.payload.userDetail,
                username: action.error ? null : action.payload.username
             }
        
        default:
            return state;
    }
    return state;
};