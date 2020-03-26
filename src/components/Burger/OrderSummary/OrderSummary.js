import React from 'react';
import Button from '../../UI/Button/Button';

import Aux from '../../../hoc/Auxlillary/auxillary';

const OrderSummary = props => {

  //console.log("Order ", props.ingredients)
  const ingredientSummary = Object.keys(props.ingredients).map(igKey => {
    return (
      <li key={igKey}>
        <span style={{ textTransform: 'capitalize' }}>{igKey}</span>:{' '}
        {props.ingredients[igKey]}
      </li>
    );
  });

  return (
    <Aux>
      <h3>Your order</h3>
      <p>A delicious burger with the following ingredients:</p>
      <ul>{ingredientSummary}</ul>
      <p>
        Total price: <strong>{props.totalPrice.toFixed(2)} $</strong>
      </p>
      <p>Continue to checkout?</p>
      <Button btnType='Danger' clicked={props.purchaseCancelled}>
        CANCEL
      </Button>
      <Button btnType='Success' clicked={props.purchaseContinued}>
        CONTINUE
      </Button>
    </Aux>
  );
};

export default OrderSummary;
