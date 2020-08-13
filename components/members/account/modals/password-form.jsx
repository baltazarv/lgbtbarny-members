const PasswordForm = () => {
  return <>
    <ul>
      <li><em>For security, enter</em> Current Password</li>
      <li>New Password <em>(8-60 characters)</em></li>
      <li>Confirm New Password</li>
    </ul>
    {/* <div style={{textDecoration: 'underline'}}>Your password is not strong enough. Your password must be at least 10 characters.</div> */}
  </>;
}

export default PasswordForm;