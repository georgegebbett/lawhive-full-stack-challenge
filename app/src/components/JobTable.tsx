import {Job} from '../types/Job';
import {Chip, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";

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
          <TableCell>Fee Structure</TableCell>
          <TableCell>Fee Amount/Percentage</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {jobs.map(job => (
          <TableRow key={job._id}>
            <TableCell>{job.title}</TableCell>
            <TableCell>{job.description}</TableCell>
            <TableCell>{job.feeStructure}</TableCell>
            <TableCell>{`${job.feeStructure === "Fixed-Fee" ? "£" : ""}${job.feeAmount}${job.feeStructure === "No-Win-No-Fee" ? "%" : ""}`}</TableCell>
            <TableCell>
              <Chip label={job.state}/>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default JobTable;
