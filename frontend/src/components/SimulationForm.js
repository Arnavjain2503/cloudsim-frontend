import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

const SimulationForm = ({ onSimulationComplete }) => {
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    schedulingAlgorithm: '',
    numberOfVms: 5,
    vmMips: 1000,
    vmRam: 512,
    vmBw: 1000,
    vmSize: 10000,
    numberOfCloudlets: 10,
    cloudletLength: 10000,
    cloudletPes: 1,
    cloudletFileSize: 300,
    cloudletOutputSize: 300
  });

  useEffect(() => {
    // Fetch available algorithms from the backend
    const fetchAlgorithms = async () => {
      try {
        const response = await axios.get('http://15.206.209.5:8080/api/simulation/algorithms');
        setAlgorithms(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, schedulingAlgorithm: response.data[0] }));
        }
      } catch (err) {
        setError('Failed to fetch algorithms. Please try again later.');
        console.error('Error fetching algorithms:', err);
      }
    };

    fetchAlgorithms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'schedulingAlgorithm' ? value : parseInt(value, 10)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://15.206.209.5:8080/api/simulation/run', formData);
      onSimulationComplete(response.data);
    } catch (err) {
      setError('Failed to run simulation. Please check your inputs and try again.');
      console.error('Error running simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="mt-4 mb-4">
        <Card.Header as="h5">CPU Scheduling Simulation Parameters</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Scheduling Algorithm</Form.Label>
                  <Form.Select 
                    name="schedulingAlgorithm" 
                    value={formData.schedulingAlgorithm} 
                    onChange={handleChange}
                    required
                  >
                    {algorithms.map(algo => (
                      <option key={algo} value={algo}>
                        {algo.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mt-4">Virtual Machine Configuration</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Number of VMs</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="numberOfVms" 
                    value={formData.numberOfVms} 
                    onChange={handleChange}
                    min="1"
                    max="20"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>VM MIPS (Processing Power)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="vmMips" 
                    value={formData.vmMips} 
                    onChange={handleChange}
                    min="100"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>VM RAM (MB)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="vmRam" 
                    value={formData.vmRam} 
                    onChange={handleChange}
                    min="128"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>VM Bandwidth (Mbps)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="vmBw" 
                    value={formData.vmBw} 
                    onChange={handleChange}
                    min="100"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>VM Storage Size (MB)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="vmSize" 
                    value={formData.vmSize} 
                    onChange={handleChange}
                    min="1000"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mt-4">Cloudlet Configuration</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Number of Cloudlets</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="numberOfCloudlets" 
                    value={formData.numberOfCloudlets} 
                    onChange={handleChange}
                    min="1"
                    max="50"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cloudlet Length (MI)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="cloudletLength" 
                    value={formData.cloudletLength} 
                    onChange={handleChange}
                    min="1000"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cloudlet PEs (Cores)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="cloudletPes" 
                    value={formData.cloudletPes} 
                    onChange={handleChange}
                    min="1"
                    max="8"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cloudlet File Size (MB)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="cloudletFileSize" 
                    value={formData.cloudletFileSize} 
                    onChange={handleChange}
                    min="10"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cloudlet Output Size (MB)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="cloudletOutputSize" 
                    value={formData.cloudletOutputSize} 
                    onChange={handleChange}
                    min="10"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid gap-2 mt-4">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Running Simulation...' : 'Run Simulation'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SimulationForm;
