// const HOSTED_IP = ".."
// const HOSTED_IP = "https://18.220.185.191";
// const HOSTED_IP = "http://192.168.0.106:8000";
// const HOSTED_IP = 'https://pandaplacement.com';// PRODUCTION
const HOSTED_IP = 'https://dev.pandaplacement.com';// DEVELOPMENT

const LOCAL_URL_USER = `${HOSTED_IP}/api/`;
const LOCAL_URL_EMPLOYER = `${HOSTED_IP}/api/employer`;
const LOCAL_URL_MANAGER = `${HOSTED_IP}/api/manager`;
//Images main b LOCAL_PDF_EMPLOYER use ki ha
const LOCAL_PDF_EMPLOYER = `${HOSTED_IP}`;
const GET_OPEN_RESUME = `${HOSTED_IP}/api/user/openresume/`;

export {
  LOCAL_URL_MANAGER,
  LOCAL_URL_USER,
  LOCAL_URL_EMPLOYER,
  LOCAL_PDF_EMPLOYER,
  GET_OPEN_RESUME,
  HOSTED_IP,
};
