import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import styles from './CvManager.module.css';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({
  alltemplate,
  updateTemplateID,
  selectedTemplate,
  templateId,
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {/* <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs> */}
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div className={styles.modalContentGridforLessthen_5}>
          {alltemplate &&
            alltemplate.map((template, index) => (
              <div key={template.temID} className={styles.templateInModalGrid}>
                <img
                  onClick={() =>
                    updateTemplateID(template.temID, template.image)
                  }
                  src={template.image}
                  alt={`CV Template ${template.temID}`}
                  className={
                    template.temID === templateId
                      ? styles.selectedTemplate
                      : styles.templateImage
                  }
                  style={
                    template.temID === templateId ? selectedTemplate : null
                  }
                />
              </div>
            ))}
        </div>
      </CustomTabPanel>
      {/* //TODO: Tabs Fix */}
      <CustomTabPanel value={value} index={1}>
        <div className={styles.modal}>
          <div className={styles.modalContentGridforLessthen_5}>
            {alltemplate &&
              alltemplate?.map((template, index) => (
                <>
                  <div
                    key={template.temID}
                    className={styles.templateInModalGrid}
                  >
                    <img
                      onClick={() =>
                        updateTemplateID(template.temID, template.image)
                      }
                      src={template.image}
                      alt={`CV Template ${template.temID}`}
                      // className={template.temID === templateId ? styles.selectedTemplate : styles.templateImage}
                      className={styles.templateImage}
                      style={
                        template.temID === templateId ? selectedTemplate : null
                      }
                    />
                  </div>
                </>
              ))}
          </div>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <div className={styles.modal}>
          <div className={styles.modalContentGridforLessthen_5}>
            {alltemplate &&
              alltemplate?.map((template, index) => (
                <>
                  <div
                    key={template.temID}
                    className={styles.templateInModalGrid}
                  >
                    <img
                      onClick={() =>
                        updateTemplateID(template.temID, template.image)
                      }
                      src={template.image}
                      alt={`CV Template ${template.temID}`}
                      // className={template.temID === templateId ? styles.selectedTemplate : styles.templateImage}
                      className={styles.templateImage}
                      style={
                        template.temID === templateId ? selectedTemplate : null
                      }
                    />
                  </div>
                </>
              ))}
          </div>
        </div>
      </CustomTabPanel>
    </Box>
  );
}
