import { useState, useEffect, useMemo } from 'react';
import { Form, Input, Select, Button, Row, Col, Tooltip, DatePicker } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// data
import * as memberTypes from '../../../data/member-types';
import { CERTIFY_OPTIONS } from '../../../data/member-data';
import { SALARIES, PRACTICE_SETTINGS, practiceOptions } from '../../../data/member-plans';

const { Option } = Select;

const MembershipForm = ({
  user,
  userType,
  loading,
  editing,
  setEditing,
  labelCol,
  wrapperCol,
}) => {
  const [isAttorney, setIsAttorney] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [studentHasGraduated, setStudentHasGraduated] = useState(false);

  // const studentMutedClass = () => (isAttorney || studentHasGraduated) ? 'text-muted' : '';

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

  const onUpdateSalary = () => {
    alert('Update subsciription fee...');
    setEditing(false);
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
    if (userType === memberTypes.USER_ATTORNEY) {
      content = <>
        {/* employer */}
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

        {/* salary */}
        <Row>
          <Col
            {...labelCol} // xs:{ 24 }, sm:{ 6 }, md:{ 6 }
          >
            <Tooltip title="Membership dues are based on the amount of member salaries"><label><span style={{ borderBottom: '1px dotted' }}>Salary</span></label></Tooltip>
          </Col>
          <Col
            xs={{ span: 14 }}
            sm={{ span: 18 }}
            md={{ span: 10 }}
          >
            {SALARIES[user.salary].label}
          </Col>
          <Col
            xs={{ span: 10 }}
            sm={{ span: 24 }}
            md={{ span: 7 }}
            lg={{ span: 6 }}
            style={{ textAlign: 'right' }}
          >
            <Button
              type="primary"
              size="small"
              ghost
              onClick={() => onUpdateSalary()}
            >Update salary...</Button>
          </Col>
        </Row>

        {/* practice settings */}
        <Form.Item
          name="practicesetting"
          label="In what setting do you practice/work?"
          className="mt-3"
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
          label="Please list your primary area(s) of practice"
          className="mt-3"
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
            placeholder="Practice Area(s)"
            disabled={loading}
          />
          :
          user.practicearea && user.practicearea
          }
        </Form.Item>

        {/* special accommodations */}
        <Form.Item
          name="accomod"
          label="Please list your primary area(s) of practice"
          className="mt-3"
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
            placeholder="Practice Area(s)"
            disabled={loading}
          />
          :
          user.practicearea && user.practicearea
          }
        </Form.Item>

      </>
    }
    return content;
  }, [userType, user, editing]);

  /**
   * STUDENT CONTENT
   */

  const studentContent = useMemo(() => {
    let content = null;
    if (userType === memberTypes.USER_STUDENT) {
      content = <>

        {/* law school */}
        <Form.Item
          name="school"
          label="Law School"

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
        {(isAttorney || studentHasGraduated) &&
          <Row>
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
        <Col {...labelCol}><label>Current Status</label></Col>
        <Col {...wrapperCol}>{CERTIFY_OPTIONS[user && user.certifystatus]}</Col>
      </Row>
    }
    {attorneyContent}
    {studentContent}
    <Row className="mt-2">
      <Col sm={{ offset: 6 }}>{nonMemberContent}</Col>
    </Row>
  </>
}

export default MembershipForm;