import {Job} from '../types/Job';
import {Button, Chip, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import axios from "axios";

interface Props {
  jobs: Job[],
  refreshTable: () => void
}

const statusMapping = {
  started: "Started",
  paid: "Paid"
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'});
const percentageFormatter = new Intl.NumberFormat('en-GB', {style: 'percent', maximumFractionDigits: 5});

const markJobPaid = (job: Job, refreshTable: () => void) => {

  const getSettlementAmount = () => {
    while (true){
      const settlementAmount = prompt("Enter Settlement amount");
      if (settlementAmount !== null && parseFloat(settlementAmount)) return settlementAmount;
    }
  }

  let settlementAmount;
  if (job.feeStructure === "No-Win-No-Fee") {
    settlementAmount = getSettlementAmount();
  }
  axios.post(`http://localhost:4000/jobs/${job._id}/pay`, {settlementAmount: settlementAmount})
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
            <TableCell>{job.feeStructure === "Fixed-Fee" ? currencyFormatter.format(job.feeAmount) : percentageFormatter.format(job.feeAmount/100)}</TableCell>
            <TableCell>
              <Chip color={job.state === "paid" ? "success" : "default"} label={statusMapping[job.state]}/>
            </TableCell>
            <TableCell>
              {
                job.state === 'started' ?
                (<Button
                  variant="contained"
                  onClick={() => markJobPaid(job, refreshTable)}
                >Pay</Button>)
                  :
                (currencyFormatter.format(job.paymentAmount))
              }
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default JobTable;
