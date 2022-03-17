import {Job} from '../types/Job';
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

interface Props {
  jobs: Job[]
}

function JobTable({jobs}: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {jobs.map(job => (
          <TableRow key={job._id}>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.description}</TableCell>
            <TableCell>{job.state}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default JobTable;
