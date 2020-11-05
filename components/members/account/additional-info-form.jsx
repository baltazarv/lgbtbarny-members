import { Form, Input, Select } from 'antd';
// data
import { AGE_RANGES, ageOptions } from '../../../data/member-values';

const AdditionalInfoForm = ({
  user,
  loading,
  editing,
}) => {

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

  return <>
    {/* age range */}
    <Form.Item
      name="agerange"
      label="Age range"
      labelCol={{
        sm: { span: 9 },
        md: { span: 6 },
      }}
      wrapperCol={{
        sm : (editing ? { span: 7 } : { span: 15 }),
        md : (editing ? { span: 7 } : { span: 18 }),
      }}
    >
      {editing
      ?
        <Select
        placeholder="Choose one..."
        disabled={loading}
      >
        {ageOptions()}
      </Select>
      :
      AGE_RANGES[user.agerange] ? AGE_RANGES[user.agerange].label : ''
      }
    </Form.Item>

    {/* race / ethnicity */}
    <Form.Item
      name="race"
      label="Race/Ethnicity"
      labelCol={{
        sm: { span: 9 },
        md: { span: 6 },
      }}
      wrapperCol={{
        sm :{ span: 15 },
        md: { span: 18 },
      }}
    >
      {editing
        ?
        <Input
          placeholder="Race/Ethnicity"
          disabled={loading}
          />
        :
        user.race
      }
    </Form.Item>

    {/* orientation / gender */}
    <Form.Item
      name="gender"
      label="Sexual Orientation, Gender Identity, and Preferred Pronouns"
      {...longFieldFormat}
    >
      {editing
        ?
        <Input
          placeholder="Sexual Orientation, Gender Identity, and Preferred Pronouns"
          disabled={loading}
          />
        :
        user.gender
      }
    </Form.Item>

    {/* race / ethnicity */}
    <Form.Item
      name="specialaccomm"
      label="Do you require any special accommodations?"
      {...longFieldFormat}
      colon={false}
    >
      {editing
        ?
        <Input
          placeholder="accessibility, ASL"
          disabled={loading}
          />
        :
        user.specialaccomm
      }
    </Form.Item>

    {/* how found LeGaL */}
    <Form.Item
      name="howfound"
      label="How did you find out about LeGaL?"
      {...longFieldFormat}
      colon={false}
    >
      {editing
        ?
        <Input
          disabled={loading}
          />
        :
        user.howfound
      }
    </Form.Item>

  </>
}

export default AdditionalInfoForm;