import { useContext } from 'react';
import { Form, Input, Select } from 'antd';
// data
import { dbFields } from '../../../../../data/members/airtable/airtable-fields';
import { MembersContext } from '../../../../../contexts/members-context';
import { ageOptions, sexGenderOptions } from '../../../../../data/members/airtable/airtable-values';

const AdditionalInfoForm = ({
  longFieldFormat,
  loading,
  editing,
}) => {
  const { member } = useContext(MembersContext);

  return <>
    {/* age range */}
    <Form.Item
      name={dbFields.members.ageRange}
      label="Age range"
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
        member.fields ? member.fields[dbFields.members.ageRange] : ''
      }
    </Form.Item>

    {/* race / ethnicity */}
    <Form.Item
      name={dbFields.members.race}
      label="Race/Ethnicity"
    >
      {editing
        ?
        <Input
          placeholder="Race/Ethnicity"
          disabled={loading}
          />
        :
        member.fields && member.fields[dbFields.members.race]
      }
    </Form.Item>

    {/* orientation / gender */}
    <Form.Item
      name={dbFields.members.sexGender}
      label="Sexual Orientation, Gender Identity, and Preferred Pronouns"
    >
      {editing
        ?
        <Select
          placeholder="Choose one..."
          disabled={loading}
          mode='multiple'
        >
          {sexGenderOptions()}
        </Select>
        :
        member.fields && member.fields[dbFields.members.sexGender] && member.fields[dbFields.members.sexGender].join(', ')
      }
    </Form.Item>

    {/* race / ethnicity */}
    <Form.Item
      name={dbFields.members.specialAccom}
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
        member.fields && member.fields[dbFields.members.specialAccom]
      }
    </Form.Item>

    {/* how found LeGaL */}
    <Form.Item
      name={dbFields.members.howFound}
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
        member.fields && member.fields[dbFields.members.howFound]
      }
    </Form.Item>

  </>;
};

export default AdditionalInfoForm;