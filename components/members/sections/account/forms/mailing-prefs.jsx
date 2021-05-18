import { useState, useMemo, useContext, useEffect } from 'react';
import { Card, Typography, Switch, Row, Col, Button, message } from 'antd';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import * as memberTypes from '../../../../../data/members/member-types';
import { mailingLists } from '../../../../../data/members/airtable/airtable-values';
import { sibLists, getAllListIndexes } from '../../../../../data/emails/sendinblue-fields';
// utils
import { getAccountIsActive, updateMember } from '../../../../../utils/members/airtable/members-db';
import { updateContact } from '../../../../../utils/emails/sendinblue-utils';
import { dbFields } from '../../../../../data/members/airtable/airtable-fields';

const { Link } = Typography;

const MailPrefs = ({
  title,
  memberType,
  onLink,
  loading,
  setLoading,
}) => {
  const {
    // authUser,
    member, setMember,
    // userEmails,
    userPayments,
    memberPlans,
    // emailContacts,
    primaryEmail,
    // userMailingLists
    userMailingLists, setUserMailingLists,
    addToUserLists,
    removeFromUserLists,
  } = useContext(MembersContext);

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

  /******************************
   * Mailing list switch toggle *
   ******************************
   * toggle according to userMailingLists
   * userMailingLists changes when primary email changes.
   */
  useEffect(() => {
    if (userMailingLists) {
      if (userMailingLists.listIds) {
        userMailingLists.listIds.forEach((id) => {
          for (const key in sibLists) {
            if (id === sibLists.newsletter.id) setNewsletterChecked(true);
            if (id === sibLists.members.id) setMemberEmailChecked(true);
            if (id === sibLists.law_notes.id) setLawNotesChecked(true);
          }
        });
      }
      if (userMailingLists.unlinkListIds) {
        userMailingLists.unlinkListIds.forEach((id) => {
          for (const key in sibLists) {
            if (id === sibLists.newsletter.id) setNewsletterChecked(false);
            if (id === sibLists.members.id) setMemberEmailChecked(false);
            if (id === sibLists.law_notes.id) setLawNotesChecked(false);
          }
        });
      }
    } else {
      setNewsletterChecked(false);
      setMemberEmailChecked(false);
      setLawNotesChecked(false);
    }
  }, [userMailingLists]);

  /**********************************
   * check/uncheck newsletter types *
   **********************************
   * uncheck emails non-members not eligible for
   */
  useEffect(() => {
    if (memberType === memberTypes.USER_NON_MEMBER || !accountIsActive) {
      setMemberEmailChecked(false);
      setLawNotesChecked(false);
    }
  }, [memberTypes]);

  const areAllChecked = () => {
    return (newsletterChecked && memberEmailChecked && lawNotesChecked);
  };

  /*******************************
   * toggle list - one at a time *
   *******************************
   * updating userMailingLists will update ESP contact
   *
   * @param {string} type: 'newsletter, 'members', 'law_notes'
   * @param {boolean} checked
   */
  const onToggleMailing = async (type, checked) => {
    message.loading('Saving settings...', 3);
    setLoading(true);
    if (type === 'newsletter') setNewsletterChecked(checked);
    if (type === 'members') setMemberEmailChecked(checked);
    if (type === 'law_notes') setLawNotesChecked(checked);

    const addToUnsubscribed = (type) => {
      const currentLists = member.fields[dbFields.members.listsUnsubscribed];
      let list = [];
      if (currentLists) list = [...currentLists];
      let typeFound = null;
      if (list.length > 0) typeFound = list.find((item) => item === type);
      if (!typeFound) list.push(type);
      return list;
    }

    const addToFromMailLists = (type) => {
      const currentLists = member.fields[dbFields.members.mailingLists];
      let list = [];
      if (currentLists) list = [...currentLists];
      let typeFound = null;
      if (list.length > 0) typeFound = list.find((item) => item === type);
      if (!typeFound) list.push(type);
      return list;
    }

    const removeFromUnsubscribed = (type) => {
      const currentLists = member.fields[dbFields.members.listsUnsubscribed];
      let list = [];
      if (currentLists) list = [...currentLists];
      if (list.length > 0) {
        list = list.reduce((acc, cur) => {
          if (type !== cur) acc.push(cur);
          return acc;
        }, []);
      }
      return list;
    }

    const removeFromMailLists = (type) => {
      const currentLists = member.fields[dbFields.members.mailingLists];
      let list = [];
      if (currentLists) list = [...currentLists];
      if (list.length > 0) {
        list = list.reduce((acc, cur) => {
          if (type !== cur) acc.push(cur);
          return acc;
        }, []);
      }
      return list;
    }

    if (checked) {
      addToUserLists(sibLists[type].id); // > userMailingLists > updateContactLists
      const unsubLists = removeFromUnsubscribed(type);
      const mailLists = addToFromMailLists(type);
      const payload = {
        id: member.id,
        fields: {
          [dbFields.members.listsUnsubscribed]: unsubLists,
          [dbFields.members.mailingLists]: mailLists,
        }
      }
      const updatedMember = await updateMember(payload);
      if (updatedMember.member) setMember(updatedMember.member);
      setLoading(false);
      message.success('Mailing list settings updated.');
    }
    if (!checked) {
      removeFromUserLists(sibLists[type].id); // > userMailingLists > updateContactLists
      const unsubLists = addToUnsubscribed(type);
      const mailLists = removeFromMailLists(type);
      const payload = {
        id: member.id,
        fields: {
          [dbFields.members.listsUnsubscribed]: unsubLists,
          [dbFields.members.mailingLists]: mailLists,
        }
      }
      const updatedMember = await updateMember(payload);
      if (updatedMember.member) setMember(updatedMember.member);
      setLoading(false);
      message.success('Mailing list settings updated.');
    }
  }

  /************************
   * add/remove all lists *
   ************************
   * only when user eligible for member-only lists
   *
   * @param {*} bool - true = add, false = remove
   */
  const toggleMailings = async (bool) => {
    message.loading('Saving settings...', 3);
    setLoading(true);

    let unsubscribeList = [];
    let mailLists = [];
    if (bool) {
      await updateContact({
        email: primaryEmail,
        listIds: getAllListIndexes(),
      });
      setUserMailingLists({ listIds: getAllListIndexes() });
      mailLists = mailingLists;
    }
    if (!bool) {
      await updateContact({
        email: primaryEmail,
        unlinkListIds: getAllListIndexes(),
      });
      setUserMailingLists({ unlinkListIds: getAllListIndexes() });
      unsubscribeList = mailingLists;
    }
    const updatedMember = await updateMember({
      id: member.id,
      fields: {
        [dbFields.members.listsUnsubscribed]: unsubscribeList,
        [dbFields.members.mailingLists]: mailLists,
      }
    });
    if (updatedMember.member) setMember(updatedMember.member);
    setNewsletterChecked(bool);
    setMemberEmailChecked(bool);
    setLawNotesChecked(bool);
    setLoading(false);
    message.success('Mailing list settings updated.');
  };

  // `Check all` and `Uncheck all` links
  const checkLink = useMemo(() => {
    if (primaryEmail && memberType !== memberTypes.USER_NON_MEMBER && accountIsActive) {
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
      {!primaryEmail &&
        <p className="text-danger">Your email address has been blocked. Unblock a verified email address in <a href="#emails" className="text-nowrap">Email addresses</a> above to start receiving emails again.</p>
      }

      <div>Choose the type of emails that you would like to receive:</div>

      {/* Newsletter */}
      <div className="mt-2">
        <Switch
          key="newsletter-switch"
          checked={newsletterChecked}
          onChange={(checked) => onToggleMailing('newsletter', checked)}
          disabled={!primaryEmail && true}
          loading={loading}
          size="small"
          style={!primaryEmail ? { backgroundColor: 'red' } : null}
        />&nbsp;&nbsp;<strong>LGBT Bar Newsletter emails</strong>, including Pride and Advocacy emails
      </div>

      {/* Members List */}
      <div className="mt-2">
        <Row justify="space-between">
          <Col>
            <Switch
              checked={memberEmailChecked}
              onClick={(checked) => onToggleMailing('members', checked)}
              disabled={(
                memberType === memberTypes.USER_NON_MEMBER || !accountIsActive ||
                !primaryEmail
              ) && true}
              loading={loading}
              size="small"
              style={primaryEmail ? null : { backgroundColor: 'red' }}
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
              onClick={(checked) => onToggleMailing('law_notes', checked)}
              disabled={(
                memberType === memberTypes.USER_NON_MEMBER || !accountIsActive ||
                !primaryEmail
              ) && true}
              loading={loading}
              size="small"
              style={primaryEmail ? null : { backgroundColor: 'red' }}
            />&nbsp;&nbsp;<strong>Law Notes emails:</strong> magazine &amp; podcast
          </Col>
          {/* {memberType === memberTypes.USER_NON_MEMBER &&
            <Col><Button type="primary" size="small" onClick={() => onLink(memberTypes.SIGNUP_LAW_NOTES)}>Subscribe to Law Notes</Button></Col>
          } */}
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
      }{primaryEmail && <>To update your primary email address, edit in <a href="#emails">Email addresses</a> above.</>}</div>

    </Card>
  </>;
};

export default MailPrefs;
