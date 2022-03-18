import {Job} from '../types/Job';
import {Button, Chip, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import axios from "axios";

interface Props {
  jobs: Job[],
  refreshTable: () => void
}

const markJobPaid = (job: Job, refreshTable: () => void) => {

  const getSettlementAmount = () => {
    while (true){
      const settlementAmount = prompt("Enter Settlement amount");
      if (settlementAmount !== null && parseFloat(settlementAmount)) return settlementAmount;
    }
  }

  let paymentAmount;
  if (job.feeStructure === "No-Win-No-Fee") {
    const settlementAmount = getSettlementAmount();
    paymentAmount = (job.feeAmount / 100) * parseFloat(settlementAmount);
  } else {
    paymentAmount = job.feeAmount;
  }
  axios.post(`http://localhost:4000/jobs/${job._id}/pay`, {paymentAmount: paymentAmount})
    .then(() => refreshTable());
}

function JobTable({jobs, refreshTable}: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Fee Structure</TableCell>
          <TableCell>Fee Amount/Percentage</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Pay</TableCell>
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
              <Chip color={job.state === "paid" ? "success" : "default"} label={job.state}/>
            </TableCell>
            <TableCell>
              {
                job.state === 'started' ?
                (<Button
                  variant="contained"
                  disabled={job.state !== 'started'}
                  onClick={() => markJobPaid(job, refreshTable)}
                >Pay</Button>)
                  :
                (`£${job.paymentAmount}`)
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default JobTable;
