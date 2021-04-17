import * as actionTypes from "./actionTypes";
import axios from "axios";
import { API_KEY } from "../../assets/secrets.json";
export const authStart = () => {
    return {
        type: actionTypes.AUTH_START,
    };
};
export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId,
    };
};
export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error,
    };
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId");
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};
export const checkAuthTimeout = (expirationTime) => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};
export const auth = (email, password, isSignedUp) => {
    return (dispatch) => {
        dispatch(authStart());
        const authData = {
            email,
            password,
            returnSecureToken: true,
        };
        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
        if (!isSignedUp) {
            url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
        }
        axios
            .post(url, authData)
            .then((response) => {
                console.log(response);
                const expirationDate = new Date(
                    new Date().getTime() + response.data.expiresIn * 1000
                );
                localStorage.setItem("token", response.data.idToken); // save the token in the local storage
                localStorage.setItem("expiration date", expirationDate);
                localStorage.setItem("userId", response.data.localId);

                dispatch(
                    authSuccess(response.data.idToken, response.data.localId)
                );
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch((err) => {
                console.log(err);
                dispatch(authFail(err.response.data.error));
            });
    };
};

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path,
    };
};

export const authCheckState = () => {
    return (dispatch) => {
        const token = localStorage.getItem("token");
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(
                localStorage.getItem("expirationDate")
            );
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem("userId");
                dispatch(authSuccess(token, userId));
                dispatch(
                    checkAuthTimeout(
                        (expirationDate.getTime() - new Date().getTime()) / 1000
                    )
                );
            }
        }
    };
};
