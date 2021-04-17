import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios-orders";

import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";

const BurgerBuilder = (props) => {
    // state = {
    //     // purchasable: false, // to toggle the ORDER button in BuildControls
    //     purchasing: false, // to toggle the modal
    //     // loading: false, // to show the spinner
    //     // error: false, // to conditionally render the spinner
    // };

    const [purchasing, setPurchasing] = useState(false);
    const dispatch = useDispatch();

    const ings = useSelector((state) => state.burgerBuilder.ingredients);
    const price = useSelector((state) => state.burgerBuilder.totalPrice);
    const error = useSelector((state) => state.burgerBuilder.error);
    const isAuthenticated = useSelector((state) => state.auth.token !== null);

    const onIngredientAdded = (ingrName) =>
        dispatch(actions.addIngredient(ingrName));
    const onIngredientRemoved = (ingrName) =>
        dispatch(actions.removeIngredient(ingrName));
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) =>
        dispatch(actions.setAuthRedirectPath(path));
    const onInitIngredients = useCallback(
        () => dispatch(actions.initIngredients()),
        [dispatch]
    );

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    // handled by Redux now

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients,
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState({
    //         totalPrice: newPrice,
    //         ingredients: updatedIngredients,
    //     });
    //     this.updatePurchaseState(updatedIngredients);
    // };

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if (oldCount <= 0) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients,
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState({
    //         totalPrice: newPrice,
    //         ingredients: updatedIngredients,
    //     });
    //     this.updatePurchaseState(updatedIngredients);
    // };

    // purchaseContinueHandler = () => {
    //     const queryParams = [];
    //     for (let i in this.state.ingredients) {
    //         queryParams.push(
    //             encodeURIComponent(i) +
    //                 "=" +
    //                 encodeURIComponent(this.state.ingredients[i])
    //         );
    //     }
    //     queryParams.push("price=" + this.state.totalPrice);

    //     const queryString = queryParams.join("&");

    //     this.props.history.push({
    //         pathname: "/checkout",
    //         search: "?" + queryString,
    //     });
    // };

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map((igKey) => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
    };

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true); // it shows the modal
        } else {
            onSetAuthRedirectPath("/checkout");
            props.history.push("/auth"); // Redirect to auth
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    };
    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push("/checkout");
    };

    const disabledInfo = {
        ...ings,
    };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = error ? <p>Ingredients can't be loaded..</p> : <Spinner />;

    if (ings) {
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={updatePurchaseState(ings)}
                    ordered={purchaseHandler}
                    isAuth={isAuthenticated}
                    price={price.toFixed(2)}
                />
            </Aux>
        );
        orderSummary = (
            <OrderSummary
                ingredients={ings}
                price={price.toFixed(2)} // toFixed(2) allows 2 decimals
                purchaseCanceled={purchaseCancelHandler}
                purchaseContinued={purchaseContinueHandler}
            />
        );
    }

    // if (state.loading) {
    //     orderSummary = <Spinner />;
    // }
    // {salad: true, patty: false, ...}
    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
};

// const mapStateToProps = (state) => {
//     return {
//         ings: state.burgerBuilder.ingredients,
//         price: state.burgerBuilder.totalPrice,
//         error: state.burgerBuilder.error,
//         isAuthenticated: state.auth.token !== null,
//     };
// };

// const mapDispatchToProps = (dispatch) => {
//     return {
//         onIngredientAdded: (ingrName) =>
//             dispatch(actions.addIngredient(ingrName)),
//         onIngredientRemoved: (ingrName) =>
//             dispatch(actions.removeIngredient(ingrName)),
//         onInitIngredients: () => dispatch(actions.initIngredients()),
//         onInitPurchase: () => dispatch(actions.purchaseInit()),
//         onSetAuthRedirectPath: (path) =>
//             dispatch(actions.setAuthRedirectPath(path)),
//     };
// };

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(withErrorHandler(BurgerBuilder, axios));

export default withErrorHandler(BurgerBuilder, axios);
