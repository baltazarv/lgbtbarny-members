import { useMemo, useContext } from 'react';
import { Form, Row, Col, Select } from 'antd';

// data
import { MembersContext } from '../../contexts/members-context';
import { dbFields } from '../../data/members/airtable/airtable-fields';
import { getSalaryOptions } from '../../utils/members/airtable/airtable-select-options';

const SalaryField = ({
  is1stTimeEligible = false,
  loading
}) => {
  const { memberPlans } = useContext(MembersContext);

  const onFieldChange = (field, value) => {
    // console.log('onFieldChange field', field, 'val', value);
  };

  const salaryOptions = useMemo(() => {
    if (memberPlans) return getSalaryOptions(memberPlans);
    return null;
  }, [memberPlans]);

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
            onChange={onFieldChange}
          >
            {salaryOptions}
          </Select>
        </Form.Item>

        {/* only shown on logged-in signup, not on renew page yet */}
        {is1stTimeEligible() &&
          <Row className="mb-2">
            <Col
              xs={{ span: 24, offset: 0 }}
              sm={{ span: 16, offset: 8 }}
            >
              50% discount for first-time membership!
            </Col>
          </Row>
        }
      </>;
    }
    return salary;
  }, [salaryOptions, is1stTimeEligible, loading]);

  return <>
    {salaryField}
  </>;
};

export default SalaryField;