import { useMemo, useEffect } from 'react';
import { Button, Divider, Tooltip, Typography } from 'antd';
import PdfTable from '../../pdf-table';
import SvgIcon from '../../utils/svg-icon';
// data
import * as memberTypes from '../../../data/member-types';

const { Link } = Typography;

const CleIcon = () =>
  <span role="img" aria-label="See CLE certificate" className="anticon">
    <SvgIcon
      name="ribbon"
      width="1.6em"
      height="1.6em"
      fill="currentColor"
    />
  </span>

const CleCurrent = ({
  data,
  memberType,
  previewUser,
  onLink,
}) => {

  const dataTransformed = useMemo(() => {
    let _dataTransformed = [...data].map(row => {
      if (
        memberType !== memberTypes.USER_ATTORNEY &&
        memberType !== memberTypes.USER_STUDENT
      ) {
        // excerpt
        if (!row.sample) {
          row.excerpt = true;
        }

        // url
        if (row.urlsample) row.url = row.urlsample;
      }
      return row;
    });
    return _dataTransformed;
  }, [data]);

  const introText = useMemo(() => {
    let text = null;
    const whatYouGetTxt = <p>See the below course material exerpts, which include topics, agenda, and speaker bios for all course. And the entire <Link onClick={() => onLink('clecurrent')}><em>Year in Review</em></Link> edition is also made available:</p>
    if (memberType === memberTypes.USER_ANON) {
      if (previewUser === memberTypes.USER_NON_MEMBER) {
        text = <>
          <p>If you are not an attorney you can still register for CLE courses. When you <Link onClick={() => onLink(memberTypes.SIGNUP_NON_MEMBER)}>sign up</Link> you get access to CLE certificates for courses, which you have attended.</p>
          {whatYouGetTxt}
        </>
      } else {
        text = <>
          <p>{previewUser === memberTypes.USER_ATTORNEY &&
              <Link onClick={() => onLink(memberTypes.SIGNUP_ATTORNEY)}>Become an attorney member</Link>
            }{previewUser === memberTypes.USER_STUDENT &&
              <Link onClick={() => onLink(memberTypes.SIGNUP_STUDENT)}>Become a law student member</Link>
            } to get access to all CLE materials, current materials, as well as the archive.&nbsp;
          {previewUser === memberTypes.USER_ATTORNEY &&
            <span>When you sign up, you will be able to download CLE certificates for courses which you have attended.</span>
          }</p>
          {whatYouGetTxt}
        </>;
      }
    } else if (memberType === memberTypes.USER_NON_MEMBER) {
      text = <>
        <p>
          If you are an attorney, <Link onClick={() => onLink(memberTypes.SIGNUP_MEMBER)}>become a member</Link> to get access to all CLE materials, current materials as well as the archive.
        </p>
      </>
    } else {
      text = <>
      <p>Read course material for any CLE.</p>
      {memberType === memberTypes.USER_ATTORNEY &&
        <p>
          Courses with <CleIcon /> icon are ones which you have attended. Click the icon to view and download your certificate.
        </p>
      }</>;
    };
    return text;
  }, [memberType, previewUser]);

  const customCols = useMemo(() => {
    const certCol = {
      key: 'cert',
      title: 'Cert',
      // className: 'col-icon',
      render: (text, record) => {
        let output = null;
        if (record.attended) output = <Tooltip title="open certificate">
          <Button
            onClick={() => onLink('clecerts')}
            type="link"
            icon={<CleIcon />}
          />
        </Tooltip>;
        return output;
      },
      search: false,
    };
    const defaultCols = [
      {
        key: 'title',
        title: 'Title',
        width: '90%',
        style: { fontStyle: 'italic' },
        linkToPDF: true, // when not locked
      },
      {
        key: 'date',
        title: 'Date',
        style: { fontWeight: 'bold' },
        width: '10%',
      },
    ];
    if (memberType === memberTypes.USER_ATTORNEY) return [certCol, ...defaultCols];
    return [...defaultCols];
  }, [dataTransformed]);

  const expandableContent = useMemo(() => {
    return {
      expandedRowRender: (record) => {
        let credits = null;
        let agenda = null;
        if (record.credits) {
          const getLabel = (number) => {
            let singPlural = 'CLE Credit';
            if (number > 1) singPlural = 'CLE Credits';
            return <strong>{number.toFixed(1)} {singPlural}</strong>
          }
          if (record.credits.length) {
            credits = <ul>
              {
                record.credits.map((item) => <li>{getLabel(item.number)} {item.type}</li>)
              }
            </ul>
          }
        }
        if (record.agenda) agenda = <div>{record.agenda}</div>
        return <div>
          {agenda}
          {credits && agenda && <Divider
            dashed={true}
            className="my-2"
            />}
          {credits}
        </div>
      },
      rowExpandable: (record) => record.credits || record.agenda,
      // expandRowByClick: true,
      // indentSize: 40,
    }
  });

  return <div className="law-notes law-notes-archive">
    {introText}
    <PdfTable
      data={dataTransformed}
      memberType={memberType}
      expandable={expandableContent}
      customCols={customCols}
    />
  </div>
}

export default CleCurrent;
