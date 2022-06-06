import * as mui from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import encryptStorage from '../../services/Storage';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

const Withdraw = () => {
    const [withdraws, setWithdraws] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const value = encryptStorage.getItem('admin-session-key');
    const navigate = useNavigate();

    const handleChange = async (id) => {
        console.log(id);
    }

    useEffect(() => {
        let componentMounted = true;
        fetch('/api/payments/admin/request/withdraw', {
            headers: {
                'x-auth-token': value
            }
        })
        .then(res => res.json())
        .then(data => {
            if(componentMounted){
                setRows(data.map(c => {
                    return {
                        id: c.withdraw.id,
                        username: c.username,
                        amount: c.withdraw.amount,
                        status: c.withdraw.status,
                        date: c.withdraw.request_at
                    }
                }))
                setLoading(false);
                setWithdraws(data);
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
        field: 'username',
        headerName: 'Name',
        width: 200
    },
    {
        field: 'amount',
        headerName: 'Amount',
        width: 200
    },
    {
        field: 'date',
        headerName: 'Request At',
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
                    color="success"
                    sx={{
                        marginLeft: 1
                    }}
                    onClick={() => handleChange(params.row.withdraw.id)} 
                    aria-label="verify"
                    >
                        Accept
                </mui.Button> &nbsp; 
                <mui.Button 
                    size="small" 
                    variant="contained" 
                    disableElevation
                    color="info"
                    sx={{
                        marginLeft: 1
                    }}
                    onClick={() => handleChange(params.row.id)} 
                    aria-label="verify"
                    >
                        Reject
                </mui.Button>
            </>
        }
    },]

    return (
        <mui.Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <mui.Grid>
                <mui.Typography fontWeight={500} variant="h5">Withdraw</mui.Typography>
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

export default Withdraw
