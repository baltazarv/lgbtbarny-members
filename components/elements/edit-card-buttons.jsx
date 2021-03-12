import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const EditCardButtons = ({
  editing,
  onCancel,
  onSave,
  valuesChanged,
  toggleEditing,
}) => {
    // submit button
    if (editing) {
      return <>
        <Button
          style={{ marginRight: '8px' }}
          size="small"
          onClick={() => onCancel()}
        >
          Cancel
        </Button>
        <Button
          size="small"
          type="primary"
          disabled={!valuesChanged}
          onClick={onSave}
        >
          Save
        </Button>
      </>;
    }

    // edit button
    return <Button size="small" onClick={() => toggleEditing()}>Edit<EditOutlined style={{ verticalAlign: '0.17em' }} /></Button>;
}

export default EditCardButtons;