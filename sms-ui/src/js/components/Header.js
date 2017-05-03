import React, { PropTypes, Component } from 'react';
import {
  Button,
  ButtonGroup,
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
  MenuItem,
  Col,
  Grid,
  PageHeader,
  Row
} from 'react-bootstrap';
import { Link } from 'react-router';

class Header extends Component {

  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">React-Bootstrap</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#">
              <Link to='/address'>Address</Link>
            </NavItem>
            <NavItem eventKey={2} href="#">
              <Link to='/details/1'>Details</Link>
            </NavItem>
            <NavItem eventKey={2} href="#">
              <Link to='/logs/1'>Logs</Link>
            </NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">Link Right</NavItem>
            <NavItem eventKey={2} href="#">Link Right</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Header;
