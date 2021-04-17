import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";

const Checkout = (props) => {
    // UNSAFE_componentWillMount() {
    //     // i use query params to pass down the ingredients to the checkout component
    //     const query = new URLSearchParams(this.props.location.search);
    //     const ingredients = {};
    //     let price = 0;
    //     for (let param of query.entries()) {
    //         // ['salad', '1']
    //         if (param[0] === "price") {
    //             price = param[1];
    //         } else {
    //             ingredients[param[0]] = +param[1];
    //         }
    //     }
    //     this.setState({ ingredients: ingredients, totalPrice: price });
    // }

    const checkoutCanceledHandler = () => {
        props.history.goBack();
    };

    const checkoutContinuedHandler = () => {
        props.history.replace("/checkout/contact-data");
    };

    let summary = <Redirect to="/" />;
    if (props.ings) {
        const purchasedRedirect = props.purchased ? <Redirect to="/" /> : null;
        summary = (
            <div>
                {purchasedRedirect}
                <CheckoutSummary
                    ingredients={props.ings}
                    checkoutCanceled={checkoutCanceledHandler}
                    checkoutContinued={checkoutContinuedHandler}
                />
                <Route
                    path={props.match.path + "/contact-data"}
                    // render={(props) => (
                    //     <ContactData
                    //         ingredients={this.props.ings}
                    //         price={this.props.price}
                    //         {...props}
                    //     />
                    // )}
                    component={ContactData}
                />
            </div>
        );
    }
    return summary;
};

const mapStateToProps = (state) => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased,
    };
};

export default connect(mapStateToProps)(Checkout);
