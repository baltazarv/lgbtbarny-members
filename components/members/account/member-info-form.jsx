import { useState, useEffect, useMemo } from 'react';
import { Form, Input, Select, Button, Row, Col, Tooltip, DatePicker, Divider, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import DuesForm from './modals/dues-form';
// data
import * as memberTypes from '../../../data/member-types';
import { CERTIFY_OPTIONS } from '../../../data/member-data';
import { SALARIES, PRACTICE_SETTINGS, practiceOptions } from '../../../data/member-plans';

const { Option } = Select;

const MemberInfoForm = ({
  user,
  userType,
  loading,
  editing,
  setEditing,
}) => {
  const [isAttorney, setIsAttorney] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [studentHasGraduated, setStudentHasGraduated] = useState(false);
  const [salaryModalVisible, setSalaryModalVisible] = useState(false);

  // when cancel & certifystatus not saved
  useEffect(() => {
    if (!editing) {
      if (user.certifystatus) {
        if (user.certifystatus === 'na') {
          setIsAttorney(false);
          setIsStudent(false);
        } else if (user.certifystatus === 'student') {
          setIsAttorney(false);
          setIsStudent(true);
        } else {
          setIsAttorney(true);
          setIsStudent(false);
        }
      }
    }
  }, [editing, user.certifystatus]);

  // when cancel & gradyear not saved
  useEffect(() => {
    if (!editing) {
      if (user.gradyear) {
        if (user.gradyear.year() < new Date().getFullYear()) {
          setStudentHasGraduated(true);
        } else {
          setStudentHasGraduated(false);
        }
      }
    }
  }, [editing, user.gradyear]);

  const onMemberTypeSelect = (value) => {
    if(value === 'na') {
      // alert('You do not qualify for membership.');
      setIsStudent(false);
      setIsAttorney(false);
    } else if (value === 'student') {
      setIsStudent(true);
      setIsAttorney(false);
    } else {
      setIsAttorney(true);
      setIsStudent(false);
    }
  }

  const onGradYearUpdate = (date) => {
    const thisYear = new Date().getFullYear();
    setStudentHasGraduated(date.year() < thisYear);
  }

  /**
   * ATTORNEY CONTENT
   */

  const attorneyContent = useMemo(() => {
    let content = null;
    if (isAttorney) {
      content = <>

        {/* salary */}
        <div class="mt-2">
          <Row justify="space-between">
            <Col>
                <label>
                  <Tooltip title="Membership dues are based on the amount of member salaries">
                    <span style={{ borderBottom: '1px dotted' }}>Salary:</span>
                  </Tooltip>
                </label> {SALARIES[user.salary] && SALARIES[user.salary].label}
            </Col>
            <Col>
              <Button
                type="primary"
                ghost
                size="small"
                onClick={() => setSalaryModalVisible(true)}
              >
                Update salary
              </Button>
            </Col>
          </Row>
        </div>

        {/* employer */}
        <Divider>Employment</Divider>
        <Form.Item
          name="employer"
          label="Employer"
        >
        {editing
          ?
          <Input
            placeholder="Employer - if relevant"
            disabled={loading}
          />
          :
          user.employer
        }
        </Form.Item>

        {/* practice settings */}
        <Form.Item
          name="practicesetting"
          label="In what setting do you practice/work?"
          colon={false}
          className="mt-2"
          labelAlign="center"
          labelCol={{
            xs: { span: 24 },
          }}
          wrapperCol={{
            xs : { span: 24 },
            md : { span: 23 },
            lg : { span: 22 },
          }}
        >
          {editing
          ?
            <Select
            placeholder="Choose one..."
            disabled={loading}
          >
            {practiceOptions()}
          </Select>
          :
          PRACTICE_SETTINGS[user.practicesetting] ? PRACTICE_SETTINGS[user.practicesetting].label : null
          }
        </Form.Item>

        {/* primary area of practice */}
        <Form.Item
          name="practicearea"
          label="Primary practice area(s)"
          className="mt-2"
          labelAlign="center"
          labelCol={{
            xs: { span: 24 },
          }}
          wrapperCol={{
            xs : { span: 24 },
            md : { span: 23 },
            lg : { span: 22 },
          }}
        >
          {editing
          ?
          <Input
            placeholder="Adoption, Criminal, Family Law, Immigration, Marriage/Civil Union, Disability..."
            disabled={loading}
          />
          :
          user.practicearea && user.practicearea
          }
        </Form.Item>

      </>
    }
    return content;
  }, [isAttorney, user, editing]);

  /**
   * STUDENT CONTENT
   */

  const studentContent = useMemo(() => {
    let content = null;
    if (isStudent || isAttorney) {
      content = <>

      {userType !== memberTypes.USER_STUDENT && <Divider>Education</Divider>}

        {/* law school */}
        <Form.Item
          name="school"
          label="Law School"
          labelCol={{
            sm: { span: 9 },
            md: { span: 6 }
          }}
          wrapperCol={{
            sm: { span: 15 },
            md: { span: 18 }
          }}
          rules={[
            {
              required: true,
              message: 'Enter the name of your law school.',
              whitespace: true,
            },
          ]}
        >
          {editing
            ?
            <Input
              placeholder="Law School"
              disabled={loading}
              />
            :
            user.school
          }
        </Form.Item>

        {/* graduation year */}
        <Form.Item
          name="gradyear"
          label="Graduation Year"
          labelCol={{
            sm: { span: 9 },
            md: { span: 6 }
          }}
          wrapperCol={{
            sm: { span: 15 },
            md: { span: 18 }
          }}
          rules={[
            {
              required: true,
              message: 'Enter your year of graduation.',
            },
          ]}
          hasFeedback
        >
          {
            editing
            ?
            <DatePicker
              picker="year"
              bordered={true}
              disabled={loading}
              allowClear={false}
              onChange={onGradYearUpdate}
            />
            :
            user.gradyear && user.gradyear.year()
          }
        </Form.Item>

        {/* upgrade button */}
        {(
          (userType === memberTypes.USER_NON_MEMBER && isAttorney) || (userType === memberTypes.USER_STUDENT && studentHasGraduated))
          && <Row>
            <Col
              sm={{ offset: 6 }}
            >
              <div className="my-2 text-danger">Since you are no longer a student, please upgrade your membership to an Attorney Membership:</div>
              <Button type="primary" onClick={() => alert('Pay for membership....')}>Upgrade membership...</Button>
            </Col>
          </Row>
        }
      </>
    }
    return content;
  }, [userType, user, editing, isAttorney, isStudent, studentHasGraduated]);

  /**
   * NON-MEMBER CONTENT
   */

  const nonMemberContent = useMemo(() => {
    let content = null;
    if (userType === memberTypes.USER_NON_MEMBER) {
      if (isAttorney) content = <>
        <Button type="primary" onClick={() => alert('Certify you are a lawyer > payment')}>Become an attorney member</Button>
      </>
      if (isStudent) content = <>
        <Button type="primary" onClick={() => alert('Certify you are a lawyer > payment')}>Become a law student member</Button>
      </>
    }
    return content;
  }, [userType, user, editing, isStudent, isAttorney]);

  return <>

  {editing
    ?
      <Form.Item
        name="certifystatus"
        label="Current Status"
      >
        <Select
          style={{ width: '100%' }}
          placeholder="Choose one..."
          autoFocus
          suffixIcon={<UserOutlined/>}
          disabled={loading}
          onChange={onMemberTypeSelect}
        >
          <Option value="bar">{CERTIFY_OPTIONS.bar}</Option>
          <Option value="graduate">{CERTIFY_OPTIONS.graduate}</Option>
          <Option value="retired">{CERTIFY_OPTIONS.retired}</Option>
          <Option value="student">{CERTIFY_OPTIONS.student}</Option>
          <Option value="na">{CERTIFY_OPTIONS.na}</Option>
        </Select>
      </Form.Item>
    :
      <Row className="ant-form-item">
        <Col
          xs={{ span: 24 }}
          sm={{ span: 6 }}
          md={{ span: 6 }}
        ><label>Current Status:</label></Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 16 }}
          md={{ span: 16 }}
        >{CERTIFY_OPTIONS[user && user.certifystatus]}</Col>
      </Row>
    }
    {attorneyContent}
    {studentContent}
    <Row className="mt-2">
      <Col sm={{ offset: 6 }}>{nonMemberContent}</Col>
    </Row>

    <Modal
      title="Update Salary"
      visible={salaryModalVisible}
      okText="Update Renewal Charge"
      onOk={() => setSalaryModalVisible(false)}
      onCancel={() => setSalaryModalVisible(false)}
    >
      <DuesForm user={user} />
    </Modal>
  </>
}

export default MemberInfoForm;