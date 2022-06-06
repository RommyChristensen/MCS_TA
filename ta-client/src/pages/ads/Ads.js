import * as mui from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import encryptStorage from '../../services/Storage';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

const Ads = () => {
    const [ads, setAds] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const value = encryptStorage.getItem('admin-session-key');

    const handleDetail = (ads_id) => {
        let adsState = ads.filter(a => {
            if(a.id === ads_id){
                return a;
            }
        });

        navigate('/admin/ads/ads-detail', {
            state: {
                ads: adsState[0]
            }
        })
    }

    useEffect(() => {
        let componentMounted = true;
        fetch('/api/ads/all', {
            headers: {
                'x-auth-token': value
            }
        })
        .then(res => res.json())
        .then(data => {
            if(componentMounted){
                setRows(data.map(c => {
                    return {
                        id: c.id,
                        category_name: c.category_name,
                        title: c.title,
                        description: c.description,
                        status: c.status
                    }
                }))
                setLoading(false);
                setAds(data);
            }
        })
        
        return () => {
            componentMounted = false;
        }
    }, []);

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
        field: 'title',
        headerName: 'Title',
        width: 200
    },
    {
        field: 'description',
        headerName: 'Description',
        width: 200
    },
    {
        field: 'status',
        headerName: 'Status',
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
                    color="info"
                    sx={{
                        marginLeft: 1
                    }}
                    onClick={() => handleDetail(params.row.id)} 
                    aria-label="verify"
                    >
                        Detail
                </mui.Button>
            </>
        }
    },
];

    return (
        <mui.Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <mui.Grid>
                <mui.Typography fontWeight={500} variant="h5">Ads</mui.Typography>
            </mui.Grid>
            <mui.Grid mt={4}>
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
    )
}

export default Ads
