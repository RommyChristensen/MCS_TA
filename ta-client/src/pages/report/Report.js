import * as mui from '@mui/material';
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
import axios from 'axios';
import { useState, useEffect } from 'react';
import encryptStorage from '../../services/Storage';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Report = () => {
    const [jobReport, setJobReport] = useState({
        labels: [],
        values: []
    });
    const [reportLoading, setReportLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const value = encryptStorage.getItem('admin-session-key');

    const handleMonthChange = async (event) => {
        let d = {
            month: event.target.value
        }
        let axiosConfig = {
            headers: {
                'x-auth-token': value
            }
        }
        setReportLoading(true);
        try{
            const res = await axios.post('/api/orders/admin/reportorder', d, axiosConfig);

            const data = res.data;

            console.log(data);

            setReportLoading(false);
            setSelectedMonth(event.target.value);
        }catch(ex){
            console.log(ex);
            setReportLoading(false);
            setSelectedMonth(event.target.value);
        }
    };

    return (
        <mui.Container sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? "#ffffff" : theme.palette.grey[900],
                padding: 4
                }}>
            <mui.Grid mt={4}>
                {
                    !reportLoading ? 
                    <>
                        <mui.FormControl fullWidth>
                            <mui.InputLabel id="select-month">Month</mui.InputLabel>
                            <mui.Select
                                labelId="select-month"
                                id="select-month-component"
                                value={selectedMonth}
                                label="Month"
                                onChange={handleMonthChange}
                            >
                                <mui.MenuItem value={0}>January</mui.MenuItem>
                                <mui.MenuItem value={1}>February</mui.MenuItem>
                                <mui.MenuItem value={2}>March</mui.MenuItem>
                                <mui.MenuItem value={3}>April</mui.MenuItem>
                                <mui.MenuItem value={4}>May</mui.MenuItem>
                                <mui.MenuItem value={5}>June</mui.MenuItem>
                                <mui.MenuItem value={6}>July</mui.MenuItem>
                                <mui.MenuItem value={7}>August</mui.MenuItem>
                                <mui.MenuItem value={8}>September</mui.MenuItem>
                                <mui.MenuItem value={9}>October</mui.MenuItem>
                                <mui.MenuItem value={10}>November</mui.MenuItem>
                                <mui.MenuItem value={11}>December</mui.MenuItem>
                            </mui.Select>
                        </mui.FormControl>

                        {/* <Bar
                            data={
                                {
                                    labels: jobReport.labels,
                                    datasets: [
                                        {
                                            label: "Number of Jobs",
                                            data: jobReport.data,
                                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                        }
                                    ]
                                }
                            }
                        />  */}
                    </> 
                    : "Loading..."
                }
            </mui.Grid>
        </mui.Container>
    )
}

export default Report
