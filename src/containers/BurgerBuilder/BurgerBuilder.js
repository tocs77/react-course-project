import React, {Component} from 'react'
import Aux from '../../hoc/Auxlillary/auxillary'

import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import axios from '../../axios-orders'


const INGRIDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7,
}

class BurgerBuilder extends Component{

    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: false,
    }

    componentDidMount() {
        //console.log(this.props)
        axios.get('/ingredients')
            .then(response => {
                this.setState({ingredients: response.data})
                this.updatePurchaseState(response.data)
            })
            .catch(error => {
                this.setState({error: true})
            })
    }

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum ,el) =>{
                return sum+el
            }, 0)

        this.setState({purchaseable: sum > 0})
    }

    addIngridientHandler = (type) =>{
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngridients ={...this.state.ingredients}
        updatedIngridients[type] = updatedCount
        const priceAddition = INGRIDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice + priceAddition

        this.setState({ingredients: updatedIngridients, totalPrice:newPrice})
        this.updatePurchaseState(updatedIngridients)

    }

    removeIngridientHandler = (type) =>{
        const oldCount = this.state.ingredients[type]
        if (oldCount <= 0){
            return
        }
        const updatedCount = oldCount - 1
        const updatedIngridients ={...this.state.ingredients}
        updatedIngridients[type] = updatedCount
        const priceDeduction = INGRIDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice - priceDeduction

        this.setState({ingredients: updatedIngridients, totalPrice:newPrice})
        this.updatePurchaseState(updatedIngridients)
    }

    purchaseHandler=()=> {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () =>{

        // this.setState({loading: true})
        // const headers = {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //     //'Content-Type': 'application/json',
        //     //'Content-Type': 'multipart/form-data',
        // }
        // //alert("You continue!!!")
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     cusomer: {
        //         name: 'Ilk',
        //         address: {
        //             street: 'Teststreet',
        //             zipCode: '123456',
        //             country: 'Burgistan',
        //         },
        //         email: 'test@test.com',
        //     },
        //     deliveryMethod: 'Fast',
        // }
        // axios.post('/orders', order, {headers: headers})
        //     .then(response => {
        //         this.setState({loading: false, purchasing: false})
        //         console.log("Got responce: " + response)
        //     })
        //     .catch(error => {
        //         console.log("Super error "+ error.response)
        //         this.setState({loading: false, purchasing: false})
        //     });
        this.props.history.push('/checkout');
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        }

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        //console.log(disabledInfo)

        let orderSummary = ""
        if (this.state.purchasing) {
            orderSummary = <OrderSummary
                            ingredients={this.state.ingredients}
                            totalPrice={this.state.totalPrice}
                            purchaseCancelled = {this.purchaseCancelHandler}
                            purchaseContinued = {this.purchaseContinueHandler}/>;
                            
        }

        if (this.state.loading) {
            orderSummary = <Spinner />
        }

        let burger = this.state.error ? <p>Ingridients can't be loaded</p>:<Spinner /> 

        if (this.state.ingredients) {
            burger = (<Aux>
                        <Burger ingredients={this.state.ingredients}/>
                        <BuildControls
                        ingridientAdded={this.addIngridientHandler}
                        ingridientRemoved={this.removeIngridientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchaseable={this.state.purchaseable}
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

export default withErrorHandler(BurgerBuilder, axios)