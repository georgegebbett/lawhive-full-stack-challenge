import { LoadingButton } from '@mui/lab'
import {
  Alert, AlertTitle,
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel, FormLabel, InputAdornment,
  Paper,
  Radio,
  RadioGroup, Snackbar,
  Stack,
  TextField
} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import React, {FormEvent, useEffect, useState} from 'react'
import './App.css'
import JobTable from "./components/JobTable";
import axios from "axios";

const theme = createTheme()

function App() {
  const [loading, setLoading] = useState(true);
  const [changed, setChanged] = useState(false);

  const [jobSource, setJobSource] = useState("text");

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState('');

  const [feeStructure, setFeeStructure] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [expectedSettlement, setExpectedSettlement] = useState('');

  const [creationErrorOpen, setCreationErrorOpen] = useState(false);
  const [creationErrorMessage, setCreationErrorMessage] = useState('');

  const [jobs, setJobs] = useState([]);


  useEffect(() => {

    const getJobs = async () => {
      const {data} = await axios.get("http://localhost:4000/jobs");
      console.log(data);
      setJobs(data);
      setLoading(false);

    }

    getJobs();

  }, [changed])

  const displayCreationError = (errorMessage: string) => {
    setCreationErrorMessage(errorMessage);
    setCreationErrorOpen(true);
    setTimeout(() => setCreationErrorOpen(false), 2500);
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (jobTitle === '') return;
    if (jobSource === 'text' && jobDescription === '') return;
    if (jobSource === 'url' && jobUrl === '') return;
    if (feeStructure === "Fixed-Fee") setExpectedSettlement('');
    if (jobSource === 'url') setJobDescription('');
    if (jobSource === 'text') setJobUrl('');
    console.log(`Creating job - ${jobTitle} - ${jobDescription}`);
    try {
      const {data} = await axios.post("http://localhost:4000/jobs", {title: jobTitle, description: jobDescription, url: jobUrl, feeStructure: feeStructure, feeAmount: feeAmount, expectedSettlement: expectedSettlement});
      console.log(data);
      setChanged(!changed);
      setJobTitle("");
      setJobDescription("");
      setFeeAmount("");
      setFeeStructure("");
      setExpectedSettlement('');
      setJobUrl('');
    } catch (error: any) {
      console.log(error.response.data.message);
      displayCreationError(error.response.data.message);
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span>Create a job!</span>

            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1 }}>
              <Stack gap={2} width={'100%'}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  name="title"
                  autoFocus
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <FormControl>
                  <FormLabel>Create description from:</FormLabel>
                  <RadioGroup name="job-source" row value={jobSource} onChange={(e) => setJobSource(e.target.value)}>
                    <FormControlLabel value="text" control={<Radio/>} label="Text"/>
                    <FormControlLabel value="url" control={<Radio/>} label="URL"/>
                  </RadioGroup>
                </FormControl>
                {jobSource === 'text' ? <TextField
                  margin="normal"
                  required
                  fullWidth
                  multiline
                  minRows={3}
                  id="description"
                  label="Description"
                  name="description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                /> : <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="jobUrl"
                  label="URL"
                  name="jobUrl"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />}
                <FormControl>
                  <FormLabel>Fee Structure</FormLabel>
                  <RadioGroup name="fee-structure" row value={feeStructure} onChange={(e) => setFeeStructure(e.target.value)}>
                    <FormControlLabel value="No-Win-No-Fee" control={<Radio/>} label="No-Win-No-Fee"/>
                    <FormControlLabel value="Fixed-Fee" control={<Radio/>} label="Fixed-Fee"/>
                  </RadioGroup>
                </FormControl>
                <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='fee-amount'
                  label={feeStructure === "No-Win-No-Fee" ? "Fee Percentage" : "Fee Amount"}
                  InputProps={feeStructure === "No-Win-No-Fee" ? {
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  } : {
                    startAdornment: <InputAdornment position="start">??</InputAdornment>,
                  }}
                  name='fee-amount'
                  value={feeAmount}
                  onChange={event => setFeeAmount(event.target.value)}
                  />
                {feeStructure === 'No-Win-No-Fee' ? <TextField
                  margin='normal'
                  required
                  fullWidth
                  id='expected-settlement'
                  label='Expected Settlement'
                  InputProps={{startAdornment: <InputAdornment position='start'>??</InputAdornment>}}
                  name='expected-settlement'
                  value={expectedSettlement}
                  onChange={event => setExpectedSettlement(event.target.value)}
                /> : null}
                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={
                    jobTitle === '' ||
                    (jobDescription === '' && jobUrl === '') ||
                    feeStructure === '' ||
                    feeAmount === ''
                  }
                >
                  Create Job
                </LoadingButton>
                <Snackbar open={creationErrorOpen} anchorOrigin={{horizontal: "right", vertical: 'bottom'}}>
                  <Alert severity="error" variant='filled'>
                    <AlertTitle>Job Creation Failed</AlertTitle>
                    {creationErrorMessage}
                  </Alert>
                </Snackbar>
              </Stack>
            </Box>
          </Box>
        </Grid>

        <Grid
          item
          xs={false}
          sm={4}
          md={7}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h1>Available jobs</h1>
            {loading?
              <CircularProgress/> :
              <JobTable jobs={jobs} refreshTable={() => setChanged(!changed)}/>
            }
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default App
