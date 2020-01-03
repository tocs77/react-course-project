import React, {Component} from 'react'

import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import axios from '../../../axios-orders'

class ContactData extends Component {
    state = {
        orderForm:{
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name',
                },
                value: '',
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street',
                },
                value: '',
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP code',
                },
                value: '',
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country',
                },
                value: '',
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Mail',
                },
                value: '',
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'},
                    ],
                },
                value: '',
            },
        },
        loading: false,
    }

    orderHandler = (event) =>{
        event.preventDefault(); // Prevent form reloading
                this.setState({loading: true})
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            //'Content-Type': 'application/json',
            //'Content-Type': 'multipart/form-data',
        }
        //alert("You continue!!!")
        const order = {
            ingredients: this.props.ingredients,
            price: parseFloat(this.props.price),
            
            deliveryMethod: 'Fast',
        }

        console.log("Send user data:", order)
        axios.post('/orders', order, {headers: headers})
            .then(response => {
                this.setState({loading: false})
                this.props.history.push('/')
            })
            .catch(error => {
                console.log("Super error "+ error.response)
                this.setState({loading: false})
            });
    }

    render() {

        let formElementsArray = [];

        for (let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (<form>
            {formElementsArray.map(formElement => (
                <Input
                    key={formElement.id}
                    elementType = {formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}/>
            ))}
            <Button inputtype="input" btnType="Success" clicked={this.orderHandler}>ORDER</Button>
             </form>);
        if(this.state.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        );
    }
}

export default ContactData