import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import ShowChartIcon from '@mui/icons-material/ShowChart'
import Container from '@mui/material/Container';

const paperStyle = {
    p: 2,
    display: 'flex',
    flexDirection: 'row',
    height: 130,
    justifyItems: 'center',
    alignItems: 'center',
}

function DashboardContent() {
    return (
        <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} sm={6} md={6} lg={4} sx={{textAlign: 'center'}}>
                <Paper sx={paperStyle}>
                    <WorkIcon sx={{ width: 100, height: 100, color: '#4E9F3D' }} />
                    <Container>
                        <Typography variant="h2" fontWeight={500}>
                            20
                        </Typography>
                        <Typography variant="body1">Jobs</Typography>
                    </Container>
                </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} sm={6} md={6} lg={4} sx={{textAlign: 'center'}}>
                <Paper sx={paperStyle} >
                    <PeopleIcon sx={{ width: 100, height: 100, color: '#864879' }} />
                    <Container>
                        <Typography variant="h2" fontWeight={500}>
                            5
                        </Typography>
                        <Typography variant="body1">New Users</Typography>
                    </Container>
                </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12} sm={6} md={6} lg={4} sx={{textAlign: 'center'}}>
                <Paper sx={paperStyle}>
                    <ShowChartIcon sx={{ width: 100, height: 100, color: '#1597BB' }} />
                    <Container>
                        <Typography variant="h2" fontWeight={500}>
                            70%
                        </Typography>
                        <Typography variant="body2">New Traffic This Month</Typography>
                    </Container>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default function Dashboard() {
  return <DashboardContent />;
}