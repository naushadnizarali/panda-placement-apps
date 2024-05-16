import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Avatar from '@mui/material/Avatar';
import { Fragment } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../redux/slice/loginSlice';
import DefaultImage from '../../../assets/defaultImage.webp';
import Logo from '../../../assets/png with Transparent background (1).png';
import style from './navbar.module.css';
import CustomButton from '../Button/CustomButton';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userdata.data);

  const isAuthenticated = useSelector(
    (state) => state.loginuser.isAuthenticated
  );
  //unAuthenticate User Navbar Access
  const commonItems = [
    { name: 'Jobs', href: '/findJobs', current: false },
    { name: 'Blogs', href: '/blogs', current: false },
    { name: 'Contact us', href: '/contactus', current: false },
  ];

  //Authenticate User Navbar Access
  const userItems = [
    { name: 'Jobs', href: '/findJobs', current: false },
    { name: 'CV Manager', href: '/cvmanager', current: false },
    { name: 'Applied Jobs', href: '/myjobs', current: false },
    { name: 'Save', href: '/bookmarks', current: false },
    { name: 'Blogs', href: '/blogs', current: false },
    { name: 'Contact us', href: '/contactus', current: false },
  ];

  const Items = isAuthenticated ? [...userItems] : [...commonItems];

  const Findajob = () => {
    navigate('/user/login');
  };
  const postajob = () => {
    navigate('/employer/login');
  };

  const Logout = async () => {
    dispatch(logoutUser());
    await localStorage.removeItem('Usertoken');
    navigate('/');
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/user/home');
    } else {
      navigate('/');
    }
  };

  return (
    <Disclosure
      as="nav"
      className={`bg-[var(--white-color)] shadow-md w-full z-10 fixed top-0`}
    >
      {({ open }) => (
        <>
          <div className={style.navbarwrap}>
            <div className="relative flex h-16 items-center justify-center sm:justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button
                  className="relative inline-flex items-center justify-center rounded-md p-2
                        text-gray-400 hover:text-gray focus:outline-none focus:ring-inset
                 focus:ring-[var(--deep-sky-blue)]"
                >
                  <span className="absolute -inset-0.5" />
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
                <div
                  className="flex flex-shrink-0 items-center"
                  onClick={handleLogoClick}
                >
                  <img
                    style={{
                      overflow: 'hidden',
                      cursor: 'pointer',
                      width: '100%',
                      height: '60px',
                      margin: '0 0px',
                    }}
                    className="h-8 w-auto"
                    src={Logo}
                    alt="Logo Here"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex  mt-3 space-x-4">
                    {Items &&
                      Items.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            'rounded-md px-3 py-2 text-sm font-medium  transition duration-500',
                            item.current
                              ? 'bg-[var(--navbar)]'
                              : 'text-[var(--dimgray)] focus:bg-[var(--navbar)] focus:text-[var(--primary-color)] hover:bg-[var(--navbar)] hover:text-[var(--primary-color)]  hover:shadow-md no-underline'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                {isAuthenticated ? (
                  <>
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex-shrink-0  relative d-md-flex d-block d-lg-flex d-xl-flex w-full pt-2 flex  text-black text-sm focus:outline-none justify-center items-center">
                          <p
                            style={{ fontSize: '1rem', margin: '0px' }}
                            className="d-none d-lg-block d-xl-block"
                          >
                            {/* {first}
                            {second} */}
                            {userData?.first_name} {userData?.last_name}
                            <span style={{ paddingLeft: '.5rem' }}>
                              <FaAngleDown
                                style={{ display: 'inline-flex' }}
                                // icon={faAngleDown}
                              />
                            </span>
                          </p>
                          <div className="flex flex-shrink-0 items-center ml-4 ">
                            <Avatar
                              alt="Avatar"
                              src={
                                userData?.image ? userData?.image : DefaultImage
                              }
                            />
                          </div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-black ring-opacity-5 focus:outline-none text"
                          style={{
                            boxShadow: '0px 1px 10px rgba(64, 79, 104, 0.2)',
                          }}
                        >
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile-preview"
                                className={classNames(
                                  active
                                    ? 'bg-gray-100  text-blue-700  text-decoration-none  transition-all duration-700 ease-in-out'
                                    : 'text-decoration-none',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                              >
                                Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/change-password"
                                className={classNames(
                                  active
                                    ? 'bg-gray-100  text-blue-700 text-decoration-none transition-all duration-700 ease-in-out'
                                    : 'text-decoration-none',
                                  'block px-4 py-2 text-sm text-gray-700 '
                                )}
                              >
                                Change Password
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={Logout}
                                className={classNames(
                                  active
                                    ? 'bg-gray-100  text-blue-700 text-decoration-none cursor-pointer transition-all duration-700 ease-in-out'
                                    : 'text-decoration-none ',
                                  'block px-4 py-2 text-sm text-gray-700 '
                                )}
                              >
                                Logout
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                ) : (
                  <div className="hidden sm:flex">
                    <CustomButton
                      onClick={Findajob}
                      label={'Candidate Login'}
                    />
                    <CustomButton onClick={postajob} label={'Employer Login'} />
                  </div>
                )}
                <div className="flex ">
                  {/* <ResumeSelect
                    width={100}
                    options={currency}
                    // value={"USD ($)"}
                    title="Currency"
                  /> */}
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2  pt-2">
              {Items &&
                Items.map((item) => (
                  <Link
                    key={item?.name}
                    as="a"
                    to={item?.href}
                    className={classNames(
                      item?.current
                        ? 'bg-gray-900 text-black'
                        : 'text-[var(--dimgray)] hover:bg-[var(--pale-blue)] hover:text-[var(--primary-color)]',
                      'block rounded-md px-3 py-2 text-base font-medium no-underline'
                    )}
                    aria-current={item?.current ? 'page' : undefined}
                  >
                    {item?.name}
                  </Link>
                ))}
            </div>
            <div className="mb-4">
              {isAuthenticated ? (
                <>
                  <Menu as="div" className="relative ml-3">
                    <div className="d-flex align-middle justify-between">
                      <Menu.Button className="relative  flex  bg-white text-black text-sm focus:outline-none mx-3 items-center">
                        <p style={{ paddingTop: 10, fontSize: '1rem' }}>
                          {/* {first}
                          {second} */}
                          {userData?.first_name}
                          {userData?.last_name}
                          <span style={{ paddingLeft: '.5rem' }}>
                            <FaAngleDown
                              style={{ display: 'inline-flex' }}
                              //  icon={faAngleDown}
                            />
                          </span>
                        </p>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile-preview"
                              className={classNames(
                                active ? 'bg-[var(--pale-blue)]' : '',
                                'block px-4 py-2 text-sm text-black'
                              )}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="/change-password"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Change Password
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              onClick={Logout}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >
                              Logout
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              ) : (
                <div className="flex ms-3">
                  <CustomButton onClick={Findajob} label={'Candidate Login'} />
                  <CustomButton onClick={postajob} label={'Employer Login'} />
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
