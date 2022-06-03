import * as mui from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import encryptStorage from '../../services/Storage';
import Swal from 'sweetalert2';
// import '@sweetalert2/theme-dark/dark.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [catReport, setCatReport] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
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
        <mui.Box sx={{ m: 2 }} />
        <mui.FormControl fullWidth>
            <mui.InputLabel id="demo-simple-select-label">Age</mui.InputLabel>
            <mui.Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value=""
                label="Age"
            >
                <mui.MenuItem value={10}>Ten</mui.MenuItem>
                <mui.MenuItem value={20}>Twenty</mui.MenuItem>
                <mui.MenuItem value={30}>Thirty</mui.MenuItem>
            </mui.Select>
            </mui.FormControl>
        </>
    )
}

export default Categories
