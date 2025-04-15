import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimulationForm from './components/SimulationForm';
import SimulationResults from './components/SimulationResults';
import { motion } from 'framer-motion';

function App() {
  const [simulationResults, setSimulationResults] = useState(null);

  const handleSimulationComplete = (results) => {
    setSimulationResults(results);
    window.scrollTo({
      top: document.getElementById('results-section')?.offsetTop || 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="bg-light text-dark min-vh-100 App">
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: '80vh',
          background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center landing-section"npm start
          >
            <h1 className="display-4 fw-bold">☁️ CloudSim CPU Scheduler</h1>
            <p className="lead mb-4">
              Simulate and visualize cloud CPU scheduling algorithms in real-time.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() =>
                window.scrollTo({
                  top: document.getElementById('sim-form')?.offsetTop || 0,
                  behavior: 'smooth',
                })
              }
            >
              🚀 Start Simulation
            </Button>
          </motion.div>
        </Container>
      </div>

      <Container id="sim-form" className="py-5">
        <Row className="justify-content-center">
          <Col md={10}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SimulationForm onSimulationComplete={handleSimulationComplete} />
            </motion.div>
          </Col>
        </Row>
      </Container>

      <Container id="results-section">
        {simulationResults && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SimulationResults results={simulationResults} />
          </motion.div>
        )}
      </Container>
    </div>
  );
}

export default App;
