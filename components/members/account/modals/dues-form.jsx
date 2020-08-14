import { useState } from 'react';
import { Typography } from 'antd';

const { Link } = Typography;

const DuesForm = ({
  user,
  updateDonationOnly = false,
}) => {
  const [donationIsUpdated, setDonationIsUpdated] = useState(false);
  // const [updateDonationOnly, setUpdateDonationOnly] = useState(false);

  return <>
    <ul>
      {!updateDonationOnly && <li>New salary range</li>}
      {(donationIsUpdated || updateDonationOnly)
        && <li>New yearly donation</li>
      }
    </ul>
    <hr />
    <div>
      {donationIsUpdated ? 'Updated annual fee' : 'Annual fee'} <em>(based on salary)</em><br />
      {(donationIsUpdated || updateDonationOnly)
        ? <div>Updated donation</div>
        : <div>Current yearly donation <Link onClick={() => setDonationIsUpdated(true)}>Update Donation</Link></div>
      }
    </div>
    <div><strong>Total yearly charge</strong></div>

    {user && user.memberstart
      && <div className="mt-4" style={{fontSize: '.9em'}}>Your payment method will be charged on {user.memberstart}.</div>}
  </>;
}

export default DuesForm;