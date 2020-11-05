import { useState, useMemo } from 'react';
import { Form, Row, Col, Select } from 'antd';
// values
import { SIGNUP_FIELDS } from '../../../data/member-form-names';

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
          name={SIGNUP_FIELDS.salary}
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
            onChange={(val) => onChange(SIGNUP_FIELDS.salary, val)}
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