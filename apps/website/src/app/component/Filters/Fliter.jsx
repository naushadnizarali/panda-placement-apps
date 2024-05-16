import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { INDUSTRY_CHOICES } from '../../pages/Jsondata/Jsondata';
import CustomButton from '../Button/CustomButton';
import { ResumeInput, ResumeSelect } from '../Input/TextInput';
import Jobcard from '../Jobcard/Jobcard';
import CustomSpinner from '../Spinner/Spinner';
import Toast from '../Toast/Toast';
import UserApi from '../../Apis/UserApi';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../../redux/slice/loaderSlice';
import { bookmarkJob, removebookmarkJob } from '../../../redux/slice/jobSlice';
import style from './Filter.module.css';
import { removeCountryData } from '../../../redux/slice/SelectedCountrySlice';

const filters = [
  // {
  //   id: "city",
  //   name: "City",
  //   options: [
  //     { value: "karachi", label: "karachi", checked: false },
  //     { value: "lahore", label: "lahore", checked: false },
  //     { value: "Islamabad", label: "Islamabad", checked: true },
  //     { value: "Faisalabad", label: "Faisalabad", checked: false },
  //     { value: "Multan", label: "Multan", checked: false },
  //     { value: "Gujranwala", label: "Gujranwala", checked: false },
  //   ],
  // },
  {
    id: 'experience',
    name: 'Experience',
    options: [
      { value: 'Fresh', label: 'Fresh', checked: false },
      { value: '6 Month', label: '6 Month', checked: false },
      { value: '1 Years', label: '1 Years', checked: false },
      { value: '2 Years', label: '2 Years', checked: false },
      { value: '3 Years', label: '3 Years', checked: false },
      { value: '4 Years', label: '4 Years', checked: false },
      { value: '5 Years', label: '5 Years', checked: false },
      { value: '6 Years', label: '6 Years', checked: false },
      { value: '7 Years', label: '7 Years', checked: false },
      { value: '8 Years', label: '8 Years', checked: false },
      { value: '9 Years', label: '9 Years', checked: false },
      { value: '10+ Years', label: '10+ Years', checked: false },
    ],
  },
  // {
  //   id: "dateposted",
  //   name: "Date Posted",
  //   options: [
  //     { value: "LastHour", label: "Last Hour", checked: false },
  //     { value: "24hours", label: "Last 24 Hours", checked: false },
  //     { value: "7Days", label: "Last 7 Days", checked: false },
  //     { value: "14Days", label: "Last 14 Days", checked: false },
  //     { value: "30Days", label: "Last 30 Days", checked: false },
  //   ],
  // },
  {
    id: 'jobtype',
    name: 'Job Type',
    options: [
      { value: 'Full-time', label: 'Full Time', checked: false },
      { value: 'Part-time', label: 'Part Time', checked: false },
      { value: 'Contract', label: 'Contract', checked: false },
      { value: 'Temporary', label: 'Temporary', checked: false },
      { value: 'Internship', label: 'Internship', checked: false },
    ],
  },
];
function classNames(...classes) {
  return classes.filter(Boolean).join('');
}

export default function UserFilter({ Alljobs, title, location, isloading }) {
  const Alljob = useSelector((state) => state?.getAuthUserJobs?.data);
  const userapi = UserApi();
  // const [isLoading, setisLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState(Alljob);
  const [jobTitle, setjobTitle] = useState(title);
  const [jobLocation, setjobLocation] = useState(location);
  const [filterOnJobType, setfilterOnJobType] = useState('');
  const [filterOnExperience, setfilterOnExperience] = useState('');
  const [filterCateogory, setfilterCateogory] = useState('');
  const [filterOnTime, setfilterOnTime] = useState('');
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.loading);
  const handleJobTitleChange = (e) => {
    setjobTitle(e.target.value);
    filterJobs();
  };

  const handleJobLocationChange = (e) => {
    setjobLocation(e.target.value);
    filterJobs();
  };
  const handleRemoveFilter = () => {
    dispatch(setLoading(true));
    if (
      jobTitle ||
      jobLocation ||
      filterOnJobType ||
      filterCateogory ||
      filterOnExperience
    ) {
      setjobTitle('');
      setjobLocation('');
      setfilterOnJobType('');
      setfilterCateogory('');
      setfilterOnExperience('');
      dispatch(setLoading(false));
      dispatch(removeCountryData());
    } else {
      Toast.error('Filter Not Select!');
      dispatch(setLoading(false));
    }
  };

  const filterJobs = () => {
    if (
      !jobTitle &&
      !jobLocation &&
      !filterCateogory &&
      (!filterOnJobType || filterOnJobType?.length === 0) &&
      (!filterOnExperience || filterOnExperience?.length === 0)
    ) {
      setFilteredJobs(Alljob);
    } else {
      const filtered = Alljob?.filter((job) => {
        const titleMatch = jobTitle
          ? job?.title?.toLowerCase()?.includes(jobTitle?.toLowerCase())
          : true;
        const locationMatch = jobLocation
          ? job?.hiring_city
              ?.toLowerCase()
              ?.includes(jobLocation?.toLowerCase()) ||
            job?.hiring_country
              ?.toLowerCase()
              ?.includes(jobLocation?.toLowerCase())
          : true;
        const category = filterCateogory
          ? job?.category
              ?.toLowerCase()
              ?.includes(filterCateogory?.toLowerCase())
          : true;
        // Check if no job type is selected or if the job's type matches any selected job type
        const jobTypeMatch =
          !filterOnJobType ||
          filterOnJobType?.length === 0 ||
          filterOnJobType?.some(
            (selectedType) =>
              job?.type?.toLowerCase() === selectedType?.toLowerCase()
          );
        const jobExperience =
          !filterOnExperience ||
          filterOnExperience?.length === 0 ||
          filterOnExperience?.some(
            (selectedType) =>
              job?.experience?.toLowerCase() === selectedType?.toLowerCase()
          );
        return (
          titleMatch &&
          locationMatch &&
          jobTypeMatch &&
          category &&
          jobExperience
        );
      });
      setFilteredJobs(filtered);
    }
  };

  const handleCheckboxChange = (selectedType) => {
    setfilterOnJobType((prevTypes) => {
      if (prevTypes.includes(selectedType)) {
        // If the type is already selected, remove it
        return prevTypes.filter((type) => type !== selectedType);
      } else {
        // If the type is not selected, add it
        return [...prevTypes, selectedType];
      }
    });
  };

  const handleCheckboxExperienceChange = (selectedType) => {
    setfilterOnExperience((prevTypes) => {
      if (prevTypes.includes(selectedType)) {
        // If the type is already selected, remove it
        return prevTypes.filter((type) => type !== selectedType);
      } else {
        // If the type is not selected, add it
        return [...prevTypes, selectedType];
      }
    });
  };

  const addBookmark = async (e) => {
    try {
      const response = await userapi.postSaveJobs(e);
      Toast.success('Job Saved');
      // console.log("respone" , e)
      dispatch(bookmarkJob(e));
    } catch (error) {
      console.error('ERROR:ADDING THE BOOKMARK', error);
    }
  };

  const deleteBookmark = async (id) => {
    // setisloading(true)
    try {
      const response = await userapi.deleteSaveJobs(id);
      Toast.success('Job unSaved');
      dispatch(removebookmarkJob(id));
    } catch (error) {
      // setisloading(false)
      console.log('Error in My JOb', error);
      Toast.error('ERROR: Please Try Later');
    }
  };

  useEffect(() => {
    filterJobs();
  }, [
    jobTitle,
    jobLocation,
    filterOnJobType,
    filterCateogory,
    filterOnExperience,
    jobTitle,
    jobLocation,
  ]);

  useEffect(() => {
    if (Alljob?.length === 0) {
      setFilteredJobs([]);
    } else {
      const filtered = Alljob?.filter((job) => {
        const titleMatch = title
          ? job?.title?.toLowerCase()?.includes(title?.toLowerCase())
          : true;
        const locationMatch = location
          ? job?.hiring_city
              ?.toLowerCase()
              ?.includes(location?.toLowerCase()) ||
            job?.hiring_country
              ?.toLowerCase()
              ?.includes(location?.toLowerCase())
          : true;
        return titleMatch && locationMatch;
      });
      setFilteredJobs(filtered);
    }
  }, [Alljob, title, location]);

  return (
    <div>
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className="relative ml-auto flex h-full max-w-45 flex-col overflow-y-auto bg-white py-4 pb-12 shadow"
                  style={{ width: '45%' }}
                >
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900 mb-0">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <div className="px-2 mb-3 mt-2">
                      <div>
                        <h6 style={{ marginBottom: '1rem', fontSize: '15' }}>
                          Search by Keywords
                        </h6>
                        <ResumeInput
                          backgroundColor="white"
                          borderColor="lightgray"
                          placeholder="job title Or keywords"
                          borderWidth={0.2}
                          width="100%"
                          borderradius={6}
                          onChange={handleJobTitleChange}
                          value={jobTitle}
                        />
                      </div>
                      <div>
                        <h6 style={{ marginTop: '1rem', fontSize: '15' }}>
                          Location
                        </h6>
                        <ResumeInput
                          backgroundColor="white"
                          borderColor="lightgray"
                          placeholder="City And Country"
                          borderWidth={0.2}
                          width="100%"
                          borderradius={6}
                          onChange={handleJobLocationChange}
                          value={jobLocation}
                        />
                      </div>
                      <div>
                        <h6 style={{ marginTop: '1rem', fontSize: '15' }}>
                          Category
                        </h6>
                        <ResumeSelect
                          isStatus
                          title="Category"
                          options={INDUSTRY_CHOICES}
                          value={filterCateogory}
                          onChange={(e) => {
                            setfilterCateogory(e.target.value);
                          }}
                          required
                        />
                      </div>
                    </div>

                    {filters &&
                      filters.map((section) => (
                        <Disclosure
                          as="div"
                          key={section.id}
                          className="border-b border-gray-200 py-6 px-6"
                        >
                          {({ open }) => (
                            <>
                              <h3 className="-my-3 flow-root">
                                <Disclosure.Button className="flex w-full items-center justify-between  py-3 text-sm text-gray-400 hover:text-gray-500">
                                  <span className="fs-6 bg-red text-xs  text-gray-900">
                                    {section.name}
                                  </span>
                                  <span className="ml-6 flex items-center">
                                    {open ? (
                                      <MinusIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <PlusIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </Disclosure.Button>
                              </h3>
                              {/* <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-black-600"
                                  onClick={handleCheakbox}
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel> */}
                              <Disclosure.Panel className="pt-6">
                                {section.id === 'dateposted' ? (
                                  // Date Posted Filter
                                  <div className="space-y-4">
                                    {section &&
                                      section?.options?.map(
                                        (option, optionIdx) => (
                                          <div
                                            key={option.value}
                                            className="flex items-center"
                                          >
                                            <input
                                              id={`filter-${section.id}-${optionIdx}`}
                                              name={`${section.id}[]`}
                                              defaultValue={option.value}
                                              type="checkbox"
                                              defaultChecked={option.checked}
                                              className="h-4 w-4 rounded border-gray-300 text-[var(--shade-of-blue)]"
                                              onChange={() => {
                                                setfilterOnTime(option.value);
                                              }}
                                            />
                                            <label
                                              htmlFor={`filter-${section.id}-${optionIdx}`}
                                              className="ml-3 text-sm text-black-600"
                                            >
                                              {option.label}
                                            </label>
                                          </div>
                                        )
                                      )}
                                  </div>
                                ) : section.id === 'jobtype' ? (
                                  // Job Type Filter
                                  <div className="space-y-4">
                                    {section.options.map(
                                      (option, optionIdx) => (
                                        <div
                                          key={option.value}
                                          className="flex items-center"
                                        >
                                          <input
                                            id={`filter-${section.id}-${optionIdx}`}
                                            name={`${section.id}[]`}
                                            defaultValue={option.value}
                                            type="checkbox"
                                            checked={filterOnJobType.includes(
                                              option.value
                                            )}
                                            // defaultChecked={option.checked}
                                            className="h-4 w-4 rounded border-gray-300 text-[var(--shade-of-blue)]"
                                            onChange={() =>
                                              handleCheckboxChange(option.value)
                                            }
                                          />
                                          <label
                                            htmlFor={`filter-${section.id}-${optionIdx}`}
                                            className="ml-3 text-sm text-black-600"
                                          >
                                            {option.label}
                                          </label>
                                        </div>
                                      )
                                    )}
                                  </div>
                                ) : section.id === 'experience' ? (
                                  // Job Type Filter
                                  <div className="space-y-4">
                                    {section &&
                                      section.options.map(
                                        (option, optionIdx) => (
                                          <div
                                            key={option.value}
                                            className="flex items-center"
                                          >
                                            <input
                                              id={`filter-${section.id}-${optionIdx}`}
                                              name={`${section.id}[]`}
                                              defaultValue={option.value}
                                              type="checkbox"
                                              checked={filterOnExperience.includes(
                                                option.value
                                              )}
                                              // defaultChecked={option.checked}
                                              className="h-4 w-4 rounded border-gray-300 text-[var(--shade-of-blue)]"
                                              onChange={() =>
                                                handleCheckboxExperienceChange(
                                                  option.value
                                                )
                                              }
                                            />
                                            <label
                                              htmlFor={`filter-${section.id}-${optionIdx}`}
                                              className="ml-3 text-sm text-black-600"
                                            >
                                              {option.label}
                                            </label>
                                          </div>
                                        )
                                      )}
                                  </div>
                                ) : null}
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* ------------------------------------website Filters------------------------------*/}
        <main className={style.findjobswrapwe}>
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center">
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-black hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}

              <form className=" bg-[var(--white-color)] px-2 py-4 rounded-lg  hidden lg:block">
                <div>
                  <h6 style={{ marginBottom: '1rem', fontSize: '15' }}>
                    Search by Keywords
                  </h6>
                  <ResumeInput
                    borderColor="lightgray"
                    placeholder="job title or keywords"
                    backgroundColor={'var(--light-shade-grayish-blue)'}
                    borderWidth={0.2}
                    width="100%"
                    borderradius={6}
                    onChange={handleJobTitleChange}
                    value={jobTitle}
                  />
                </div>
                <div>
                  <h6 style={{ marginTop: '1rem', fontSize: '15' }}>
                    Location
                  </h6>
                  <ResumeInput
                    backgroundColor={'var(--light-shade-grayish-blue)'}
                    borderColor="lightgray"
                    placeholder="City And Country"
                    borderWidth={0.2}
                    width="100%"
                    borderradius={6}
                    onChange={handleJobLocationChange}
                    value={jobLocation}
                  />
                </div>
                <div>
                  <h6 style={{ marginTop: '1rem', fontSize: '15' }}>
                    Category
                  </h6>
                  <ResumeSelect
                    backgroundColor={'var(--light-shade-grayish-blue)'}
                    isStatus
                    title="Category"
                    options={INDUSTRY_CHOICES}
                    value={filterCateogory}
                    onChange={(e) => {
                      setfilterCateogory(e.target.value);
                    }}
                    required
                  />
                </div>
                {filters &&
                  filters?.map((section) => (
                    <Disclosure
                      as="div"
                      key={section.id}
                      className="border-b border-gray-200 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between  py-3 text-sm text-gray-400 hover:text-gray-500">
                              <span className="fs-6 bg-red text-xs  text-gray-900">
                                {section.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          {/* <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.value}
                                className="flex items-center"
                              >
                                <input
                                  id={`filter-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type="checkbox"
                                  defaultChecked={option.checked}
                                  className="h-4 w-4 rounded border-gray-300 text-[var(--shade-of-blue)]"
                                />
                                <label
                                  htmlFor={`filter-${section.id}-${optionIdx}`}
                                  className="ml-3 text-sm text-black-600"
                                  onClick={handleCheakbox}
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel> */}
                          <Disclosure.Panel className="pt-6">
                            {section.id === 'dateposted' ? (
                              // Date Posted Filter
                              <div className="space-y-4">
                                {section &&
                                  section.options.map((option, optionIdx) => (
                                    <div
                                      key={option.value}
                                      className="flex items-center"
                                    >
                                      <input
                                        id={`filter-${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        defaultValue={option.value}
                                        type="checkbox"
                                        defaultChecked={option.checked}
                                        className="h-4 w-4 rounded border-gray-300 text-[var(--shade-of-blue)]"
                                        onChange={() => {
                                          setfilterOnTime(option.value);
                                        }}
                                      />
                                      <label
                                        htmlFor={`filter-${section.id}-${optionIdx}`}
                                        className="ml-3 text-sm text-black-600"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            ) : section.id === 'jobtype' ? (
                              // Job Type Filter
                              <div className="space-y-4">
                                {section &&
                                  section.options.map((option, optionIdx) => (
                                    <div
                                      key={option.value}
                                      className="flex items-center"
                                    >
                                      <input
                                        id={`filter-${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        defaultValue={option.value}
                                        type="checkbox"
                                        checked={filterOnJobType.includes(
                                          option.value
                                        )}
                                        // defaultChecked={option.checked}
                                        className="h-4 w-4 rounded border-gray-300 text-[var(--shade-of-blue)]"
                                        onChange={() =>
                                          handleCheckboxChange(option.value)
                                        }
                                      />
                                      <label
                                        htmlFor={`filter-${section.id}-${optionIdx}`}
                                        className="ml-3 text-sm text-black-600"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            ) : section.id === 'experience' ? (
                              // Job Type Filter
                              <div className="space-y-4">
                                {section &&
                                  section.options.map((option, optionIdx) => (
                                    <div
                                      key={option.value}
                                      className="flex items-center"
                                    >
                                      <input
                                        id={`filter-${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        defaultValue={option.value}
                                        type="checkbox"
                                        checked={filterOnExperience.includes(
                                          option.value
                                        )}
                                        // defaultChecked={option.checked}
                                        className="h-4 w-4 rounded border-gray-300 text-[var(--shade-of-blue)]"
                                        onChange={() =>
                                          handleCheckboxExperienceChange(
                                            option.value
                                          )
                                        }
                                      />
                                      <label
                                        htmlFor={`filter-${section.id}-${optionIdx}`}
                                        className="ml-3 text-sm text-black-600"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                              </div>
                            ) : null}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                {/* <Card data={data} /> */}
                <div className="flex items-center justify-between flex-wrap">
                  <p
                    style={{
                      fontFamily: 'sans-serif',
                      color: 'gray',
                      marginRight: '40px',
                    }}
                  >
                    Show
                    <span
                      style={{
                        fontFamily: 'sans-serif',
                        color: 'black',
                        fontWeight: '600',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                      }}
                    >
                      {filteredJobs?.length ?? '0'}
                    </span>
                    jobs
                  </p>
                  {/* <CustomButton
                    label="Remove Filters"
                    onClick={handleRemoveFilter}
                  /> */}

                  {loading ? (
                    <CustomSpinner />
                  ) : (
                    <CustomButton
                      label="Remove Filters"
                      onClick={handleRemoveFilter}
                    />
                  )}
                </div>
                {loading ? (
                  <div style={{ textAlign: 'center' }}>
                    <CustomSpinner />
                  </div>
                ) : filteredJobs && filteredJobs?.length === 0 ? (
                  <div style={{ textAlign: 'center' }}>
                    <h4>{jobTitle} Jobs Not Found!</h4>
                    <p>Search More...</p>
                  </div>
                ) : (
                  <div
                    style={{
                      margin: '0 -5%',
                      '@media (maxWidth: 600px)': {
                        margin: '0 -20%',
                      },
                    }}
                  >
                    <Jobcard
                      handleClick={(e) => deleteBookmark(e)} //Delete Bookmark
                      handleAddBookmark={(e) => addBookmark(e)} //Saved Bookmark
                      isFilterScreen
                      data={filteredJobs}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
