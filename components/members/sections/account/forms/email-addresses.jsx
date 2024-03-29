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
import {
  Table,
  Form,
  Input,
  Tag,
  Tooltip,
  Typography,
  Popconfirm,
  Radio,
} from 'antd'
import { Breakpoint } from 'react-socks' // , useCurrentBreakpointName
import { MailOutlined, PlusOutlined } from '@ant-design/icons';
import SeeMore from '../../../../elements/see-more';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import { dbFields } from '../../../../../data/members/airtable/airtable-fields';
import { sibFields } from '../../../../../data/emails/sendinblue-fields';
// utils
import {
  createEmail,
  updateEmails,
  deleteEmail,
} from '../../../../../utils/members/airtable/members-db';
import { updateContact } from '../../../../../utils/emails/sendinblue-utils';
import './email-addresses.less'

const { Link } = Typography;
const { Search } = Input;

const EmailAddresses = ({
  onLink,
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

  // console.log('breakpoint', useCurrentBreakpointName());

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
    // console.log('onSelectChange', selectedRowKeys)
    values.setSelectedRowKeys(selectedRowKeys);
  };

  const onSelectPrimary = (record) => {
    // console.log('onSelectPrimary', record)
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
    // check if user session expired
    onLink('check-session')

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

  const loggedInEmail = useMemo(() => {
    if (authUser) {
      return authUser.name;
    }
    return null;
  }, [authUser]);

  /************
   * functions
   ************/

  // can only delete un-verified emails from UI
  const onDeleteEmail = async (key) => {
    const { emailid } = await deleteEmail(key);
    if (emailid) {
      const emails = [...userEmails].reduce((acc, cur) => {
        if (emailid !== cur.id) acc.push(cur);
        return acc;
      }, [])
      setUserEmails(emails);
    }
    onCancel();
  }

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

  const onExpandedMakePrimary = (record) => {
    onSelectChange([record.key])
    onSelectPrimary(record)
  }

  /*******************
   * render functions
   *******************/

  const primeEmailContent = (text, record) => {
    if (record.blocked) {
      return <Tooltip title={blockedTagTooltip}>
        <Tag color="red" style={{
          background: 'white',
          borderStyle: "dashed",
        }}>Blocked</Tag>
      </Tooltip>
    } else if (record.primary) {
      return <Tooltip title={primaryTagTooltip}>
        <Tag color="blue" style={{
          background: 'white',
          borderStyle: "dashed",
        }}>Primary</Tag>
      </Tooltip>
    }
    return ''
  }

  const primeEmailEditContent = (record, radiobutton) => {
    let label = '';
    if (record.verified) {
      label = 'Make Primary'
    } else {
      return null
    }
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
      {radiobutton}&nbsp;&nbsp;<label style={{ fontSize: 12 }} className={`${boldClass} ${colorClass}`}>{label}</label>
    </>;

    return <div className="prime-email-edit-content">
      <Tooltip title={primaryTagTooltip}>
        {labelContent}
      </Tooltip>
    </div>
  }

  // "Make Primary" radio button
  const rowSelection = useMemo(() => {
    if (editing) return {
      type: "radio",
      selectedRowKeys: values.selectedRowKeys,
      onChange: onSelectChange,
      onSelect: onSelectPrimary,
      getCheckboxProps: (record) => ({
        disabled: record.primary || !record.verified || record.blocked,
      }),
      renderCell: (checked, record, index, originNode) => primeEmailEditContent(record, originNode),
      // columnWidth: 200,
    };
    return null;
  }, [editing, values]);

  const verifiedEmailContent = (record) => {
    let tag = null;
    if (record.verified) {
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

  const deleteBlockButton = (record) => {
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
    </Popconfirm>

    if (record.primary ||
      record.email === loggedInEmail ||
      record.blocked) return null

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
    </Popconfirm>
  }

  // expandable row for mobile with desktop table columns hidden on mobile
  const expandedRowRender = (record) => {
    const verified = verifiedEmailContent(record)
    if (editing) {
      let makePrimCheck = null
      if (record.verified) makePrimCheck = <Radio
        disabled={record.blocked || record.primary}
        className="primary-radio"
        defaultChecked={record.primary}
        onChange={() => onExpandedMakePrimary(record)}
      />
      let blockDelete = deleteBlockButton(record)
      return <div className="expanded-row-content">
        {primeEmailEditContent(record, makePrimCheck)}{verified}{blockDelete}
      </div>
    } else {
      return <div className="expanded-row-content">
        {primeEmailContent(null, record)}{verified}
      </div>
    }
    return null
  }

  const columns = useMemo(() => {
    let cols = [];
    if (!editing) {
      // `Primary` or `Blocked`
      cols.push(
        {
          title: 'Primary',
          dataIndex: 'primary',
          key: 'primary',
          render: primeEmailContent,
          defaultSortOrder: 'ascend',
          sorter: (a, b) => {
            if (a.primary === b.primary) return 0;
            if (a.primary) return -1;
            if (b.primary) return 1;
          },
          responsive: ['md'],
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
        render: (text, record) => verifiedEmailContent(record),
        defaultSortOrder: 'ascend',
        width: 100,
        align: 'center',
        sorter: (a, b) => {
          if (a.verified && !b.verified) return -1;
          if (!a.verified && b.verified) return 1;
          return 0;
        },
        responsive: ['md'],
      }
    );
    if (editing) cols.push({
      title: 'Delete',
      key: 'delete',
      render: (text, record, index) => deleteBlockButton(record),
      width: 100,
      responsive: ['md'],
    });
    return cols;
  }, [editing]);

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

  return <div className='email-addresses'>
    <Table
      rowSelection={rowSelection}
      dataSource={values && values.dataSource}
      columns={columns}
      pagination={false}
      showHeader={false}
      size="small"
      className="mb-3"
      title={() => <SeeMore height={56}>
        <p>The <strong className="text-primary">primary</strong> email address is the one that receives emails from the LGBT Bar of NY. Only verified addresses qualify.</p>

        <p><strong className="text-success">Verified</strong> email addresses are those which you have used to log into your account. Any verified email address can be used to log into your account.</p>

        <div>A <strong className="text-danger">blocked</strong> email address could be an email that was unsubscribed from email communications. Blocked addresses will not be able to receive emails. You can only block verified emails.</div>

        {editing && <div className="footnote">You may not <strong className="text-danger">delete</strong> the primary email address or the one you used to log into the current session, but you can <strong className="text-danger">block</strong> it.</div>}
      </SeeMore>}
      expandable={{
        expandedRowRender,
        defaultExpandAllRows: true, // not working
        // indentSize: 0, // not indenting anyway
        // columnWidth: 33, // in styles b/c space added for desktop
      }}
    />

    {/* add new user email */}
    <Form
      form={form}
      scrollToFirstError
    >
      <Form.Item
        id={dbFields.emails.address}
        label={null}
        rules={[{ type: 'email', message: 'Enter a valid email address.' },]}
        wrapperCol={{ sm: { span: 18, offset: 2 } }}
      >
        {/* desktop version */}
        <Breakpoint md up>
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
        </Breakpoint>

        {/* mobile version */}
        <Breakpoint sm down>
          <Search
            enterButton={<PlusOutlined />}
            addonBefore={<Tooltip title="Alternate Email">@</Tooltip>}
            placeholder="alternate"
            onSearch={addEmail}
            loading={addEmailLoading}
            disabled={addEmailLoading}
            allowClear={true}
            prefix={<MailOutlined />}
          />
        </Breakpoint>
      </Form.Item>
    </Form>
    <div className="mt-3 mx-sm-4">{subscriptionMessage()}</div>
  </div>;
};

export default EmailAddresses;
