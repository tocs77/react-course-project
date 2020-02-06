import React from 'react';
import BuildControl from './BuildControl/BuildControl';

import classes from './BuildControls.module.css';

const contrls = [
  { label: 'Salad', type: 'salad' },
  { label: 'Bacon', type: 'bacon' },
  { label: 'Cheese', type: 'cheese' },
  { label: 'Meat', type: 'meat' }
];
const buildControls = props => (
  <div className={classes.BuildControls}>
    <p>
      Current price: <strong>{props.price.toFixed(2)} $</strong>
    </p>
    {contrls.map(ctrl => (
      <BuildControl
        label={ctrl.label}
        key={ctrl.label}
        type={ctrl.type}
        added={() => props.ingridientAdded(ctrl.type)}
        removed={() => props.ingridientRemoved(ctrl.type)}
        disabled={props.disabled[ctrl.type]}
      />
    ))}
    <button
      className={classes.OrderButton}
      disabled={!props.purchaseable}
      onClick={props.ordered}
    >
      ORDER NOW
    </button>
  </div>
);

export default buildControls;
