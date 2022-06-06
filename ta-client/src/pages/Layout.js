import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems } from '../components/Sidebar';

import AppBar from '../components/AppBar';
import Drawer from '../components/Drawer';
import Theme from '../components/Theme';
import Copyright from '../components/Copyright';

import {
    Route,
    Routes
} from "react-router-dom";

import Dashboard from './Dashboard';
import Users from './Users';
import Jobs from './jobs/Jobs';
import UserDetail from './UserDetail';
import Categories from './category/Categories';
import CategoryCreate from './category/CategoryCreate';
import JobDetail from './jobs/JodDetail';
import Report from './report/Report';
import Ads from './ads/Ads';
import Withdraw from './withdraw/Withdraw';
import AdsDetail from './ads/AdsDetail';

const Layout = () => {
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    return (
        <ThemeProvider theme={Theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                <Toolbar
                    sx={{
                    pr: '24px', // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                        marginRight: '36px',
                        ...(open && { display: 'none' }),
                    }}
                    >
                    <MenuIcon />
                    </IconButton>
                    <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    sx={{ flexGrow: 1 }}
                    >
                    Dashboard
                    </Typography>
                </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List>{mainListItems}</List>
                </Drawer>
                <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[700],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
                >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    <Routes>
                        <Route path="/users" element={<Users />} />
                        <Route path="/jobs" element={<Jobs />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/report" element={<Report />} />
                        <Route path="/ads" element={<Ads />} />
                        <Route path="/ads/ads-detail" element={<AdsDetail />} />
                        <Route path="/withdraw" element={<Withdraw />} />
                        <Route path="/user-detail" element={<UserDetail />} />
                        <Route path="/category" element={<Categories />} />
                        <Route path="/category/create" element={<CategoryCreate />} />
                        <Route path="/job/job-detail" element={<JobDetail />} />
                            {/* <Route path="/admin/users" element={<Layout />} /> */}
                    </Routes>
                    <Copyright sx={{ pt: 4 }} />
                </Container>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Layout
