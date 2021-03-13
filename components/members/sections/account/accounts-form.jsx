import { useState, useMemo } from 'react';
import { Card, Form } from 'antd';
import EditCardButtons from '../../../elements/edit-card-buttons';

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
  loading,
  setLoading,
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

  const onCancel = () => {
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

  const editCardButtons = useMemo(() => {
    if (!editable) return null;
    return <EditCardButtons
      editing={editing}
      toggleEditing={toggleEditing}
      onCancel={onCancel}
      valuesChanged={fieldValuesChanged}
      onSave={onSave}
    />
  }, [editing, fieldValuesChanged]);

  return <>
    <Card
      title={<span>{title}</span>}
      extra={editCardButtons}
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
          loading,
          setLoading,
        })}
      </Form>
    </Card>
  </>;
};

export default AccountsForm;