import { useEffect, useMemo } from 'react';
import { Form, Input, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// data
import { dbFields } from '../../../../data/members/airtable/airtable-fields';
import { gradYearOptions } from '../../../../data/members/airtable/airtable-values';
import * as memberTypes from '../../../../data/members/member-types';

const tailFormItemLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 16, offset: 8 },
};

const MemberFields = ({
  memberType,
  loading,
}) => {

  const nameFields = useMemo(() => {
    return <>
      <Form.Item
        name={dbFields.members.firstName}
        label="First Name"
        rules={[
          {
            required: true,
            message: 'Enter your first name.',
            whitespace: true,
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="First Name"
          disabled={loading}
        />
      </Form.Item>

      <Form.Item
        name={dbFields.members.lastName}
        label="Last Name"
        rules={[
          {
            required: true,
            message: 'Enter your last name.',
            whitespace: true,
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Last Name"
          disabled={loading}
        />
      </Form.Item>
    </>;
  });

  const employmentField = useMemo(() => {
    return <>
      {memberType === memberTypes.USER_ATTORNEY &&
        <Form.Item
          name={dbFields.members.employer}
          label="Employer"
        >
          <Input
            placeholder="Employer - if relevant"
            disabled={loading}
          />
        </Form.Item>
      }
    </>;
  }, [memberType, loading]);

  const studentFields = useMemo(() => {
    let fields = null;
    if (memberType === memberTypes.USER_STUDENT) {
      fields = <>
        <Form.Item
          name={dbFields.members.lawSchool}
          label="Law School"
          rules={[
            {
              required: true,
              message: 'Enter the name of your law school.',
              whitespace: true,
            },
          ]}
        >
          <Input
            placeholder="Law School"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          className="text-left"
          name={dbFields.members.gradYear}
          label="Graduation Year"
          rules={[
            {
              required: true,
              message: 'Enter your year of graduation.',
            },
          ]}
          hasFeedback
        >
          <Select
            style={{ width: '100%' }}
            placeholder="Choose year..."
          >
            {gradYearOptions()}
          </Select>
        </Form.Item>
      </>;
    }
    return fields;
  }, [memberType, gradYearOptions]);

  // TODO: if no payment, show
  const lawNotesButton = () => {
    return <Button>Subscribe to Law Notes</Button>;
  };

  return <>
    {nameFields}
    {employmentField}
    {studentFields}
  </>;
};

export default MemberFields;
