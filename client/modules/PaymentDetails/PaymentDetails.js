// PaymentDetails.js
import React, { Component, PropTypes } from "react";
import {
  Alert,
  Button,
  FormGroup,
  Label,
  Input,
  Form,
  FormText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router";
import * as http from "../../util/http";

import * as ccCheck from "credit-card";
import styles from "./PaymentDetails.css";

const now = new Date(Date.now());
const yearNow = now.getFullYear();
const selYears = Array.from([0, 1, 2, 3, 4], x => yearNow + x);
const selMonths = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12']

class PaymentDetails extends Component
{
  // static data


  constructor(props)
  {
    super(props);
    this.state = {
      cardNumdber: '',
      nameOnCard: '',
      ccv: '',
      expiryMonth: null,
      expiryYear: null,
      loggedIn: false,
      updated: false,
    }
  }

  componentDidMount()
  {
    if (storage.get(storage.Keys.JWT))
    {
      this.setState({ loggedIn: true });
      http.
        client().
        get('/paymentDetails/my')
    }
  }

  render()
  {
    return this.state.updated ?
      this.updated() :
      this.state.loggedIn ?
        this.paymentDetailsForm() :
        this.loginRegister();
  }

  updated()
  {
    return (
      <Alert color="success">
        <h4 className="alert-heading">Payment details have been updated!</h4>
        <p><Link to="/profile">Click here to return to Profile</Link></p>
        <p><Link to="/">Click here to return home</Link></p>
      </Alert>
    );
  }

  loginRegister()
  {
    return (
      <Alert color="info">
        <h4 className="alert-heading">Please login or register first!</h4>
        <p><Link to="/register">Click here to register</Link></p>
        <p><Link to="/">Click here to return home</Link></p>
      </Alert>
    );
  }

  paymentDetailsForm()
  {
    return (
      <Row><Col>
        <h1>Payment Details</h1>

        <Form className="novalidate">
          <Row>
            <FormGroup>
              <Label for="cardNumber">Email</Label>
              <Input
                type="text"
                name="cardNumber"
                id="cardNumber"
                placeholder="Card number" />
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label for="expiry">Expiry</Label>
              <Input />
            </FormGroup>

            <FormGroup>
              <Label for="ccv">CVV</Label>
              <Input
                type="text"
                name="ccv"
                id="ccv"
                placeholder="CVV"/>
            </FormGroup>
          </Row>

          <Row>
            <FormGroup>
              <Label for="nameOnCard">Name on Card</Label>
              <Input
                type="text"
                name="nameOnCard"
                id="nameOnCard"
                placeHolder="Name on card"/>
            </FormGroup>
          </Row>

          <Row>
            <Button color="success" size="lg" block>Save</Button>
          </Row>

        </Form>
      </Col></Row>
    );
  }
}

export default PaymentDetails;
