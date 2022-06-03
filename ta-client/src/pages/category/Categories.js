import * as mui from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import encryptStorage from '../../services/Storage';
import Swal from 'sweetalert2';
// import '@sweetalert2/theme-dark/dark.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

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

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [catReport, setCatReport] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportLoading, setReportLoading] = useState(true);
    const value = encryptStorage.getItem('admin-session-key');
    const navigate = useNavigate();

    useEffect(() => {
        let componentMounted = true;
        fetch('/api/jobscat/admin/category', {
            headers: {
                'admin-session-key': value
            }
        })
        .then(res => res.json())
        .then(data => {
            if(componentMounted){
                setRows(data.map(c => {
                    return {
                        id: c.id,
                        category_name: c.category_name,
                        category_description: c.category_description
                    }
                }))
                setLoading(false);
                setCategories(data);
            }
        })
        
        return () => {
            componentMounted = false;
        }
    }, []);

    useEffect(() => {
        let componentMounted = true;
        fetch('/api/jobscat/admin/reportcategory', {
            headers: {
                'x-auth-token': value
            }
        })
        .then(res => res.json())
        .then(data => {
            if(componentMounted){
                setRows(data.map(c => {
                    return {
                        id: c.category_id,
                        category_name: c.category_name,
                        value: c.number
                    }
                }))
                setReportLoading(false);
                setCatReport(data);
            }
        })
        
        return () => {
            componentMounted = false;
        }
    }, []);

    const handleUpdate = async (catId) => {
        let cat = null;
        categories.forEach(c => {
            if(c.id === catId){
                cat = c;
            }
        });

        navigate('/admin/category/create', {
            state: {
                category: cat
            }
        })
    }

    const handleDelete = async (catId) => {
        await axios.delete('/api/jobscat/admin/category', {
            data: {
                category_id: catId
            },
            headers: {
                'admin-session-key': encryptStorage.getItem('admin-session-key')
            }
        }).then(res => {
            Swal.fire({
                title: "Category",
                text: res.data.msg,
                icon: "success",
                showCloseButton: true
            })

            const cats = categories.filter(c => {
                return c.id !== catId
            })
            setCategories(cats);

            setRows(cats.map(c => {
                return {
                    id: c.id,
                    category_name: c.category_name,
                    category_description: c.category_description
                }
            }))
        }).catch(err => {
            // console.log();
            Swal.fire({
                title: "Category",
                text: err.response.data.message, //err.response.data.errors[0].message
                icon: "error",
                showCloseButton: true
            })
        })
    }

    const columns = [{
            field: 'id',
            headerName: 'ID',
            width: 150
        },
        {
            field: 'category_name',
            headerName: 'Category Name',
            width: 200
        },
        {
            field: 'category_description',
            headerName: 'Category Description',
            width: 200
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return <>
                    <mui.Button 
                        size="small" 
                        variant="contained" 
                        disableElevation
                        onClick={ () => handleDelete(params.row.id) }
                        color="error"
                        >
                            Delete
                    </mui.Button>
                    <mui.Button 
                        size="small" 
                        variant="contained" 
                        disableElevation
                        onClick={ () => handleUpdate(params.row.id) }
                        color="info"
                        sx={{
                            marginLeft: 1
                        }}
                        >
                            Update
                    </mui.Button>
                </>
            }
        },
    ];

    return (
        <>
        <mui.Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <mui.Grid>
                <mui.Typography fontWeight={500} variant="h5">Categories Page</mui.Typography>
            </mui.Grid>

            <mui.Grid mt={4}>
                <Link to="/admin/category/create" style={{ textDecoration: 'none' }}>
                    <mui.Button color="success" variant="contained" sx={{ marginBottom: 4}}>
                        Add New Category
                    </mui.Button>
                </Link>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        loading={loading}
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
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
                <mui.Typography fontWeight={500} variant="h5">Most Popular Category</mui.Typography>
            </mui.Grid>
            <mui.Grid mt={4}>
                {
                    !reportLoading ? 
                    <Bar 
                        width={400}
                        height={300}
                        data={
                            {
                                labels: catReport.map(c => c.category_name),
                                datasets: catReport.map(c => {
                                    return {
                                        label: c.category_name,
                                        data: parseInt(c.value),
                                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                    }
                                })
                            }
                        }
                    /> : "Loading..."
                }
            </mui.Grid>
        </mui.Container>
        </>
    )
}

export default Categories
