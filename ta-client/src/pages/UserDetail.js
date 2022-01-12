import { useLocation } from "react-router";
import { Container, Grid, Typography, Avatar, Button } from "@mui/material";
import axios from 'axios';
import encryptStorage from '../services/Storage';
import { useState } from "react";

const UserDetail = () => {
    const { state } = useLocation();
    const [confirmed, setConfirmed] = useState(state.user.auth_confirmed);
    const value = encryptStorage.getItem('admin-session-key');

    const verifyUser = async () => {
        const id = state.user.id;
        const data = await axios.post('/api/auth/admin/users/confirm/' + id, {}, {
            headers: {
                'admin-session-key': value
            }
        });
        setConfirmed(data.data.auth_confirmed);
    }

    return (
        <Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <Grid container>
                <Grid item xs={1}>
                    <Avatar alt={state.user.auth_username} src={state.user.auth_profile} sx={{ width: 56, height: 56 }} />
                </Grid>
                <Grid item xs={11}>
                    <Typography fontWeight={500} variant="h5">{ state.user.auth_firstname } { state.user.auth_lastname }</Typography>
                </Grid>
            </Grid>

            <Grid mt={4} container>
                <Grid item xs={12}>
                    <Typography variant="body">
                        { state.user.auth_bio || 'No Bio Yet' }
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Email
                    </Typography>
                    <Typography variant="body2">
                        {state.user.auth_email}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Username
                    </Typography>
                    <Typography variant="body2">
                        {state.user.auth_username}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Full Name
                    </Typography>
                    <Typography variant="body2">
                        {state.user.auth_firstname} {state.user.auth_lastname}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Profile Link
                    </Typography>
                    <Typography variant="body2">
                        {state.user.auth_profile}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Role
                    </Typography>
                    <Typography variant="body2">
                        {state.user.auth_role}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}></Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Verified
                    </Typography>
                    <Typography variant="body2">
                        {
                            (state.user.auth_verified) ? 'Yes' : 'No'
                        }
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Confirmed
                    </Typography>
                    <Typography variant="body2">
                        {
                            (confirmed) ? 'Yes' : 'No'
                        }
                    </Typography>
                </Grid>
            </Grid>
            <Button sx={{ marginTop: 3 }} onClick={() => verifyUser()} variant="contained" color='success' disabled={confirmed}>Confirm User</Button>
        </Container>
    )
}

export default UserDetail;