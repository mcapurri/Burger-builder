import React from "react";
import Aux from "../../../hoc/Aux/Aux";
import Button from "../../UI/Button/Button";

const OrderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients).map((igKey) => {
        let ingredient;
        if (props.ingredients[igKey] > 0) {
            ingredient = (
                <li key={igKey}>
                    <span style={{ textTransform: "capitalize" }}>{igKey}</span>
                    : {props.ingredients[igKey]}
                </li>
            );
        }
        return ingredient;
    });
    return (
        <Aux>
            <h3>Your order</h3>
            <p>
                Your chosen Burger with the following ingredients is on its way:
            </p>
            <ul>{ingredientSummary}</ul>
            <hr />
            <p>
                <strong>Total price: {props.price} €</strong>
            </p>
            <p>Continue to checkout?</p>
            <Button btnType="Danger" clicked={props.purchaseCanceled}>
                CHANGE
            </Button>
            <Button btnType="Success" clicked={props.purchaseContinued}>
                CONTINUE
            </Button>
        </Aux>
    );
};

export default OrderSummary;
