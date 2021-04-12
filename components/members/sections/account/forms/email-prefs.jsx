import { useState, useMemo, useContext, useEffect } from 'react';
import { Card, Typography, Switch, Row, Col, Button, message } from 'antd';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import * as memberTypes from '../../../../../data/members/member-types';
import { sibLists, getAllSibListIndexes } from '../../../../../data/emails/sendinblue-fields';
// utils
import { getAccountIsActive, getPrimaryEmail } from '../../../../../utils/members/airtable/members-db';
import { getMailListsSubscribed, updateContact } from '../../../../../utils/emails/sendinblue-utils';

const { Link } = Typography;

const EmailPrefs = ({
  title,
  memberType,
  onLink,
  loading,
  setLoading,
}) => {
  const { member, userEmails, userPayments, memberPlans } = useContext(MembersContext);

  // set default list states when load
  const [mailListsSubscribed, setMailListsSubscribed] = useState(null);

  const [newsletterChecked, setNewsletterChecked] = useState(false);
  const [memberEmailChecked, setMemberEmailChecked] = useState(false);
  const [lawNotesChecked, setLawNotesChecked] = useState(false);

  const accountIsActive = useMemo(() => {
    return getAccountIsActive({
      userPayments,
      memberPlans,
      member,
    });
  }, [userPayments, memberPlans, member]);

  const primaryEmail = useMemo(() => {
    return getPrimaryEmail(userEmails);
  }, [userEmails]);

  // get subscribed mailing lists from email svs provider
  useEffect(() => {
    (async () => {
      const lists = await getMailListsSubscribed(primaryEmail);
      // if list is [] getMailListsSubscribed returns null
      if (lists) setMailListsSubscribed(lists);
    })();
  }, [primaryEmail]);

  /**
   * Toggle lists according to email svs provider settings.
   *
   * mailListsSubscribed changes when:
   * * primary email changes.
   * * TODO: user manually changes settings.
   */
  //
  //
  useEffect(() => {
    if (mailListsSubscribed) {
      mailListsSubscribed.forEach((listValue) => {
        for (const key in sibLists) {
          if (listValue === key) {
            if (listValue === 'newsletter') setNewsletterChecked(true);
            if (listValue === 'members') setMemberEmailChecked(true);
            if (listValue === 'lawNotes') setLawNotesChecked(true);
          }
        }
      });
    }
  }, [mailListsSubscribed]);

  /**
   * check/uncheck newsletter types
   */

  // uncheck emails non-members not eligible for
  useEffect(() => {
    if (memberType === memberTypes.USER_NON_MEMBER || !accountIsActive) {
      setMemberEmailChecked(false);
      setLawNotesChecked(false);
    }
  }, [memberTypes]);

  const areAllChecked = () => {
    return (newsletterChecked && memberEmailChecked && lawNotesChecked);
  };

  const onToggleMailing = async (type, checked) => {
    message.loading('Saving settings...', 3);
    setLoading(true);
    if (type === 'newsletter') setNewsletterChecked(checked);
    if (type === 'members') setMemberEmailChecked(checked);
    if (type === 'lawNotes') setLawNotesChecked(checked);

    // change on emails svs provider
    if (checked) {
      // console.log('listIds =>', sibLists[type]);
      await updateContact({
        email: primaryEmail,
        listIds: [ sibLists[type] ],
      });
      setLoading(false);
      message.success('Mailing list settings updated.');
    }
    if (!checked) {
      // console.log('unlinkListIds =>', sibLists[type]);
      await updateContact({
        email: primaryEmail,
        unlinkListIds: [ sibLists[type] ],
      });
      setLoading(false);
      message.success('Mailing list settings updated.');
    }
  }

  const toggleMailings = async (bool) => {
    message.loading('Saving settings...', 3);
    setLoading(true);
    setNewsletterChecked(bool);
    setMemberEmailChecked(bool);
    setLawNotesChecked(bool);

    if (bool) {
      console.log('listIds =>', getAllSibListIndexes());
      await updateContact({
        email: primaryEmail,
        listIds: getAllSibListIndexes(),
      });
      setLoading(false);
      message.success('Mailing list settings updated.');
    }
    if (!bool) {
      console.log('unlinkListIds =>', getAllSibListIndexes());
      await updateContact({
        email: primaryEmail,
        unlinkListIds: getAllSibListIndexes(),
      });
      setLoading(false);
      message.success('Mailing list settings updated.');
    }
  };

  const checkLink = useMemo(() => {
    if (memberType !== memberTypes.USER_NON_MEMBER && accountIsActive) {
      return <span>{areAllChecked()
        ? <Link onClick={() => toggleMailings(false)}>Uncheck all</Link>
        : <Link onClick={() => toggleMailings(true)}>Check all</Link>
      }</span>;
    }
    return null;
  }, [memberType, memberTypes, newsletterChecked, memberEmailChecked, lawNotesChecked]);

  return <>
    <Card
      title={<span>{title}</span>}
      extra={checkLink}
      style={{ maxWidth: 600 }}
    >
      <div>Choose the type of emails that you would like to receive:</div>

      {/* Newsletter */}
      <div className="mt-2">
        <Switch
          key="newsletter-switch"
          checked={newsletterChecked}
          onChange={(checked) => onToggleMailing('newsletter', checked)}
          loading={loading}
          size="small"
        />&nbsp;&nbsp;<strong>LGBT Bar Newsletter emails</strong>, including Pride and Advocacy emails
      </div>

      {/* Members List */}
      <div className="mt-2">
        <Row justify="space-between">
          <Col>
            <Switch
              checked={memberEmailChecked}
              onClick={(checked) => onToggleMailing('members', checked)}
              disabled={(memberType === memberTypes.USER_NON_MEMBER || !accountIsActive) && true}
              loading={loading}
              size="small"
            />&nbsp;&nbsp;<strong>Association Member emails</strong>
          </Col>
          {memberType === memberTypes.USER_NON_MEMBER
            && <Col><Button type="primary" size="small" onClick={() => onLink('signup')}>Become a member</Button></Col>
          }
          {memberType !== memberTypes.USER_NON_MEMBER && !accountIsActive
            && <Col><Button type="primary" size="small" onClick={() => onLink('signup')}>Upgrade membership</Button></Col>
          }
        </Row>
      </div>

      {/* Law Notes */}
      <div className="mt-2">
        <Row justify="space-between">
          <Col>
            <Switch
              checked={lawNotesChecked}
              onClick={(checked) => onToggleMailing('lawNotes', checked)}
              disabled={(memberType === memberTypes.USER_NON_MEMBER || !accountIsActive) && true}
              loading={loading}
              size="small"
            />&nbsp;&nbsp;<strong>Law Notes emails:</strong> magazine &amp; podcast
          </Col>
          {memberType === memberTypes.USER_NON_MEMBER &&
            <Col><Button type="primary" size="small" onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>Subscribe to Law Notes</Button></Col>
          }
        </Row>
      </div>

      <div className="mt-2">
        <Switch
          defaultChecked
          disabled
          size="small"
        />&nbsp;&nbsp;<strong>Transactional notifications</strong>, including the following, will always be sent:
        <ul>
          <li>Emails to log in.</li>
          <li>Transaction &amp; payment emails</li>
          {/* <li>Event registration confirmations</li> */}
        </ul>
      </div>

      <div className="mt-4">{primaryEmail
        ? <span>We will email you at <strong>{primaryEmail}</strong>. </span>
        : ''
      }To update <strong>email address</strong>, edit in <a href="#emails">Email</a> section above.</div>

    </Card>
  </>;
};

export default EmailPrefs;