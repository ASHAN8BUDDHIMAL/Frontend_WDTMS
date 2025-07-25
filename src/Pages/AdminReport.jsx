import React, { useState, useEffect, useCallback } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import { Download, Refresh } from '@mui/icons-material';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminReport = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    userStats: { clients: Array(12).fill(0), workers: Array(12).fill(0) },
    completedTasks: Array(12).fill(0),
    cityDistribution: {}
  });
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8080/api/report/data', { year });
      console.log('API Response:', response.data); // Debug log
      setReportData({
        userStats: response.data.userStats || { clients: Array(12).fill(0), workers: Array(12).fill(0) },
        completedTasks: response.data.completedTasks || Array(12).fill(0),
        cityDistribution: response.data.cityDistribution || {}
      });
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Prepare data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const userStatsData = {
    labels: months,
    datasets: [
      {
        label: 'Clients',
        data: reportData.userStats.clients,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Workers',
        data: reportData.userStats.workers,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  const tasksData = {
    labels: months,
    datasets: [
      {
        label: 'Completed Tasks',
        data: reportData.completedTasks,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  // Process location data for Pie chart
  const processLocationData = () => {
    const locationData = reportData.cityDistribution;
    const labels = Object.keys(locationData);
    const data = Object.values(locationData);

    // If no data, return a default single slice
    if (labels.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'Users by City',
          data: [1],
          backgroundColor: ['rgba(201, 203, 207, 0.7)'],
          borderColor: ['rgba(201, 203, 207, 1)'],
          borderWidth: 1
        }]
      };
    }

    // Generate colors based on number of cities
    const backgroundColors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(199, 199, 199, 0.7)'
    ].slice(0, labels.length);

    const borderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(199, 199, 199, 1)'
    ].slice(0, labels.length);

    return {
      labels: labels,
      datasets: [{
        label: 'Users by City',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    };
  };

  const locationData = processLocationData();

  // Chart options
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: '',
        font: {
          size: 16
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5
        }
      }
    },
    maintainAspectRatio: false
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'User Geographic Distribution',
        font: {
          size: 16
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/report/download',
        { year },
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `admin_report_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Failed to download PDF:', err);
      setError('Failed to download report. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10">
      <div className="mx-auto px-4 mt-8">
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h4" >
          Admin Report
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
            >
              {[2023, 2024, 2025, 2026].map((y) => (
                <MenuItem key={y} value={y}>{y}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<Download />}
            onClick={handleDownloadPdf}
          >
            Export Report
          </Button>
          
          <IconButton onClick={fetchData} color="primary">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'error.light', color: 'error.contrastText', borderRadius: 2 }}>
          <Typography>{error}</Typography>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {/* User Stats Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Monthly User Statistics</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 400, p: 3, position: 'relative' }}>
                    <Bar 
                      data={userStatsData} 
                      options={{
                        ...barOptions,
                        plugins: {
                          ...barOptions.plugins,
                          title: {
                            ...barOptions.plugins.title,
                            text: `User Growth in ${year}`
                          }
                        }
                      }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Completed Tasks Chart */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">Completed Tasks</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 400, p: 3, position: 'relative' }}>
                    <Bar 
                      data={tasksData} 
                      options={{
                        ...barOptions,
                        plugins: {
                          ...barOptions.plugins,
                          title: {
                            ...barOptions.plugins.title,
                            text: `Tasks Completed in ${year}`
                          }
                        }
                      }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* User Location Chart */}
            <Grid item xs={12}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">User Distribution by City</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 400, p: 3, position: 'relative' }}>
                    <Pie 
                      data={locationData} 
                      options={pieOptions}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">Total Clients</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {reportData.userStats.clients.reduce((a, b) => a + b, 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">Total Workers</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {reportData.userStats.workers.reduce((a, b) => a + b, 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary">Total Completed Tasks</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {reportData.completedTasks.reduce((a, b) => a + b, 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
    </div>
  </div>

  );
};


export default AdminReport;