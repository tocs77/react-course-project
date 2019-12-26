import React from 'react'
import BurgerIngridient from './BurgerIngridient/BurgerIngridient'

import classes from './/Burger.module.css'



const burger = (props) =>{
    let transformedIngridients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_, i) =>{
                return <BurgerIngridient key={igKey+i} type={igKey} />
            })
        }).reduce((arr, el) =>{
            return arr.concat(el)
        }, [])

        //console.log(transformedIngridients)

        if (transformedIngridients.length===0){
            transformedIngridients=<p>Please start adding ingredients</p>
        }
    return(
        <div className={classes.Burger}>
            <BurgerIngridient type="bread-top"/>
            {transformedIngridients}
            <BurgerIngridient type="bread-bottom"/>
        </div>
    )
}

export default burger