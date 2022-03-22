import {Job} from '../types/Job';
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import axios from "axios";
import {useState} from "react";

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



function JobTable({jobs, refreshTable}: Props) {

  const [paymentErrorOpen, setPaymentErrorOpen] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('');

  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);

  const displayPaymentError = (errorMessage: string) => {
    setPaymentErrorMessage(errorMessage);
    setPaymentErrorOpen(true);
    setTimeout(() => setPaymentErrorOpen(false), 5000);
  }

  const displayPaymentSuccess = () => {
    setPaymentSuccessOpen(true);
    setTimeout(() => setPaymentSuccessOpen(false), 5000);
  }

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
      .then(() => {
        displayPaymentSuccess();
        refreshTable();
      })
      .catch((error) => {
        console.log(error.response);
        displayPaymentError(error.response.data.message);
      });
  }

  return (
    <div>
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
      <Snackbar open={paymentErrorOpen} anchorOrigin={{horizontal: "right", vertical: 'bottom'}}>
        <Alert severity="error" variant='filled'>
          <AlertTitle>Payment Failed</AlertTitle>
          {paymentErrorMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={paymentSuccessOpen} anchorOrigin={{horizontal: "right", vertical: 'bottom'}}>
        <Alert severity="success" variant='filled'>
          <AlertTitle>Payment Succeeded</AlertTitle>
          The payment has been stored
        </Alert>
      </Snackbar>

    </div>
  )
}

export default JobTable;
