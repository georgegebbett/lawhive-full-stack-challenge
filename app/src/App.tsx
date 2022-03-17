import { LoadingButton } from '@mui/lab'
import { Box, CircularProgress, Paper, Stack, TextField } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import React, {FormEvent, FormEventHandler, useEffect, useState} from 'react'
import './App.css'
import JobTable from "./components/JobTable";
import axios from "axios";

const theme = createTheme()

function App() {
  const [loading, setLoading] = useState(true);
  const [changed, setChanged] = useState(false);

  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Creating job - ${jobTitle} - ${jobDescription}`);
    const {data} = await axios.post("http://localhost:4000/jobs", {title: jobTitle, description: jobDescription});
    console.log(data);
    setChanged(!changed);
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
                  onChange={(e) => setJobTitle(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <LoadingButton
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  Create Job
                </LoadingButton>
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
            {loading?
              <CircularProgress/> :
              <JobTable jobs={jobs}/>
            }
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default App
