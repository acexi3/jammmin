import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Hero from './components/Hero/Hero';
import './App.css';

export default function App() {

  return (
    <>
      <div className="App">
        <Container>
          <Row>
            <Col>              
                <Hero className="fixed-top" bg="light" expand="lg"/>              
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}