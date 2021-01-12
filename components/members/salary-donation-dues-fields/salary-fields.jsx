// DuesForm < DuesWrapper < SalaryFields
import { useState, useMemo } from 'react';
import { Form, Row, Col, Select } from 'antd';
// data
import { dbFields } from '../../../data/members/database/airtable-fields';

const tailFormItemLayout = {
  xs: { span: 24, offset: 0 },
  sm: { span: 16, offset: 8 },
};

const SalaryFields = ({
  salaryOptions,
  hasDiscount,
  onChange,
}) => {
  const [loading, setLoading] = useState(false);

  // create account fields
  const salaryField = useMemo(() => {
    let salary = null;
    if (salaryOptions) {
      salary = <>
        <Form.Item
          className="text-left"
          name={dbFields.members.salary}
          label="Salary Range"
          rules={[
            {
              required: true,
              message: 'Enter your salary to calculate fee.',
            },
          ]}
          hasFeedback
        >
          <Select
            placeholder="Choose salary to calculate fee..."
            disabled={loading}
            onChange={(val) => onChange(dbFields.members.salary, val)}
          >
            {salaryOptions}
          </Select>
        </Form.Item>

        {hasDiscount &&
          <Row className="mb-2">
            <Col {...tailFormItemLayout}>
              50% discount for first-time membership!
            </Col>
          </Row>
        }
      </>;
    }
    return salary;
  }, [salaryOptions]);

  return <>
    {salaryField}
  </>;
};

export default SalaryFields;