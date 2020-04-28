import { useState, useEffect } from 'react';
import { Button } from "antd";
import { Container, Row, Col, Navbar, Nav, NavDropdown } from "react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css';
import './main-header.less';

const onGetLegalHelpClick = (evt) => {
  event
  alert('Legal help info...')
}

const navItemsData = {
  legalhelpinfo: {
    title: 'GET LEGAL HELP',
    onClick: onGetLegalHelpClick
  },
  donate: {
    title: 'DONATE',
    href: 'https://www.lgbtbarny.org/donate',
  },
  about: {
    title: 'ABOUT',
    subitems: {
      us: {
        title: 'About Us',
        href: 'https://www.lgbtbarny.org/about',
      },
      staff: {
        title: 'Staff & Board',
        href: 'https://www.lgbtbarny.org/staff-board',
      },
      committees: {
        title: 'Committees & Sections',
        href: 'https://www.lgbtbarny.org/committees-sections',
      },
      dinner: {
        title: 'Annual Dinner',
        href: 'https://www.lgbtbarny.org/annual-dinner',
      },
      report: {
        title: 'Annual Report',
        href: 'https://www.lgbtbarny.org/annual-reports',
      },
      events: {
        title: 'Events',
        href: 'https://www.lgbtbarny.org/events-calendar',
      },
      photos: {
        title: 'Photo Albums',
        href: 'https://www.lgbtbarny.org/photos',
      },
      blog: {
        title: 'Blog',
        href: 'https://www.lgbtbarny.org/news-blog',
      },
    }
  },
  what: {
    title: 'WHAT WE DO',
    subitems: {
      legal: {
        title: 'Legal Services',
        href: 'https://www.lgbtbarny.org/legal-services',
      },
      policy: {
        title: 'Policy Advocacy',
        href: 'https://www.lgbtbarny.org/policy-advocacy',
      },
      cle: {
        title: 'CLE Center',
        href: 'https://www.lgbtbarny.org/cle-center',
      },
      lawnotes: {
        title: 'LGBT Law Notes',
        href: 'https://www.lgbtbarny.org/law-notes',
      },
      podcast: {
        title: 'LeGaL Podcast',
        href: 'https://www.lgbtbarny.org/podcast',
      },
    }
  },
  members: {
    title: 'MEMBERSHIP',
    subitems: {
      join: {
        title: 'Join/Renew',
        href: 'https://www.lgbtbarny.org/membership-plans',
      },
      dashboard: {
        title: 'Members Dashboard',
        href: '#',
      },
    }
  },
  students: {
    title: 'LAW STUDENTS',
    subitems: {
      fellowship: {
        title: 'Judicial Fellowship',
        href: 'https://www.lgbtbarny.org/hank-henry',
      },
      mentoring: {
        title: 'Mentoring Program',
        href: 'https://www.lgbtbarny.org/mentoring',
      },
      careerfair: {
        title: 'Career Fair',
        href: 'https://www.lgbtbarny.org/career-fair',
      },
      internship: {
        title: 'Internship Program',
        href: 'https://www.lgbtbarny.org/internship-program',
      },
    }
  },
  info: {
    title: 'LEGAL HELP',
    subitems: {
      clinics: {
        title: 'Clinics Information',
        href: 'https://www.lgbtbarny.org/clinics-information',
      },
      lawyer: {
        title: 'Find a Lawyer',
        href: 'https://www.lgbtbarny.org/find-a-lawyer',
      },
      legalhelp: {
        title: 'Get Legal Help',
        href: 'https://www.lgbtbarny.org/get-legal-help',
      },
    }
  },
  participate: {
    title: 'GET INVOLVED',
    subitems: {
      ways: {
        title: 'Ways to Participate',
        href: 'https://www.lgbtbarny.org/get-involved',
      },
      referrals: {
        title: 'Referral Network',
        href: 'https://www.lgbtbarny.org/lrn-pbp',
      },
      youth: {
        title: 'Youth Qlinic',
        href: 'https://www.lgbtbarny.org/youthqlinic',
      },
      tnc: {
        title: 'Manhattan Clinic',
        href: 'https://www.lgbtbarny.org/manhattan-clinic-registration',
      },
      leadership: {
        title: 'Leadership Council',
        href: 'https://www.lgbtbarny.org/leadership-council',
      },
      elections: {
        title: 'Board Elections',
        href: 'https://www.lgbtbarny.org/board-elections',
      },
      donate: {
        title: 'Donate',
        href: 'https://www.lgbtbarny.org/donate',
      },
      give: {
        title: 'Ways to Give',
        href: 'https://www.lgbtbarny.org/ways-to-give',
      },
    }
  },
}

const MainHeader = () => {

  const [navItems, setNavItems] = useState(null);
  const [activeItem, setActiveItem] = useState(['members', 'dashboard']);

  useEffect(() => {
    const getArrayFromObject = (obj) => {
      let items = [];
      for (const key in obj) {
        const newObject = Object.assign({}, obj[key], {key});
        items.push(newObject);
      }
      return items;
    }

    const _navItems = getArrayFromObject(navItemsData).map(item => {
      if (!item.subitems) {
        let options = {};
        if (item.href) options['href'] = item.href;
        if (item.onClick) options['onClick'] = item.onClick;
        return <Nav.Link
          id={item.key}
          key={item.key}
          {...options}
          className={item.key}
        >
          {item.title}
        </Nav.Link>
      }
      return <NavDropdown
        title={item.title}
        id={item.key}
        key={item.key}
        className={item.key === activeItem[0] ? 'active' : ''}
      >
        {
          item.subitems &&
            getArrayFromObject(item.subitems).map((subitem) => <NavDropdown.Item
              href={subitem.href} className={subitem.key === activeItem[1] ? 'active' : ''}
              key={subitem.key}
            >
            {subitem.title}
          </NavDropdown.Item>)
        }
      </NavDropdown>
    })
    setNavItems(_navItems);
  }, [navItemsData])

  return (
    <>
      <Navbar
        className="main-header"
        expand="md"
        variant="dark"
        // fixed="top"
        // collapseOnSelect
      >
        <div className="special-btns">
          <a onClick={onGetLegalHelpClick} className="legalhelpinfo">
            GET LEGAL HELP
          </a>
          <a href='https://www.lgbtbarny.org/donate' className="donate">
            DONATE
          </a>
        </div>
        <Navbar.Brand href="https://www.lgbtbarny.org/">
          <img className="logo-img ml-md-5" src="/images/logo.png" alt="LGBT Bar of NY" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="main-nav-links"
          className="ml-auto align-self-end"
        />
        <Navbar.Collapse
          id="main-nav-links"
          className="align-self-end"
        >
          <Nav className="ml-auto">
            {navItems}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default MainHeader