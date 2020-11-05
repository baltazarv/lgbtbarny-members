import { Form, Checkbox } from 'antd';
// values
import { SIGNUP_FIELDS } from '../../../data/member-form-names';

const LawNotesField = ({
  onChange,
}) => {
  const handleCheckedChange = (value) => {
    onChange(SIGNUP_FIELDS.lawNotes, value.target.checked);
  };

  return <>
    <Form.Item
      name={SIGNUP_FIELDS.lawNotes}
      valuePropName="checked"
      wrapperCol={{
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      }}
      style={{ textAlign: 'left' }}
    >
      <Checkbox
        checked={true}
        onChange={handleCheckedChange}
      >Subscribe to <span className="font-italic">Law Notes.</span></Checkbox>
    </Form.Item>
  </>;
};

export default LawNotesField;
