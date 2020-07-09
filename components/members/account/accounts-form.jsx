import { useEffect, useState, useMemo } from 'react';
import { Card, Form, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
// import SvgIcon from '../../utils/svg-icon';

// const MenuIcon = ({
//   name,
//   ariaLabel,
//   fill='currentColor'
// }) =>
//   <span role="img" aria-label={ariaLabel} className="anticon">
//     <SvgIcon
//       name={name}
//       width="1.6em"
//       height="1.6em"
//       fill={fill} // "#008cdb"
//     />
//   </span>

const AccountsForm = ({
  // loading,
  name,
  title,
  form,
  user,
  setUser,
  editing,
  setEditing,
  children,
  labelCol={
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 }
  },
  wrapperCol={
    xs: { span: 24 },
    sm: { span: 22 },
    md: { span: 20 }
  },
}) => {
  // enable submit button
  const [fieldValuesChanged, setFieldValuesChanged] = useState(false);

  useEffect(() => {
    if (user) {
      populateFields();
    }
  }, [user, editing]);

  const populateFields = () => {
    const fields = form.getFieldsValue();
    for (const key in fields) {
      if (user[key]) {
        form.setFieldsValue({ [key]: user[key] })
      }
    }
  };

  const onFieldsChange = (changedFields, allFields) => {
    // console.log('onFieldsChange', changedFields, allFields);
  };

  const onValuesChange = (changedFields, allFields) => {
    // console.log('onValuesChange', changedFields, allFields);
    setFieldValuesChanged(true);
  };

  const toggleEditing = () => {
    setEditing(prev => !prev)
  };

  const resetFields = () => {
    populateFields();
    setEditing(false);
    setFieldValuesChanged(false);
  };

  const onSubmit = () => {
    const fields = form.getFieldsValue();
    let _user = {};
    for(const key in fields) {
      // if property not on user object add it anyway
      _user[key] = form.getFieldValue(key);
      setUser({ type: 'update', value: _user});
    };
    setEditing(false);
    setFieldValuesChanged(false);
    form.submit();
  };

  const formButtons = useMemo(() => {
    // submit button
    if (editing) {
      return <>
        <Button
          style={{ marginRight: '8px' }}
          size="small"
          onClick={() => resetFields()}
        >
          Cancel
        </Button>
        <Button
          size="small"
          type="primary"
          disabled={!fieldValuesChanged}
          onClick={onSubmit}
        >
          Save
        </Button>
      </>
    }

    // edit button
    return <Button size="small" onClick={() => toggleEditing()}>Edit<EditOutlined style={{ verticalAlign: '0.17em' }} /></Button>
  }, [editing, fieldValuesChanged]);

  return <>
    <Card
      title={<span>{title}</span>}
      extra={formButtons}
      style={{ maxWidth: 600 }}
    >
      {/* <MenuIcon name="customer-profile" ariaLabel="Profile" />  */}
      <Form
        labelCol={labelCol}
        wrapperCol={wrapperCol}
        name={name}
        form={form}
        colon={false}
        hideRequiredMark={true}
        layout="horizontal"
        scrollToFirstError
        onFieldsChange={onFieldsChange}
        onValuesChange={onValuesChange}
      >
        {children}
      </Form>
    </Card>
  </>
}

export default AccountsForm;