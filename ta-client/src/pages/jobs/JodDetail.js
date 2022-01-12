import { Typography } from '@mui/material';
import { useLocation } from 'react-router';
import { Container } from '@mui/material';
import { Grid } from '@mui/material';

const JobDetail = () => {
    const { state } = useLocation();

    console.log(state);

    return (
        <Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <Grid>
                <Typography fontWeight={500} variant="h5">Job Detail - {state.job.job_title}</Typography>
            </Grid>

            <Grid mt={4} container>
                <Grid item xs={12}>
                    <Typography variant="body">
                        {state.job.job_description}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Created By
                    </Typography>
                    <Typography variant="body2">
                        {state.job.job_created_by.auth_firstname + " " + state.job.job_created_by.auth_lastname}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Category
                    </Typography>
                    <Typography variant="body2">
                        {state.job.job_category.category_name}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Deadline Job
                    </Typography>
                    <Typography variant="body2">
                        {new Date(state.job.job_date).toDateString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Job Price
                    </Typography>
                    <Typography variant="body2">
                        {state.job.job_price}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} mt={3}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        Job Status
                    </Typography>
                    <Typography variant="body2">
                        {state.job.job_status}
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    )
}

export default JobDetail;