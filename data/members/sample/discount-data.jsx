export const DISCOUNTS = {
  merch: {
    key: 'merch',
    image: '/images/discounts/zazzle.png',
    imageOptions: {
      backgroundPosition: 'center',
      backgroundSize: '32%',
    },
    colors: ['#13a5de', '#13a5de'],

    title: 'Merchandise on Zazzle',
    description: <span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br /><br />

      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>,
    categories: ['merch'],
  },
  lgbtbar: {
    key: 'lgbtbar',
    image: '/images/discounts/lgbt-bar.png',
    imageOptions: {
      backgroundPosition: 'center',
      backgroundSize: '30%',
    },
    colors: ['#e34e2a', '#42474d'],

    title: 'National LGBT Bar Association',
    description: <span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br /><br />

      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>,
    categories: ['lgbtbar'],
  },
  dinner: {
    key: 'dinner',
    image: '/images/discounts/dinner.jpg',
    imageOptions: { backgroundPosition: 'center -2.1em' },
    colors: ['#c41d7f', '#40a9ff'],

    title: 'Annual Dinner',
    description: <span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br /><br />

      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>,
    categories: ['events'],
  },
  mm: {
    key: 'mm',
    image: '/images/discounts/mass-mutual.svg',
    imageOptions: {
      backgroundPosition: `center`,
      backgroundSize: '80%',
    },
    colors: ['#002f6c', '#002f6c'],

    title: 'MassMutual',
    description: <div>
      <p>Members of LeGaL have the opportunity to apply for discounted long-term care and disability policies. The policies (with limited exceptions) are issued by Massachusetts Mutual Life Insurance Company (MassMutual) and are administered by Castlebrook Partners. The MassMutual long-term care product is available at a 10 percent discount to LeGaL members, spouses, domestic partners and extended family such as parents, in-laws, grandparents, and adult children. Discount is immediately available.</p>

      <p>The disability income insurance policies are also available to LeGaL members at discounts starting at 10 percent. Discount is available upon application by at least 3 LeGaL Members. Get more information on <a>Long Term Care</a>.</p>

      <p>Policies and services are offered overall inlcude: Life insurance; Disability income; Long-term care; Employee benefit programs; Business-oriented services; Health insurance*; College tuition funding plans; Retirement planning; Estate analysis and other investment* services<br />
      <span className="footnote"><em>*Not offered through MassMutual</em></span>
      </p>
      <strong>To access the LeGaL benefit, and for costs and complete details of coverage use discount code Law293 and contact Samuel Olshan at (212) 536-6006 or email <a href="mailto:solshan@castlebrookpartners.com" target="_blank">solshan@castlebrookpartners.com</a></strong>.
    </div>,
    categories: ['partner'],
  },
  kimpton: {
    key: 'kimpton',
    image: '/images/discounts/kimpton.jpg',
    imageOptions: {
      backgroundPosition: `center`,
      backgroundSize: '60%',
    },
    colors: ['#31a7e5', '#31a7e5'],

    title: 'Kimpton Hotels & Restaurants',
    description: <div>LeGaL Members enjoy:
    <ul>
      <li>Exclusive rates of 20% off the Best Available Rate* every day at any Kimpton Hotel</li>
      <li>Group rates starting at 15% off the Best Available Rate**</li>
      <li>Complimentary high-speed Internet for Kimpton InTouch members.</li>
    </ul>
    <span><strong>When you're ready to book your next Kimpton stay, simply call 1-800-KIMPTON and give your “Global Business ID” of GBP10118 to the reservation agent. You may also book online at <a href="https://www.kimptonhotels.com/" target="_blank">kimptonhotels.com</a>:</strong></span>
    <ul style={{ fontWeight: 'bold' }}>
      <li>Click on Reservations</li>
      <li>Select the city and hotel, click the “Rates and Reservations” button</li>
      <li>Enter the LeGaL code in the Global Business ID field (please use all capital letters)</li>
    </ul>
      <span className="footnote">
        *Best available public rate excludes negotiated or discounted room rates.<br />
        ** To inquire about group availability, please contact your Kimpton Hotel of choice directly and identify yourself as a Global Business Program member and provide your booking code. Groups are subject to availability and the rate cannot be used in conjunction with another promotion or towards groups already contracted at a Kimpton Hotel. Group rates are net, non-commissionable.
      </span>
    </div>,
    categories: ['partner'],
  },
  wellsfargo: {
    key: 'wellsfargo',
    image: '/images/discounts/wells-fargo.svg',
    imageOptions: {
      backgroundPosition: `center`,
      backgroundSize: '80%',
    },
    colors: ['rgb(252, 198, 10)', '#d71e2b'],

    title: 'Wells Fargo',
    description: <span>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br /><br />

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>,
    categories: ['partner'],
  },
  flowers: {
    key: 'flowers',
    image: '/images/discounts/1-800-flowers.png',
    imageOptions: {
      backgroundPosition: `center`,
      backgroundSize: '40%',
      border: '1px solid rgb(0, 0, 0, 0.2)',
    },
    colors: ['#5e3987', 'white'],

    title: '1-800-Flowers.com',
    description: <span>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br /><br />

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>,
    categories: ['partner'],
  },
  zipcar: {
    key: 'zipcar',
    image: '/images/discounts/zipcar.svg',
    imageOptions: {
      backgroundPosition: `center`,
      backgroundSize: '20%',
    },
    colors: ['#4b9c3e', '#4b9c3e'],
    title: 'ZipCar',
    description: <span>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br /><br />

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>,
    categories: ['partner'],
  },
  arnoff: {
    key: 'arnoff',
    image: '/images/discounts/arnoff.webp',
    imageOptions: {
      backgroundPosition: `center`,
      backgroundSize: '80%',
    },
    colors: ['#07f79c', 'black'],
    title: 'The Arnoff Company, Inc.',
    description: <span>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br /><br />

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>,
    categories: ['partner'],
  },
  popcornfactory: {
    key: 'popcornfactory',
    image: '/images/discounts/popcornfactory.webp',
    imageOptions: {
      backgroundPosition: `center`,
      backgroundSize: '40%',
      border: '1px solid rgb(0, 0, 0, 0.2)',
    },
    colors: ['rgb(176, 17, 22)', 'white'],
    title: 'The Popcorn Factory',
    description: <span>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.<br /><br />

    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>,
    categories: ['partner'],
  },
};
