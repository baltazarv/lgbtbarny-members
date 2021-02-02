import { useState, useMemo, useEffect } from 'react';
import { Card, Form, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const longFieldFormat = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs :{ span: 24 },
    sm: { span: 24 },
  }
};

const AccountsForm = ({
  name, // form name
  title,
  initialValues,
  editable=true,
  memberType,
  onLink,
  render,
}) => {
  const [form] = Form.useForm();
  // enable submit button
  const [fieldValuesChanged, setFieldValuesChanged] = useState(false);
  const [editing, setEditing] = useState(false);

  const onFieldsChange = (changedFields, allFields) => {
    // console.log('onFieldsChange', changedFields, allFields);
  };

  const onValuesChange = (changedFields, allFields) => {
    // console.log('onValuesChange', changedFields, allFields);
    setFieldValuesChanged(true);
  };

  const toggleEditing = () => {
    setEditing(prev => !prev);
  };

  const cancel = () => {
    form.resetFields();
    setEditing(false);
    setFieldValuesChanged(false);
  };

  const onSave = () => {
    const formErrors = form.getFieldsError().reduce((acc, cur) => {
      return acc.concat(cur.errors);
    }, []);
    if (formErrors.length === 0) {
      setEditing(false);
      setFieldValuesChanged(false);
      form.submit();
      return true;
    }
    return false; // errors in validation
  };

  const formButtons = useMemo(() => {
    if (!editable) return null;
    // submit button
    if (editing) {
      return <>
        <Button
          style={{ marginRight: '8px' }}
          size="small"
          onClick={() => cancel()}
        >
          Cancel
        </Button>
        <Button
          size="small"
          type="primary"
          disabled={!fieldValuesChanged}
          onClick={onSave}
        >
          Save
        </Button>
      </>;
    }

    // edit button
    return <Button size="small" onClick={() => toggleEditing()}>Edit<EditOutlined style={{ verticalAlign: '0.17em' }} /></Button>;
  }, [editing, fieldValuesChanged]);

  return <>
    <Card
      title={<span>{title}</span>}
      extra={formButtons}
      style={{ maxWidth: 600 }}
    >
      <Form
        name={name}
        form={form}
        layout="horizontal"
        scrollToFirstError
        onFieldsChange={onFieldsChange}
        onValuesChange={onValuesChange}
        initialValues={initialValues}
      >
        {render({
          name,
          title,
          form,
          memberType,
          longFieldFormat, // for fields with label above
          onLink,
          editing,
          setEditing,
        })}
      </Form>
    </Card>
  </>;
};

export default AccountsForm;