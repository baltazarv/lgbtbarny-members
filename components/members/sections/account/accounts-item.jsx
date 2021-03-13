import { useState, useMemo } from 'react';
import { Card } from "antd";
import EditCardButtons from '../../../elements/edit-card-buttons';

const AccountsItem = ({
  title,
  loading,
  render,
  values,
  changeValues,
  resetValues,
}) => {
  const [editing, setEditing] = useState(false);
  const [fieldValuesChanged, setFieldValuesChanged] = useState(false);
  const [updateValues, setUpdateValues] = useState(null);

  const toggleEditing = () => {
    setEditing(prev => !prev);
  };

  const selectChanges = (fields) => {
    setUpdateValues(fields);
    setFieldValuesChanged(true);
  }

  const onCancel = () => {
    resetValues();
    setEditing(false);
    setFieldValuesChanged(false);
  }

  const onSave = async () => {
    await changeValues(updateValues);
    setEditing(false);
    setFieldValuesChanged(false);
  }

  const editCardButtons = useMemo(() => {
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
      title={title}
      extra={editCardButtons}
      style={{ maxWidth: 600 }}
    >
      {render({
        loading,
        editing,
        values,
        selectChanges,
        onCancel,
      })}
    </Card>
  </>
}

export default AccountsItem;