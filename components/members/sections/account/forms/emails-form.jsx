// TODO: rename emails-table or email-addresses
/**
 * Intermediary `AccountItem` with render props between this component and `Accounts` component.
 *
 * Primary email switch handled by grand-parent component Account.
 * * `dataSource`, `selectedRowKeys`, and `setSelectedRowKeysprop` inside `value` prop sent by Account.
 * * `selectChanges` also managed by parent.
 *
 * * Deleting emails handled within this component by`onDeleteEmail`.
 *
 * Saving a new email handled within this component by `saveEmail`. The form surrounding the `Search` input is the only form on this component.
 */
import { useState, useMemo, useContext } from 'react';
import { Table, Form, Input, Tag, Tooltip, Typography, Popconfirm } from 'antd';
import { MailOutlined } from '@ant-design/icons';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import { dbFields } from '../../../../../data/members/airtable/airtable-fields';

const { Link } = Typography;
const { Search } = Input;

const EmailsForm = ({
  loading,
  editing,

  // primary email
  values,

  selectChanges,
  // delete email
  onCancel,
}) => {
  const { userEmails, createEmail, deleteEmail, member, authUser } = useContext(MembersContext);
  const [form] = Form.useForm(); // save email form
  const [addEmailLoading, setAddEmailLoading] = useState(false);

  /**
   * Update primary email
   */

  const onSelectChange = (selectedRowKeys) => {
    values.setSelectedRowKeys(selectedRowKeys);
  };

  const onSelectPrimary = (record) => {
    selectChanges(record);
  };

  /**
   * Save new email
   */

  const saveEmail = async (emailAddress) => {
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
          const newEmail = await createEmail({
            emailAddress,
            userid,
          });// > setUserEmails
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
    await deleteEmail(key);
    onCancel();
  }

  const rowSelection = useMemo(() => {
    if (editing) return {
      type: "radio",
      // columnTitle: "Make primary",
      selectedRowKeys: values.selectedRowKeys,
      onChange: onSelectChange,
      onSelect: onSelectPrimary,
      getCheckboxProps: (record) => ({
        disabled: record.primary || !record.verified,
      }),
      renderCell: (checked, record, index, originNode) => {
        let label = (record.primary) ? 'Primary' : (record.verified) ? 'Make Primary' : '';
        let boldClass = (record.primary) ? 'font-weight-bold' : 'font-weight-normal';
        let primaryColorClass = (!record.primary && record.verified) ? 'text-primary' : 'text-muted';
        return <Tooltip title={tooltipTitle}>
          {originNode} <label style={{ fontSize: 12 }} className={`${boldClass} ${primaryColorClass}`}>{label}</label>
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

  const deleteButton = (text, record, index) => {
    if (record.primary || record.email === loggedInEmail) return '';
    return <Popconfirm
      title={<span>Delete <strong>{record.email}</strong>?</span>} onConfirm={() => onDeleteEmail(record.key)}
      okText="Delete"
      okButtonProps={{ danger: true }}
      placement="topLeft"
    >
      <Link
        className="text-danger"
        size="small"
      // onClick={() => console.log('DELETE', record.key)}
      >
        Delete
    </Link>
    </Popconfirm>;
  };

  const columns = useMemo(() => {
    let cols = [];
    if (!editing) {
      cols.push(
        {
          title: 'Primary',
          dataIndex: 'primary',
          key: 'primary',
          render: (text, record) => {
            if (record.primary) return <Tooltip title={tooltipTitle}>
              <Tag color="blue" style={{
                background: 'white',
                borderStyle: "dashed",
              }}>Primary</Tag>
            </Tooltip>;
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
      render: deleteButton,
      width: 100,
    });
    return cols;
  }, [editing]);

  const tooltipTitle = 'Primary address will receive emails from the LGBT Bar of NY. Only verified addresses qualify.';

  return <>
    <Table
      rowSelection={rowSelection}
      dataSource={values && values.dataSource}
      columns={columns}
      pagination={false}
      showHeader={false}
      size="small"
      className="mb-2"
      title={() => <>
        <p>The <strong className="text-primary">primary</strong> email address is the one that receives emails from the LGBT Bar of NY. Only verified addresses qualify.</p>
        <p><strong className="text-success">Verified</strong> email addresses are those which you have used to log into your account. Any verified email address can be used to log into your account.</p>
        {editing && <p>You may not <strong className="text-danger">delete</strong> the primary email address or the one you used to log you into the current session.</p>}
      </>}
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
          onSearch={saveEmail}
          loading={addEmailLoading}
          disabled={addEmailLoading}
          allowClear={true}
          prefix={<MailOutlined />}
        />
      </Form.Item>
    </Form>
  </>;
};

export default EmailsForm;