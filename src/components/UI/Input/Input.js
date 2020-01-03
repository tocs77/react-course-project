import React from 'react'

import classes from './Input.module.css'

const input = (props) => {

    let inputElement =  null
    switch(props.elementType) {
        case('input'):
            inputElement = <input 
                            className={classes.InputElement}
                            {...props.elementConfig}
                            value={props.value}
                            onChange={props.changed}/>
            break
        case('textarea'):
            inputElement = <textarea 
                            className={classes.InputElement}
                            {...props.elementConfig}
                            value={props.value}
                            onChange={props.changed}/>
            break

        case('select'):
        let options = []
        for (let ind in props.elementConfig.options){
            options.push(<option
                            key={props.elementConfig.options[ind].value}
                            value={props.elementConfig.options[ind].value}>
                                {props.elementConfig.options[ind].displayValue}</option>)
        }
        inputElement = (
                        <select 
                        className={classes.InputElement}
                        value={props.value}
                        onChange={props.changed}>
                            {options}
                        </select>
                        );
            break
        default:
            inputElement = <input
                            className={classes.InputElement}
                            {...props.elementConfig}
                            value={props.value}
                            onChange={props.changed}/>

    }

    return( <div className={classes.Input}>
                <label className={classes.Label}>{props.label}</label>
                {inputElement}
            </div>
    );
    
};

export default input