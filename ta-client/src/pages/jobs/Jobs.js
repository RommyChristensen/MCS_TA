import * as mui from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState, useEffect } from 'react';
import encryptStorage from '../../services/Storage';
import { useNavigate } from 'react-router';
import axios from 'axios';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [rows, setRows] = useState([]);
    const [jobReport, setJobReport] = useState({
        labels: []
    });
    const [reportLoading, setReportLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const value = encryptStorage.getItem('admin-session-key');

    const handleMonthChange = async (event) => {
        let d = {
            month: event.target.value
        }
        let axiosConfig = {
            headers: {
                'x-auth-token': value
            }
        }
        setReportLoading(true);
        try{
            const res = await axios.post('/api/jobscat/admin/reportjob', d, axiosConfig);

            const data = res.data;
            const labels = [];
            const values = [];
            data.forEach(d => {
                if(!labels.includes(d.job_category.category_name)) labels.push(d.job_category.category_name);
            });

            data.forEach(d => {
                let idx = labels.findIndex(d.job_category.category_name);
                if(values[idx]) values[idx]++;
                else values[idx] = 1;
            })

            setJobReport({
                labels: labels,
                data: values
            })

            setReportLoading(false);
            setSelectedMonth(event.target.value);
        }catch(ex){
            setReportLoading(false);
            setSelectedMonth(event.target.value);
        }
      };
    

    useEffect(() => {
        let componentMounted = true;
        fetch('/api/jobscat/admin/job', {
            headers: {
                'admin-session-key': value
            }
        })
        .then(res => res.json())
        .then(data => {
            const jobData = data;
            const jobRow = data.map(job => {
                return {
                    id: job.id,
                    title: job.job_title,
                    description: job.job_description.substring(0, 30),
                    status: job.job_status,
                    category: job.job_category.category_name,
                    created_by: job.job_created_by.auth_username,
                    date: job.job_date
                }
            })

            if(componentMounted){
                setJobs(jobData);
                setRows(jobRow);
                setLoading(false);
            }
        })

        return () => {
            componentMounted = false;
        }
    }, [])

    const handleDetail = (job_id) => {
        let jobState = jobs.filter(j => {
            if(j.id === job_id){
                return j;
            }
        });

        navigate('/admin/job/job-detail', {
            state: {
                job: jobState[0]
            }
        })
    }

    const columns = [{
            field: 'id',
            headerName: 'ID',
            width: 70
        },
        {
            field: 'title',
            headerName: 'Job Title',
            width: 130
        },
        {
            field: 'description',
            headerName: 'Job Description',
            width: 200
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 90,
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 90,
        },
        {
            field: 'created_by',
            headerName: 'Created By',
            width: 120,
        },
        {
            field: 'date',
            headerName: 'Job Date',
            width: 90,
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => {
                return (
                    <mui.Button onClick={() => handleDetail(params.row.id)} aria-label="verify" variant="outlined" color="info" startIcon={<VisibilityIcon />}>
                        Detail
                    </mui.Button>
                )
            }
        }
    ];

    return (
        <>
            <mui.Container sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                    padding: 4
                    }}>
                <mui.Grid>
                    <mui.Typography fontWeight={500} variant="h5">Jobs Page</mui.Typography>
                </mui.Grid>

                <mui.Grid mt={4}>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            loading={loading}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                        />
                    </div>
                </mui.Grid>
            </mui.Container>
            <mui.Box sx={{ m: 4 }} />
            <mui.Container sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                    padding: 4
                    }}>
                <mui.Grid>
                    <mui.Typography fontWeight={500} variant="h5">Job Report</mui.Typography>
                </mui.Grid>
                <mui.Grid mt={4}>
                    {
                        !reportLoading ? 
                        <>
                            <mui.FormControl fullWidth>
                                <mui.InputLabel id="select-month">Month</mui.InputLabel>
                                <mui.Select
                                    labelId="select-month"
                                    id="select-month-component"
                                    value={selectedMonth}
                                    label="Month"
                                    onChange={handleMonthChange}
                                >
                                    <mui.MenuItem value={0}>January</mui.MenuItem>
                                    <mui.MenuItem value={1}>February</mui.MenuItem>
                                    <mui.MenuItem value={2}>March</mui.MenuItem>
                                    <mui.MenuItem value={3}>April</mui.MenuItem>
                                    <mui.MenuItem value={4}>May</mui.MenuItem>
                                    <mui.MenuItem value={5}>June</mui.MenuItem>
                                    <mui.MenuItem value={6}>July</mui.MenuItem>
                                    <mui.MenuItem value={7}>August</mui.MenuItem>
                                    <mui.MenuItem value={8}>September</mui.MenuItem>
                                    <mui.MenuItem value={9}>October</mui.MenuItem>
                                    <mui.MenuItem value={10}>November</mui.MenuItem>
                                    <mui.MenuItem value={11}>December</mui.MenuItem>
                                </mui.Select>
                            </mui.FormControl>

                            <Bar 
                                width={400}
                                height={300}
                                data={
                                    {
                                        labels: jobReport.labels,
                                        datasets: [
                                            {
                                                label: "Number of Jobs",
                                                data: jobReport.data,
                                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                            }
                                        ]
                                    }
                                }
                            /> 
                        </> 
                        : "Loading..."
                    }
                </mui.Grid>
            </mui.Container>
        </>
    )
}

export default Jobs
