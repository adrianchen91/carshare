// PaymentDetails.js
import React, { Component, PropTypes } from "react";
import {
  Alert,
  Button,
  FormGroup,
  Label,
  Input,
  Form,
  FormFeedback,
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
const selYears = Array.from([0, 1, 2, 3, 4], x => (yearNow + x).toFixed());
const selMonths = [
  '01', '02', '03', '04', '05', '06',
  '07', '08', '09', '10', '11', '12']

class PaymentDetails extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      // credit card fields
      cardNumber: '',
      nameOnCard: '',
      ccv: '',
      expiryMonth: '',
      expiryYear: '',
      // page state
      updated: false,
      expMonthDropdownOpen: false,
      expYearDropdownOpen: false,
      touched: {
        cardNumber: false,
        nameOnCard: false,
        ccv: false,
        expiryMonth: false,
        expyryYear: false,
      valid: {},
      },
    };
  }

  validate() {
    let cardType = ccCheck.determineCardType(this.state.cardNumber);

    const valids = {
      cardNumber: ccCheck.luhn(this.state.cardNumber) && cardType,
      nameOnCard: this.state.nameOnCard.length < 1,
      ccv: ccCheck.doesCvvMatchType(this.state.ccv, cardType),
      expiry: ccCheck.isExpired(this.state.expiryMonth, this.state.expiryYear),
    }
    return valids;
  }

  handleInputChange(evt) {
    let field = evt.target.id;
    let value = evt.target.value
    let props = {};
    props [field] = value;
    props.touched = this.state.touched;
    props.touched [field] = true;
    this.setState(props);
  }

  handleExpiryMonthChange(evt) {
    let props = {
      expiryMonth: evt.target.innerText,
      expMonthDropdownOpen: false }
    props.touched = this.state.touched;
    props.touched.expiryMonth = true;
    this.setState(props);
  }

  handleExpiryYearChange = (evt) => {
    let props = {
      expiryYear: evt.target.innerText,
      expYearDropdownOpen: false }
    props.touched = this.state.touched;
    props.touched.expiryYear = true;
    this.setState(props);
  }

  toggleExpMonthDropdown() {
    this.setState({
      expMonthDropdownOpen: !this.state.expMonthDropdownOpen,
    });
    this.handleBlur('expiryMonth');
  }

  toggleExpYearDropdown() {
    this.setState({
      expYearDropdownOpen: !this.state.expYearDropdownOpen,
    });
    this.handleBlur('expiryYear');
  }

  handleSubmit(evt) {
    evt.preventDefault();
    if (this.formIsValid()) {
      http.client().put('/paymentDetals/change', {
        cardNumber: this.state.cardNumber,
        nameOnCard: this.state.nameOnCard,
        ccv: this.state.ccv,
        expiryMonth: Number(this.state.expiryMonth),
        expiryYear: Number(this.state.expiryYear),
      })
      .then(res => console.log(res))
      .catch(err => console.log(err));
    }
  }

  isValid(key) {
    const valid = this.valids[key];
    const touched = this.state.touched[key];
    return valid && touched;
  }

  formIsValid() {
    return true;
  }

  mapUserToModel(user)
  {
    if (user)
    {
      this.setState({
        cardNumber: user.creditCard && user.creditCard.cardnumber ?
          user.creditCard.cardnumber : '',
        nameOnCard: user.creditCard && user.creditCard.nameOnCard ?
          user.creditCard.nameOnCard : '',
        ccv: user.creditCard && user.creditCard.ccv ? user.creditCard.ccv : '',
        expiryMonth: user.creditCard && user.creditCard.expiryMonth ?
          user.creditCard.ccv : '',
        expiryYear: user.creditCard && user.creditCard.expiryYear ?
          user.creditCard.ccv : '',
      })
    }
  }

  componentDidMount()
  {
    http
      .client()
      .get('/paymentDetails/my')
      .then((res) => { this.mapUserToModel(res) })
      .catch((err) => { console.log(err) });
  }

  render()
  {
    this.errors = this.validate();
    const isDisabled = !this.formIsValid();

    return (
      <Row><Col>
        <h1>Payment Details</h1>

        <Form
          className="novalidate"
          onSubmit={this.handleSubmit.bind(this)}>
          <Row>
            <FormGroup>
              <Label for="cardNumber">Credit Card Number</Label>
              <Input
                type="text"
                name="cardNumber"
                id="cardNumber"
                placeholder="Card number"
                className={isValid('cardNumber') ? '' : 'is-invalid'}
                value={this.state.cardNumber}
                onChange={this.handleinputChange.bind(this)}
              />
              <FormFeedback>
                A valid credit card number is required.
              </FormFeedback>
            </FormGroup>
          </Row>

          <Row>
            <Col>
              <FormGroup>
                <Label for="expiry">Expiry</Label>

                <Dropdown
                  isOpen={this.state.expMonthDropdownOpen}
                  toggle={this.toggleExpMonthDropdown.bind(this)}
                >
                  <DropdownToggle caret>
                    {this.state.expiryMonth ?
                      this.state.expiryMonth : 'MM'}
                  </DropdownToggle>
                  <DropdownMenu>
                    {selMonths.map(mm => (
                      <DropdownItem
                        key={mm}
                        onClick={this.handleExpiryChange.bind(this)}
                      >
                        {mm}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>

                <Dropdown>
                  isOpen={this.state.expYearDropdownOpen}
                  toggle={this.toggleExpYearDropdown.bind(this)}
                >
                  <DropdownToggle caret>
                    {this.state.expiryYear ?
                    this.state.expiryYear : 'YYYY'}
                  </DropdownToggle>
                  <DropdownMenu>
                  {selYears.map(yyyy => (
                    <DropdownItem
                      key={yyyy}
                      onClick={this.handleExpiryChange.bind(this)}
                    >
                      {yyyy}
                    </DropdownItem>
                  ))}
                  </DropdownMenu>
                </Dropdown>

                <Input
                  type="hidden"
                  name="expiry"
                  id="expiry"
                  className={isValid('expiry') ? '' : 'is-invalid'}
                  />
                <FormFeedback>
                  Card should not be expired. A valid expiry date is required.
                </FormFeedback>
              </FormGroup>
            </Col>

            <Col>
              <FormGroup>
                <Label for="ccv">CVV</Label>
                <Input
                  type="text"
                  name="ccv"
                  id="ccv"
                  placeholder="CVV"
                  className={isValid('cvv') ? '' : 'is-invalid'}
                  onChange={this.handleCcvChange.bind(this)}/>
                <FormFeedback>
                  A valid CVV is required.
                </FormFeedback>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              <FormGroup>
                <Label for="nameOnCard">Name on Card</Label>
                <Input
                  type="text"
                  name="nameOnCard"
                  id="nameOnCard"
                  placeHolder="Name on card"
                  onChange={this.handleNameOnCardChange.bind(this)}/>
                <FormFeedback>
                  Name on card is required.
                </FormFeedback>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={{ size: 6, offset: 3 }}>
              <Button
                disabled={isDisabled}
                outline
                color="success"
                size="lg"
                block
              >
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Col></Row>
    )
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

}

export default PaymentDetails;
