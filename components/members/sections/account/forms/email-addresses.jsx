/**
 * Intermediary `AccountsItem` component with render props between this component and `Accounts` component. `dataSource`, `selectedRowKeys`, and `setSelectedRowKeysprop` inside `value` prop sent by Account.
 * * Account 'emailTableDataSource' defines data displayed on table.
 *
 * * Primary email switch handled by grand-parent component Account's changePrimaryEmail` function.
 * * Subscribing/unsubscribing (blocking) emails handled by `toggleBlockEmail` in this component.
 * * Deleting emails handled within this component by`onDeleteEmail`.
 * * Saving a new email handled within this component by `saveEmail`. The form surrounding the `Search` input is the only form on this component.
 */
import { useState, useMemo, useContext } from 'react';
import { Table, Form, Input, Tag, Tooltip, Typography, Popconfirm } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import SeeMore from '../../../../elements/see-more';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import { dbFields } from '../../../../../data/members/airtable/airtable-fields';
import { sibFields, getListTitle } from '../../../../../data/emails/sendinblue-fields';
// utils
import {
  createEmail,
  updateEmails,
  deleteEmail,
} from '../../../../../utils/members/airtable/members-db';
import { updateContact } from '../../../../../utils/emails/sendinblue-utils';

const { Link } = Typography;
const { Search } = Input;

const EmailsAddresses = ({
  loading,
  editing,

  // primary email
  values,
  selectChanges, // on save > Account changePrimaryEmail

  // delete email
  onCancel,
}) => {
  const {
    authUser,
    member,
    userEmails, setUserEmails,
    primaryEmail,
    mailingLists,
  } = useContext(MembersContext);
  const [form] = Form.useForm(); // save email form
  const [addEmailLoading, setAddEmailLoading] = useState(false)

  // the primary email is never null even if all verified emails are blacklisted
  const primaryEmailIsBlocked = useMemo(() => {
    if (primaryEmail && userEmails) {
      return userEmails.find((email) => {
        return email.fields[dbFields.emails.address] === primaryEmail && email.fields[dbFields.emails.blocked]
      })
    }
    return null
  }, [primaryEmail, userEmails])

  const primaryTagTooltip = 'Primary address will receive emails from the LGBT Bar of NY. Only verified addresses qualify.';
  const blockedTagTooltip = 'Unblock an email address to start receiving emails.';

  /***********************
   * Update primary email
   ***********************
   */
  const onSelectChange = (selectedRowKeys) => {
    values.setSelectedRowKeys(selectedRowKeys);
  };

  const onSelectPrimary = (record) => {
    selectChanges(record); // change primary email
  };

  /******************
   * (Un)block email
   ******************
   * given a row's key and a boolean value
   */
  const toggleBlockEmail = async (key, bool) => {
    const _bool = bool || false;
    // remove blacklist from SendinBlue
    const emailToUnblock = [...userEmails].find((email) => email.id === key);
    await updateContact({
      email: emailToUnblock.fields[dbFields.emails.address],
      [sibFields.contacts.emailBlacklisted]: _bool,
    })

    // unblock email on Airtable
    let emailsToUpdate = [
      { id: key, fields: { [dbFields.emails.blocked]: _bool } },
    ];
    const { emails } = await updateEmails(emailsToUpdate);
    const updatedEmail = emails[0];
    const emailsWithBlockedValue = [...userEmails].map((email) => {
      if (updatedEmail.id === email.id) return updatedEmail;
      return email;
    });

    setUserEmails(emailsWithBlockedValue);
  }

  /**
   * Save new email
   */

  const addEmail = async (emailAddress) => {
    setAddEmailLoading(true);
    if (emailAddress) {
      try {
        await form.validateFields();
        const repeatEmail = userEmails.find(address => address.fields[dbFields.emails.address].toLowerCase() === emailAddress.toLowerCase());
        if (repeatEmail) {
          form.setFields([{
            name: dbFields.emails.address,
            errors: ['Enter a unique email address.'],
          }]);
        } else {
          const userid = member.id;
          const { email, error } = await createEmail({
            emailAddress,
            userid,
          });
          if (email) setUserEmails([...userEmails].concat([email]));
          form.resetFields();
        }
        setAddEmailLoading(false);
      } catch (error) {
        console.log('ERROR', error);
        setAddEmailLoading(false);
      }
    } else {
      form.setFields([{
        name: dbFields.emails.address,
        errors: ['Enter an email address.'],
      }]);
      setAddEmailLoading(false);
    }
  };

  /**
   * Delete email
   */

  const loggedInEmail = useMemo(() => {
    if (authUser) {
      return authUser.name;
    }
    return null;
  }, [authUser]);

  const onDeleteEmail = async (key) => {
    const { emailid } = await deleteEmail(key);
    if (emailid) {
      const emails = [...userEmails].reduce((acc, cur) => {
        if (emailid !== cur.id) acc.push(cur);
        return acc;
      }, [])
      setUserEmails(emails);
      console.log('TODO: delete or unsubsribe verified email on SiN')
    }
    onCancel();
  }

  const rowSelection = useMemo(() => {
    if (editing) return {
      type: "radio",
      selectedRowKeys: values.selectedRowKeys,
      onChange: onSelectChange,
      onSelect: onSelectPrimary,
      getCheckboxProps: (record) => ({
        disabled: record.primary || !record.verified || record.blocked,
      }),
      renderCell: (checked, record, index, originNode) => {
        let label = '';
        if (record.verified) label = 'Make Primary';
        if (record.primary) label = 'Primary';
        if (record.verified && record.blocked) label = <Popconfirm
          title={<span>Unblock <strong>{record.email}</strong>?</span>} onConfirm={() => toggleBlockEmail(record.key, false)}
          okText="Unblock"
          cancelButtonProps={{ danger: true }}
          placement="topLeft"
        >
          <Link
            className="text-danger"
            size="small"
          >
            Unblock
          </Link>
        </Popconfirm>;

        let boldClass = (record.primary) ? 'font-weight-bold' : 'font-weight-normal';

        let colorClass = 'text-muted';
        if (!record.primary && record.verified) colorClass = 'text-primary';

        const labelContent = <>
          {originNode} <label style={{ fontSize: 12 }} className={`${boldClass} ${colorClass}`}>{label}</label>
        </>;

        return <Tooltip title={primaryTagTooltip}>
          {labelContent}
        </Tooltip>;
      },
    };
    return null;
  }, [editing, values]);

  const verifiedEmailColRender = (text) => {
    // if text empty not verified
    let tag = null;
    if (text) {
      tag = <Tag style={{
        backgroundColor: 'white',
        borderStyle: 'dashed',
        // borderColor: '#389e0d',
      }} className="text-success">Verified</Tag>
    } else {
      tag = <Tag style={{ borderStyle: 'dashed' }}>Not Verified</Tag>
    }
    return <Tooltip title="You have logged into your account using this email address.">
      {tag}
    </Tooltip>;
  }

  const deleteBlockButton = (text, record, index) => {
    if (record.verified && !record.blocked) return <Popconfirm
      title={<span>Block <strong>{record.email}</strong> from receiving emails?</span>} onConfirm={() => toggleBlockEmail(record.key, true)}
      okText="Block"
      okButtonProps={{ danger: true }}
      placement="topLeft"
    >
      <Link
        className="text-danger"
        size="small"
      >
        Block
      </Link>
    </Popconfirm>;

    if (record.primary ||
      record.email === loggedInEmail ||
      record.blocked) return null;

    return <Popconfirm
      title={<span>Delete <strong>{record.email}</strong>?</span>} onConfirm={() => onDeleteEmail(record.key)}
      okText="Delete"
      okButtonProps={{ danger: true }}
      placement="topLeft"
    >
      <Link
        className="text-danger"
        size="small"
      >
        Delete
      </Link>
    </Popconfirm>;
  };

  const columns = useMemo(() => {
    let cols = [];
    if (!editing) {
      // `Primary` or `Blocked`
      cols.push(
        {
          title: 'Primary',
          dataIndex: 'primary',
          key: 'primary',
          render: (text, record) => {
            if (record.blocked) {
              return <Tooltip title={blockedTagTooltip}>
                <Tag color="red" style={{
                  background: 'white',
                  borderStyle: "dashed",
                }}>Blocked</Tag>
              </Tooltip>;
            } else if (record.primary) {
              return <Tooltip title={primaryTagTooltip}>
                <Tag color="blue" style={{
                  background: 'white',
                  borderStyle: "dashed",
                }}>Primary</Tag>
              </Tooltip>;
            }
            return '';
          },
          defaultSortOrder: 'ascend',
          sorter: (a, b) => {
            if (a.primary === b.primary) return 0;
            if (a.primary) return -1;
            if (b.primary) return 1;
          },
        });
    }
    cols.push(
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (text, record) => {
          if (record.primary) return <strong>{text}</strong>;
          return <span>{text}</span>;
        }
      },
      {
        title: 'Verified',
        dataIndex: 'verified',
        key: 'verified',
        render: verifiedEmailColRender,
        defaultSortOrder: 'ascend',
        width: 100,
        align: 'center',
        sorter: (a, b) => {
          if (a.verified && !b.verified) return -1;
          if (!a.verified && b.verified) return 1;
          return 0;
        },
      }
    );
    if (editing) cols.push({
      title: 'Delete',
      key: 'delete',
      render: deleteBlockButton,
      width: 100,
    });
    return cols;
  }, [editing]);

  const formattedList = useMemo(() => {
    if (mailingLists?.length > 0) {
      const listLength = mailingLists.length
      const formattedList = [...mailingLists].map((list, index) => {
        return <span key={list}>{listLength > 1 && listLength !== 2 && index > 0 && ', '}{listLength > 1 && index === listLength - 1 && ' and '}<strong>{list}</strong></span>
      })
      return <>{formattedList} mailing {mailingLists.length > 1 ? 'lists' : 'list'}</>
    }
    return null
  }, [mailingLists])

  const subscriptionMessage = () => {
    if (primaryEmailIsBlocked) return <span className="text-danger">You will not be able to receive emails, until you unblock an email address above.</span>;

    let listMessage = null;
    if (formattedList) {
      listMessage = <>You are subscribed to the {formattedList}.</>
    } else {
      listMessage = <strong className="text-danger">You are not subscribed to any mailing lists.</strong>
    }
    return <>{listMessage} Go to <a href="#mail-prefs">Mailing preferences</a> below to update your mailing list settings.</>
  }
  
  return <>
    <Table
      rowSelection={rowSelection}
      dataSource={values && values.dataSource}
      columns={columns}
      pagination={false}
      showHeader={false}
      size="small"
      className="mb-2"
      title={() => <SeeMore height={56}>
        <p>The <strong className="text-primary">primary</strong> email address is the one that receives emails from the LGBT Bar of NY. Only verified addresses qualify.</p>

        <p><strong className="text-success">Verified</strong> email addresses are those which you have used to log into your account. Any verified email address can be used to log into your account.</p>

        <div>A <strong className="text-danger">blocked</strong> email address could be an email that was unsubscribed from email communications. Blocked addresses will not be able to receive emails. You can only block verified emails.</div>

        {editing && <div className="footnote">You may not <strong className="text-danger">delete</strong> the primary email address or the one you used to log into the current session, but you can <strong className="text-danger">block</strong> it.</div>}
      </SeeMore>}
    />

    {/* add new user email */}
    <Form
      form={form}
      scrollToFirstError
    >
      <Form.Item
        name={dbFields.emails.address}
        label={null}
        rules={[{ type: 'email', message: 'Enter a valid email address.' },]}
        wrapperCol={{ span: 18, offset: 2 }}
      >
        <Search
          enterButton="Add"
          addonBefore="Alternate Email"
          placeholder="user@domain.com"
          onSearch={addEmail}
          loading={addEmailLoading}
          disabled={addEmailLoading}
          allowClear={true}
          prefix={<MailOutlined />}
        />
      </Form.Item>
    </Form>
    <div className="mt-3 mx-4">{subscriptionMessage()}</div>
  </>;
};

export default EmailsAddresses;
