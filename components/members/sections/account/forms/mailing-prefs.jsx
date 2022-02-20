import { useState, useMemo, useContext, useEffect } from 'react';
import { Card, Typography, Switch, Row, Col, Button, message } from 'antd';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import * as memberTypes from '../../../../../data/members/member-types';
import {
  sibLists,
  getSibListIdByTitle,
  getAllListIndeces,
} from '../../../../../data/emails/sendinblue-fields';
// utils
import {
  getMemberEligibleLists,
  updateMember,
} from '../../../../../utils/members/airtable/members-db';
import { updateContact } from '../../../../../utils/emails/sendinblue-utils';
import { dbFields } from '../../../../../data/members/airtable/airtable-fields';

const { Link } = Typography;

const MailingPrefs = ({
  title,
  memberStatus,
  memberType,
  onLink,
  loading,
  setLoading,
}) => {
  const {
    // member
    member, setMember,

    // email
    primaryEmail,
    mailingLists, setMailingLists,
  } = useContext(MembersContext);

  const [newsletterChecked, setNewsletterChecked] = useState(false);
  const [memberEmailChecked, setMemberEmailChecked] = useState(false);
  const [lawNotesChecked, setLawNotesChecked] = useState(false);

  const isMemberListEligible =
    memberStatus === memberTypes.USER_ATTORNEY ||
    memberStatus === memberTypes.USER_STUDENT ||
    // deprecate
    memberStatus === memberTypes.USER_MEMBER ||
    memberStatus === memberTypes.USER_DONOR;

  const isLawNotesEligible = isMemberListEligible ||
    memberStatus === memberTypes.USER_LAW_NOTES;

  // eligible member lists, including the Newsletter
  const allMemberElegibleLists = useMemo(() => {
    let lists = [dbFields.members.listNewsletter]
    const memberEligible = getMemberEligibleLists(memberStatus)
    if (memberEligible?.length > 0) {
      lists = [...lists, ...memberEligible]
    }
    return lists
  }, [member, memberStatus])

  /******************************
   * Mailing list switch toggle *
   ******************************
   * toggle according to mailingLists
   */
  useEffect(() => {
    let newsletterChecked = false
    let membersChecked = false
    let lawNotesChecked = false
    if (mailingLists?.length > 0) {
      mailingLists.forEach((id) => {
        for (const key in sibLists) {
          if (id === sibLists.newsletter.title) newsletterChecked = true;
          if (id === sibLists.members.title) membersChecked = true;
          if (id === sibLists.law_notes.title) lawNotesChecked = true;
        }
      })
    }
    setNewsletterChecked(newsletterChecked)
    setMemberEmailChecked(membersChecked)
    setLawNotesChecked(lawNotesChecked)
  }, [mailingLists])

  /**********************************
   * check/uncheck mailing lists
   **********************************
   * uncheck emails non-members not eligible for
   */
  useEffect(() => {
    if (!isLawNotesEligible) {
      setLawNotesChecked(false);
    }
    if (!isMemberListEligible) {
      setMemberEmailChecked(false);
    }
  }, [memberType]);

  const stopLoading = () => {
    message.loading('Saving settings...')
    setLoading(false)
  }

  // update member exclde list and set new member
  const updateExcludeList = async (value) => {
    const excludePayload = {
      id: member.id,
      fields: {
        [dbFields.members.listsUnsubscribed]: value,
      }
    }
    const updatedMember = await updateMember(excludePayload)
    if (updatedMember.member) setMember(updatedMember.member)
  }

  /*******************************
   * toggle list - one at a time *
   *******************************   *
   * @param {string} listTitle: 'Newsletter, 'Members', 'Law Notes'
   * @param {boolean} checked
   */
  const onToggleMailing = async (listTitle, checked) => {
    // check if user session expired
    onLink('check-session')

    setLoading(true)
    if (listTitle === dbFields.members.listNewsletter) setNewsletterChecked(checked)
    if (listTitle === dbFields.members.listMembers) setMemberEmailChecked(checked)
    if (listTitle === dbFields.members.listLawNotes) setLawNotesChecked(checked)

    // add mailing list
    if (checked) {
      // add to SendingBlue
      const listIds = [getSibListIdByTitle(listTitle)]
      updateContact({ email: primaryEmail, listIds })

      // remove from Airtable exclusion list
      const currentLists = member.fields?.[dbFields.members.listsUnsubscribed]
      let excludeList = []
      if (currentLists) {
        excludeList = [...currentLists].filter((list) => list !== listTitle)
        await updateExcludeList(excludeList)
        stopLoading()
      } else {
        stopLoading()
      }

      // update local state
      let lists = []
      if (mailingLists) lists = [...mailingLists]
      lists.push(listTitle)
      setMailingLists(lists)

      message.success('Mailing list settings updated.')
    }

    // uncheck and remove mailing list
    if (!checked) {

      // remove from SendinBlue
      const unlinkListIds = [getSibListIdByTitle(listTitle)]
      updateContact({ email: primaryEmail, unlinkListIds })

      // add to Airtable exclusion list
      const currentLists = member.fields?.[dbFields.members.listsUnsubscribed]
      let excludeList = [listTitle]
      if (currentLists) excludeList = [
        ...currentLists,
        ...excludeList
      ]
      await updateExcludeList(excludeList)

      // update local state
      let lists = []
      if (mailingLists) {
        lists = [...mailingLists].filter((list) => list !== listTitle)
        setMailingLists(lists)
      }

      setLoading(false)
      message.success('Mailing list settings updated.')
    }
  }

  /************************
   * add/remove all lists *
   ************************
   * only when user eligible for member-only lists
   * links that call function don't appear if member not active
   * @param {*} check - true = check all, false = uncheck all
   */
  const toggleAllMailings = async (check) => {
    // check if user session expired
    onLink('check-session')

    setLoading(true)

    // check all
    if (check) {

      // add to SendingBlue
      const listIds = [...allMemberElegibleLists].map((list) => getSibListIdByTitle(list))
      updateContact({ email: primaryEmail, listIds })

      // remove all from Airtable exclusion list
      await updateExcludeList([])

      // update local state
      setMailingLists([...allMemberElegibleLists])
    }

    // uncheck all
    if (!check) {

      // remove all from SendingBlue
      updateContact({
        email: primaryEmail,
        unlinkListIds: getAllListIndeces(),
      })

      // add all to Airtable exclusion list
      await updateExcludeList([...allMemberElegibleLists])

      // update local state
      setMailingLists([])
    }
    setNewsletterChecked(check)
    setMemberEmailChecked(check)
    setLawNotesChecked(check)
    setLoading(false)
    message.success('Mailing list settings updated.')
  }

  // `Check all` and `Uncheck all` links
  // ...only appear when member is active
  const checkLink = () => {
    if (primaryEmail &&
      allMemberElegibleLists?.length > 0
    ) {
      if (mailingLists?.length === allMemberElegibleLists.length) {
        return <span><Link onClick={() => toggleAllMailings(false)}>Uncheck all</Link></span>
      } else {
        return <span><Link onClick={() => toggleAllMailings(true)}>Check all</Link></span>
      }
    }
    return null;
  }

  const signUpButton = () => {
    const button = (label) => {
      return <Col><Button type="primary" size="small" onClick={() => onLink('signup')}>{label}</Button></Col>
    }
    if (memberStatus === memberTypes.USER_NON_MEMBER) return button('Become a member');
    if (memberStatus === memberTypes.USER_STUDENT_GRADUATED) return button('Upgrade membership');
    if (memberStatus === memberTypes.USER_ATTORNEY_EXPIRED || memberStatus === memberTypes.USER_LAW_NOTES_EXPIRED) return button('Renew your membership');
  }

  return <>
    <Card
      title={<span>{title}</span>}
      extra={checkLink()}
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
          onChange={(checked) => onToggleMailing(dbFields.members.listNewsletter, checked)}
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
              onClick={(checked) => onToggleMailing(dbFields.members.listMembers, checked)}
              disabled={(
                !isMemberListEligible || !isLawNotesEligible ||
                !primaryEmail
              ) && true}
              loading={loading}
              size="small"
              style={primaryEmail ? null : { backgroundColor: 'red' }}
            />&nbsp;&nbsp;<strong>Association Member emails</strong>
          </Col>
          {signUpButton()}
        </Row>
      </div>

      {/* Law Notes */}
      <div className="mt-2">
        <Row justify="space-between">
          <Col>
            <Switch
              checked={lawNotesChecked}
              onClick={(checked) => onToggleMailing(dbFields.members.listLawNotes, checked)}
              disabled={(
                !isLawNotesEligible ||
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

export default MailingPrefs;
