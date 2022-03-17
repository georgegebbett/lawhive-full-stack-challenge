import {Job} from '../types/Job';

interface Props {
  jobs: Job[]
}

function JobTable({jobs}: Props) {
  return (
    <table>
      <thead>
      <tr>
        <th>Title</th>
        <th>Description</th>
      </tr>
      </thead>
      <tbody>
      {jobs.map(job => (
        <tr key={job._id}>
          <td>{job.title}</td>
          <td>{job.description}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}

export default JobTable;
