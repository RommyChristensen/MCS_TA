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
    const [reportType, setReportType] = useState('byMonth');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedRange, setSelectedRange] = useState(0);
    const [radioValue, setRadioValue] = useState('byMonth')
    const value = encryptStorage.getItem('admin-session-key');

    const handleRangeChange = async (event) => {
        console.log(event.target.value);
        setSelectedRange(event.target.value);
    }

    const handleRadioChange = (event) => {
        console.log(event.target.value);
        setReportType(event.target.value);
    }

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
            <mui.Grid>
                <mui.Typography fontWeight={500} variant="h5">Order Report</mui.Typography>
            </mui.Grid>
            <mui.Grid>
            <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">Report Type</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={radioValue}
                        onChange={handleRadioChange}
                    >
                        <FormControlLabel value="byMonth" control={<Radio />} label="By Month" />
                        <FormControlLabel value="by6Month" control={<Radio />} label="By 6 Month" />
                    </RadioGroup>
                </FormControl>
            </mui.Grid>
            <mui.Grid mt={4}>
                {
                    !reportLoading ? 
                    <>
                        {
                            reportType == "byMonth" ? <mui.FormControl fullWidth>
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
                            </mui.FormControl> : <mui.FormControl fullWidth>
                                <mui.InputLabel id="select-month">Month Range</mui.InputLabel>
                                <mui.Select
                                    labelId="select-month"
                                    id="select-month-component"
                                    value={selectedRange}
                                    label="Month"
                                    onChange={handleRangeChange}
                                >
                                    <mui.MenuItem value={0}>January - June</mui.MenuItem>
                                    <mui.MenuItem value={1}>July - December</mui.MenuItem>
                                </mui.Select>
                            </mui.FormControl>
                        }

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
