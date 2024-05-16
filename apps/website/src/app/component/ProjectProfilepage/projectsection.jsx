import React, { useEffect, useState } from 'react';
import style from '../../pages/User/Hprofile/hprofile.module.css';
import { ImBin } from 'react-icons/im';
import { FaEdit } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';
import styles from '../Profilecards/Profilecards.module.css';
import UserApi from '../../Apis/UserApi';
import Toast from '../Toast/Toast';
import checkEmptyFields from '../ErrorFunctions/Validation';
import CustomSpinner from '../Spinner/Spinner';
import validator from 'validator';
import { ResumeInput } from '../Input/TextInput';
import CustomButton from '../Button/CustomButton';
import ReactQuill from 'react-quill';
import JobDescriptionComponent from '../JobDescription/JobDescriptionComponent';
function ProjectSection({ onUpdate }) {
  const [isloading, setIsloading] = useState(false);
  const [show, setShow] = useState(false);
  const userapi = UserApi();
  const [projects, setProjects] = useState([]);
  const [id, setid] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    url: '',
    role: '',
    description: '',
  });
  const [newProjectError, setNewProjectError] = useState({
    title: '',
    url: '',
    role: '',
    description: '',
  });
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProject({
      ...newProject,
      [name]: value,
    });
    if (name === 'url') {
      const linkError = validator.isURL(value) ? '' : 'Please Provide the Link';
      setNewProjectError({
        ...newProjectError,
        url: linkError,
      });
    }
  };
  const handleEditorChange = (value) => {
    setNewProject({
      ...newProject,
      description: value,
    });
  };

  const handleAddProject = () => {
    setProjects([...projects, newProject]);
    setNewProject({
      title: '',
      url: '',
      role: '',
      description: '',
    });
    setShowForm(!showForm);
    setid(null);
  };

  // const handleError = () => {
  //   Toast.error("Please Provide the Valid URL Link!");
  // };

  const postProject = async (e) => {
    setIsloading(true);
    // if (!checkEmptyFields(newProject)) {
    //   setIsloading(false);
    //   return;
    // }
    try {
      const response = await userapi.userProjectPost(newProject);
      Toast.success('Project Added!');
      setNewProject({
        title: '',
        url: '',
        role: '',
        description: '',
      });
      getAllProject();
      toggle();
      setid(null);
      setIsloading(false);
      onUpdate();
    } catch (error) {
      setIsloading(false);
      console.error('Error in Projection', error);
      Toast.error('Please try later!');
    }
  };
  const getAllProject = async () => {
    try {
      const response = await userapi.userProjectGet();
      setProjects(response);
    } catch (error) {
      console.error('Error in get all project', error);
    }
  };

  const EditProject = async (project) => {
    toggle();
    setNewProject({
      title: project.title,
      url: project.url,
      role: project.role,
      description: project.description,
    });
    setid(project?.id);
    const projectSection = document.getElementById('projectSection');
    if (projectSection) {
      projectSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const projectupdate = async () => {
    setIsloading(true);
    if (!checkEmptyFields(newProject)) {
      setIsloading(false);
      return;
    }
    try {
      const response = await userapi.userProjectupdate(id, newProject);
      getAllProject();
      setNewProject({
        title: '',
        url: '',
        role: '',
        description: '',
      });
      Toast.success('Project Update!');
      toggle();
      onUpdate();
      setIsloading(false);
    } catch (error) {
      Toast.error('Fail To Update!');
      setIsloading(false);
    }
  };
  const DeleteProject = async (project) => {
    setIsloading(true);
    try {
      const response = await userapi.userProjectDelete(project.id);
      // setProjects(response);
      Toast.success('Project Deleted!');
      getAllProject();
      onUpdate();
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      Toast.error('Please try later!');
      console.error('Error in Delete Project', error);
    }
  };

  useEffect(() => {
    getAllProject();
  }, []);

  const toggle = () => {
    setShow(!show);
    setid(null);
    setNewProject({
      title: '',
      url: '',
      role: '',
      description: '',
    });
  };

  return (
    <section className={style.myProfile_box} id="projectSection">
      <div className={style.boxHeadign}>
        <div>
          <h5>Projects</h5>
        </div>
        <div className={style.addEducation}>
          <button
            title="Add New"
            className="group cursor-pointer outline-none hover:rotate-90 duration-300"
          >
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17px"
              height="17px"
              viewBox="0 0 24 24"
              className="stroke-red-400 fill-none group-hover:fill-red-200 group-active:stroke-red-800 group-active:fill-red-800 group-active:duration-0 duration-300"
            >
              <path
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                strokeWidth="1.5"
              ></path>
              <path d="M8 12H16" strokeWidth="1.5"></path>
              <path d="M12 16V8" strokeWidth="1.5"></path>
            </svg> */}
            <IoIosAddCircleOutline style={{ color: 'red' }} />
          </button>
          <a id="addEducation" onClick={toggle}>
            Add Project
          </a>
        </div>
      </div>
      {show ? (
        <div className={style.qualifi_inputs}>
          <div className="row">
            <div className="col-sm-6">
              <div className="mb-3">
                <label htmlFor="title">Title</label>
                <ResumeInput
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  placeholder="Pandaplacement"
                  value={newProject.title}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-sm-6">
              <div className="">
                <label htmlFor="Role">Role</label>
                <ResumeInput
                  type="text"
                  className="form-control"
                  id="role"
                  name="role"
                  placeholder="Your Role"
                  value={newProject.role}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="mb-3">
                <label htmlFor="url">Url (optional)</label>
                <ResumeInput
                  type="text"
                  className="form-control"
                  id="url"
                  name="url"
                  placeholder="https://example.com"
                  value={newProject.url}
                  onChange={handleInputChange}
                />
                {/* {newProjectError.url && (
                  <span className="text-danger">{newProjectError.url}</span>
                )} */}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="">
                <label htmlFor="completePeriod">Description</label>
                {/* <textarea
                  type="text"
                  cols={30}
                  rows={4}
                  className="form-control"
                  id="completePeriod"
                  placeholder="Short Description "
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                /> */}
                <ReactQuill
                  theme="snow"
                  // modules={modules}
                  // formats={formats}
                  name="description"
                  onChange={handleEditorChange}
                  value={newProject.description}
                  style={{
                    height: '200px',
                    marginBottom: '3rem',
                    width: '100%',
                    borderradius: '0.25rem',
                  }}
                />
              </div>
            </div>
          </div>
          {isloading ? (
            <CustomSpinner />
          ) : id ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: '.5rem',
                marginBottom: '.5rem',
              }}
            >
              <CustomButton onClick={projectupdate} label="Update" />
              <CustomButton onClick={toggle} label="Cancel" />
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: '.5rem',
                marginBottom: '.5rem',
              }}
            >
              <CustomButton onClick={postProject} label="Save" />
              <CustomButton onClick={toggle} label="Cancel" />
            </div>
          )}
        </div>
      ) : null}
      {projects?.length == 0 ? (
        <p>Project not Found!</p>
      ) : isloading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CustomSpinner />
        </div>
      ) : (
        projects &&
        projects.map((e, i) => (
          <div className={styles.resume_block}>
            <div className={styles.inner}>
              <span className={styles.name}>{e.title.slice(0, 1)}</span>
              <div className={styles.title_box}>
                <div className={styles.info_box}>
                  <h5>{e.title}</h5>
                  <h6>{e.role}</h6>
                  <a href={e.url}>{e.url}</a>
                </div>
                <div className={styles.edit_box}>
                  <div className={styles.edit_btns}>
                    <button className={styles.icons}>
                      <ImBin
                        // icon={faTrashCan}
                        style={{ color: 'red', width: '100%' }}
                        className={styles.trash}
                        onClick={() => DeleteProject(e)}
                      />
                    </button>
                    <button className={styles.icons}>
                      <FaEdit
                        style={{ color: 'green', width: '100%' }}
                        onClick={() => EditProject(e)}
                        // icon={faPenToSquare}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className={styles.text}>
                <JobDescriptionComponent
                  description={e?.description}
                  isblog={true}
                />
                {/* <p style={{ marginTop: "20px" }}>{e.description}</p> */}
              </div>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default ProjectSection;
