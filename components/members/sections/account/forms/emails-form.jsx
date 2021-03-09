import { useState, useEffect, useMemo, useContext } from 'react';
import { Table, Form, Checkbox, Input, Row, Col, Tag, Tooltip, Typography, Button, Popconfirm } from 'antd';
// data
import { MembersContext } from '../../../../../contexts/members-context';
import { dbFields } from '../../../../../data/members/airtable/airtable-fields';

const { Text, Link } = Typography;
const { Search } = Input;

const EmailsForm = ({
  form,
  loading,
  editing,
}) => {
  const { userEmails, setUserEmails, addEmail, member } = useContext(MembersContext);
  const [addEmailLoading, setAddEmailLoading] = useState(false);

  const primaryEmails = useMemo(() => {
    if (userEmails) {
      return userEmails.reduce((acc, cur) => {
        if (cur.fields.newsletter) acc.push(cur.id);
        return acc;
      }, []);
    }
    return null;
  }, [userEmails]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    setSelectedRowKeys(primaryEmails);
  }, [userEmails]);

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const onSelect = (record) => { // , selected, selectedRows, nativeEvent
    console.log('onSelect record', record, 'id', record.key);
    form.setFieldValue
  };

  const rowSelection = useMemo(() => {
    if (editing) return {
      type: "radio",
      // columnTitle: "Make primary",
      selectedRowKeys,
      onChange: onSelectChange,
      onSelect: onSelect,
      getCheckboxProps: (record) => ({
        disabled: record.newsletter || !record.verified,
      }),
      renderCell: (checked, record, index, originNode) => {
        let label = (record.newsletter) ? 'Primary' : 'Make Primary';
        let boldClass = (record.newsletter) ? 'font-weight-bold' : 'font-weight-normal';
        let primaryColorClass = (!record.newsletter && record.verified) ? 'text-primary' : 'text-muted';
        return <Tooltip title={tooltipTitle}>
          {originNode} <label className={`${boldClass} ${primaryColorClass}`}>{label}</label>
        </Tooltip>;
      },
    };
    return null;
  }, [editing, selectedRowKeys]);

  const verifiedEmailColRender = (text) => text ? <Tooltip title="You have logged into your account using this email address.">
    <Tag style={{
      backgroundColor: 'white',
      borderStyle: 'dashed',
      // borderColor: '#389e0d',
    }} className="text-success">Verified</Tag>
  </Tooltip> : '';

  const deleteButton = (text, record, index) => {
    if (record.newsletter) return '';
    return <Popconfirm
      title={<span>Delete <strong>{record.email}</strong>?</span>} onConfirm={() => console.log('DELETE', record.key)}
      okText="Delete"
      okButtonProps={{
        danger: true,
      }}
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
          title: 'Newsletter',
          dataIndex: 'newsletter',
          key: 'newsletter',
          render: (text, record) => {
            if (record.newsletter) return <Tooltip title={tooltipTitle}>
              <Tag color="blue" style={{
                background: 'white',
                borderStyle: "dashed",
              }}>Primary</Tag>
            </Tooltip>;
            return '';
          },
          defaultSortOrder: 'ascend',
          sorter: (a, b) => {
            if (a.newsletter === b.newsletter) return 0;
            if (a.newsletter) return -1;
            if (b.newsletter) return 1;
          },
        });
    }
    cols.push(
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (text, record) => {
          if (record.newsletter) return <strong>{text}</strong>;
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

  const dataSource = useMemo(() => {
    if (userEmails) {
      return userEmails.map(email => {
        return {
          key: email.id,
          email: email.fields.email,
          verified: email.fields.verified,
          newsletter: email.fields.newsletter,
        };
      });
    }
    return null;
  });

  const saveEmail = async (email) => {
    setAddEmailLoading(true);
    if (email) {
      try {
        await form.validateFields();
        const repeatEmail = userEmails.find(address => address.fields.address === address);
        // console.log('repeatEmail', repeatEmail, 'email', email, )
        if (repeatEmail) {
          form.setFields([{
            name: dbFields.emails.address,
            errors: ['Enter a unique email address.'],
          }]);
        } else {
          const userid = member.id;
          const newEmail = await addEmail({
            email,
            userid,
          });// > setUserEmails
        }
        setAddEmailLoading(false);
      } catch (error) {
        console.log('ERROR', error);
        setAddEmailLoading(false);
      }
    } else {
      form.setFields([{
        name: dbFields.emails.address,
        errors: ['Enter an email.'],
      }]);
      setAddEmailLoading(false);
    }
  };

  const tooltipTitle = 'Primary address will receive emails from the LGBT Bar of NY. Only verified addresses qualify.';

  return <>
    <Table
      rowSelection={rowSelection}
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      showHeader={false}
      size="small"
      className="mb-2"
      title={() => <>
        <p className="mb-0"><strong>Verified</strong> email addresses are those which you have used to log into your account. Any email address can be used to log in.</p>
        <p className="mb-0">The <strong>primary</strong> email address is the one that receives emails from the LGBT Bar of NY. Only verified addresses qualify.</p>
      </>}
    />
    <Form.Item
      name={dbFields.emails.address}
      label={null}
      rules={[{ type: 'email', message: 'Enter a valid email address.' },]}
      wrapperCol={{ span: 16, offset: 4 }}
    >
      <Search
        enterButton="Add"
        addonBefore="@"
        placeholder="user@domain.com"
        onSearch={saveEmail}
        loading={addEmailLoading}
        disabled={addEmailLoading}
      />
    </Form.Item>
  </>;
};

export default EmailsForm;