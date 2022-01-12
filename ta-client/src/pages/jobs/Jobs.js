import * as mui from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState, useEffect } from 'react';
import encryptStorage from '../../services/Storage';
import { useNavigate } from 'react-router';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const value = encryptStorage.getItem('admin-session-key');

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
    )
}

export default Jobs
