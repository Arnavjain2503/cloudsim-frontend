import React from 'react';
import { Container, Table, Card, Row, Col, Badge } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Cell, ReferenceLine
} from 'recharts';
import { motion } from 'framer-motion';
import './SimulationResults.css'; 
const SimulationResults = ({ results }) => {
  if (!results || !results.cloudletResults || results.cloudletResults.length === 0) {
    return (
      <Container className="text-center mt-5">
        <h4>⚠️ No simulation results found.</h4>
      </Container>
    );
  }

  const ganttData = results.cloudletResults.map(cloudlet => ({
    id: cloudlet.cloudletId,
    vmId: cloudlet.vmId,
    startTime: cloudlet.startTime,
    finishTime: cloudlet.finishTime,
    executionTime: cloudlet.executionTime,
    cost: cloudlet.cost
  }));

  const vmUtilizationData = [];
  const vmMap = new Map();

  results.cloudletResults.forEach(cloudlet => {
    if (!vmMap.has(cloudlet.vmId)) {
      vmMap.set(cloudlet.vmId, {
        vmId: cloudlet.vmId,
        totalExecutionTime: cloudlet.executionTime,
        taskCount: 1
      });
    } else {
      const vmData = vmMap.get(cloudlet.vmId);
      vmData.totalExecutionTime += cloudlet.executionTime;
      vmData.taskCount += 1;
      vmMap.set(cloudlet.vmId, vmData);
    }
  });

  vmMap.forEach(value => vmUtilizationData.push(value));

  const COLORS = ['#00BFFF', '#7FFFD4', '#FFD700', '#FF69B4', '#BA55D3', '#48D1CC'];
  const maxFinishTime = Math.max(...results.cloudletResults.map(c => c.finishTime || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="mt-5 mb-5">
        <Card className="glass-card border-0 shadow-lg mb-4">
          <Card.Header as="h4" className="bg-transparent fw-bold text-center">
            🚀 Simulation Results - {(results.algorithm || 'Unknown').replace(/_/g, ' ')}
          </Card.Header>

          <Card.Body>
            <Row className="mb-4">
              <Col md={4} className="mb-3 mb-md-0">
                <Card className="text-center h-100 glass-inner shadow-sm">
                  <Card.Body>
                    <Card.Title>Total Execution Time</Card.Title>
                    <h3 className="text-info">{(results.totalExecutionTime ?? 0).toFixed(2)}s</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <Card className="text-center h-100 glass-inner shadow-sm">
                  <Card.Body>
                    <Card.Title>Total Cost</Card.Title>
                    <h3 className="text-success">${(results.totalCost ?? 0).toFixed(2)}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center h-100 glass-inner shadow-sm">
                  <Card.Body>
                    <Card.Title>Cloudlets Processed</Card.Title>
                    <h3 className="text-warning">{results.cloudletResults.length}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <h5 className="mt-5 mb-3">📊 Cloudlet Execution Timeline</h5>
            <div style={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <ComposedChart
                  layout="vertical"
                  data={ganttData}
                  margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, maxFinishTime * 1.1]} label={{ value: 'Time (s)', position: 'insideBottom', offset: -10 }} />
                  <YAxis dataKey="id" type="category" label={{ value: 'Cloudlet ID', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'startTime') return [`Start: ${value.toFixed(2)}s`, name];
                      if (name === 'executionTime') return [`Duration: ${value.toFixed(2)}s`, name];
                      return [value, name];
                    }}
                    labelFormatter={(value) => `Cloudlet ${value}`}
                  />
                  <Legend />
                  <Bar dataKey="executionTime" stackId="a" fill="#8884d8" barSize={20}>
                    {ganttData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.vmId % COLORS.length]} />
                    ))}
                  </Bar>
                  <ReferenceLine x={0} stroke="#000" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <h5 className="mt-5 mb-3">📈 VM Utilization</h5>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={vmUtilizationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vmId" label={{ value: 'VM ID', position: 'insideBottom', offset: -5 }} />
                  <YAxis yAxisId="left" orientation="left" label={{ value: 'Execution Time (s)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Task Count', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="totalExecutionTime" name="Execution Time" fill="#4db8ff" />
                  <Bar yAxisId="right" dataKey="taskCount" name="Tasks" fill="#8cd790" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <h5 className="mt-5 mb-3">📋 Detailed Cloudlet Results</h5>
            <div className="table-responsive">
              <Table striped bordered hover className="glass-inner shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th>Cloudlet ID</th>
                    <th>VM ID</th>
                    <th>Start Time (s)</th>
                    <th>Finish Time (s)</th>
                    <th>Execution Time (s)</th>
                    <th>Status</th>
                    <th>Cost ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.cloudletResults.map(cloudlet => (
                    <tr key={cloudlet.cloudletId}>
                      <td>{cloudlet.cloudletId}</td>
                      <td>{cloudlet.vmId}</td>
                      <td>{(cloudlet.startTime ?? 0).toFixed(2)}</td>
                      <td>{(cloudlet.finishTime ?? 0).toFixed(2)}</td>
                      <td>{(cloudlet.executionTime ?? 0).toFixed(2)}</td>
                      <td>
                        <Badge bg={cloudlet.status === 'SUCCESS' ? 'success' : 'danger'}>
                          {cloudlet.status ?? 'UNKNOWN'}
                        </Badge>
                      </td>
                      <td>${(cloudlet.cost ?? 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </motion.div>
  );
};

export default SimulationResults;
