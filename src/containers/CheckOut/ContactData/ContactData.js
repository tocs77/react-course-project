import React, {Component} from 'react'

import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import Spinner from '../../../components//UI/Spinner/Spinner'
import axios from '../../../axios-orders'

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: '',
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
            price: this.props.totalPrice,
            cusomer: {
                name: 'Ilk',
                address: {
                    street: 'Teststreet',
                    zipCode: '123456',
                    country: 'Burgistan',
                },
                email: 'test@test.com',
            },
            deliveryMethod: 'Fast',
        }
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

        let form = (<form>
            <input className={classes.Input} type="text" name='name' placeholder="Your Name"/>
            <input className={classes.Input} type="email" name='email' placeholder="Your Mail"/>
            <input className={classes.Input} type="text" name='street' placeholder="Street"/>
            <input className={classes.Input} type="text" name='postal' placeholder="Zip code"/>
            <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
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