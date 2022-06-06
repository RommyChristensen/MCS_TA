import * as mui from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import encryptStorage from '../services/Storage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { List } from '@mui/material';
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

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingReportSaldo, setLoadingReportSaldo] = useState(true);
    const [reportSaldo, setReportSaldo] = useState([]);
    const [loadingReportRating, setLoadingReportRating] = useState(true);
    const [reportRating, setReportRating] = useState([]);
    const value = encryptStorage.getItem('admin-session-key');

    useEffect(() => {
        let componentMounted = true;
        fetch('/api/auth/admin/users', {
            headers: {
                'admin-session-key': value
            }
        })
        .then(res => res.json())
        .then(data => {
            const userData = data;

            const userRow = data.map(user => {
                return {
                    id: user.id,
                    fullName: user.auth_firstname + " " + user.auth_lastname,
                    username: user.auth_username,
                    email: user.auth_email,
                    verified: user.auth_verified
                }
            })

            if(componentMounted){
                setUsers(userData);
                setRows(userRow);
                setLoading(false);

                const userIds = userData.map(u => {
                    return u.id;
                });
                const userNames = userData.map(u => {
                    return {
                        id: u.id,
                        auth_firstname: u.auth_firstname,
                        auth_lastname: u.auth_lastname
                    }
                });
                reqReportUser(userIds, userNames);
            }
        });

        return () => {
            componentMounted = false;
        }
    }, []);

    useEffect(() => {
        let componentMounted = true;
        fetch('/api/payments/admin/reportuser', {
            headers: {
                'x-auth-token': value
            }
        })
        .then(res => res.json())
        .then(data => {
            const userData = [];
            data.forEach(d => {
                if(d.auth_saldo != 0) {
                    userData.push(
                        {
                            id: d.id,
                            name: d.auth_firstname + " " + d.auth_lastname,
                            saldo: d.auth_saldo
                        }
                    )
                }
            })

            console.log(userData);

            if(componentMounted){
                setReportSaldo(userData.reverse());
                setLoadingReportSaldo(false);
            }
        });

        return () => {
            componentMounted = false;
        }
    }, []);

    const reqReportUser = async (userIds, userNames) => {
        let data = {
            users: userIds
        }

        let axiosConfig = {
            headers: {
                'x-auth-token': value
            }
        }

        const res = await axios.post('/api/ratingreview/admin/reportuser', data, axiosConfig);

        const ratings = res.data;
        
        const filtered = ratings.filter(r => {
            return r != null;
        });

        const finalRatings = filtered.map(f => {
            const name = "";
            userNames.forEach(u => {
                if(u.id == f.userId){
                    name = u.auth_firstname + " " + u.auth_lastname;
                }
            });

            return {
                name: name,
                rating: f.rate
            }
        });

        console.log(finalRatings);
    }

    const columns = [{
            field: 'id',
            headerName: 'ID',
            width: 150
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            width: 200
        },
        {
            field: 'username',
            headerName: 'Username',
            width: 200,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
        },
        {
            field: 'verified',
            headerName: 'Verified',
            width: 130,
            renderCell: (params) => {
                return <mui.Button 
                    size="small" 
                    variant="contained" 
                    disableElevation
                    disabled
                    color={params.row.verified ? "success" : "error"}>
                        {params.row.verified ? "Verified" : "Unverified"}
                </mui.Button>
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => {
                return (
                    <mui.Button onClick={() => handleDetail(params.row)} aria-label="verify" variant="outlined" color="info" startIcon={<VisibilityIcon />}>
                        Detail
                    </mui.Button>
                )
            }
        }
    ];

    const handleDetail = (user) => {
        user = users.filter(u => {
            return u.id === user.id
        });
        navigate('/admin/user-detail', {
            state: {
                user: user[0]
            }
        })
    }

    return (
        <>
            <mui.Container sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                    padding: 4
                    }}>
                <mui.Grid>
                    <mui.Typography fontWeight={500} variant="h5">Users Page</mui.Typography>
                </mui.Grid>

                <mui.Grid mt={4}>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            loading={loading}
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
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
                <mui.Grid container spacing={2}>
                    <mui.Grid item xs={6}>
                        <mui.Typography fontWeight={500} variant="h5">User With Most Balance</mui.Typography>
                        <List
                            sx={{ width: '100%', maxHeight: 360, overflow: "auto", bgcolor: 'background.paper' }}
                            aria-label="contacts"
                            >
                            {
                                reportSaldo.map((r, i) => {
                                    return <ListItem key={i} component="div" disablePadding
                                        secondaryAction={
                                            <mui.Typography>IDR {r.saldo}</mui.Typography>
                                        }
                                    >
                                        <ListItemButton>
                                            <ListItemText primary={`${r.name}`} />
                                        </ListItemButton>
                                    </ListItem>;
                                })
                            }
                        </List>
                    </mui.Grid>
                    <mui.Grid item xs={6}>
                        <mui.Typography fontWeight={500} variant="h5">User With Most Stars</mui.Typography>
                        <Bar 
                            data={
                                {
                                    labels: ["a", "b"],
                                    datasets: [
                                        {
                                            label: "Number",
                                            data: [1, 2],
                                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                        }
                                    ]
                                }
                            }
                        />
                    </mui.Grid>
                </mui.Grid>
            </mui.Container>
        </>
    )
}

export default Users
