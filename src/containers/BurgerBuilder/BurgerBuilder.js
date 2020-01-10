import React, {Component} from 'react'
import {connect} from 'react-redux'
import Aux from '../../hoc/Auxlillary/auxillary'

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import * as burgerBuilderActions from '../../store/actions/index'

import axios from '../../axios-orders'



class BurgerBuilder extends Component{

    state = {
        purchasing: false,
    }

    componentWillMount() {
        console.log(this.props)
  
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum ,el) =>{
                return sum+el
            }, 0)

        return sum > 0
    }

    

    purchaseHandler=()=> {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () =>{

        this.props.history.push('/checkout')
        
    }
    

    render(){
        const disabledInfo = {
            ...this.props.ings
        }

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        //console.log(disabledInfo)

        let orderSummary = ""
        if (this.state.purchasing) {
            orderSummary = <OrderSummary
                            ingredients={this.props.ings}
                            totalPrice={this.props.totalPrice}
                            purchaseCancelled = {this.purchaseCancelHandler}
                            purchaseContinued = {this.purchaseContinueHandler}/>;
                            
        }

        let burger = this.state.error ? <p>Ingridients can't be loaded</p>:<Spinner /> 

        if (this.props.ings) {
            burger = (<Aux>
                        <Burger ingredients={this.props.ings}/>
                        <BuildControls
                        ingridientAdded={this.props.onIngredientAdded}
                        ingridientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.totalPrice}
                        purchaseable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}/>
                    </Aux>
        );  
        }
      
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                   {orderSummary} 
                </Modal>
                {burger}

            </Aux>
            
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.ingredients,
        totalPrice: state.totalPrice,
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))