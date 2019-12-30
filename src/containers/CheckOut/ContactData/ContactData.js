import React, {Component} from 'react'

import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
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
            price: parseFloat(this.props.price),
            customer: {
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

        let form = (<form>
            <Input  inputtype="input" type="text" name='name' placeholder="Your Name"/>
            <Input  inputtype="input" type="email" name='email' placeholder="Your Mail"/>
            <Input  inputtype="input" type="text" name='street' placeholder="Street"/>
            <Input  inputtype="input" type="text" name='postal' placeholder="Zip code"/>
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