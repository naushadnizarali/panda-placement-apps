import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

function AutoCompleteInput({ Value, data, label, onSelectedChange, disabled }) {
  const handleSelect = (event, selectedValue) => {
    onSelectedChange(selectedValue);
  };

  return (
    <Autocomplete
      id="country-customized-option-demo"
      options={data}
      onChange={handleSelect}
      //   disableCloseOnSelect
      // inputValue={Value}
      defaultValue={Value}
      disabled={disabled}
      getOptionLabel={(data) => `${data?.name}`}
      renderInput={(params) => (
        <TextField
          sx={{
            '& .MuiInputBase-input': {
              backgroundColor: 'var(--white-color)',
              outline: 'none',
            },
          }}
          {...params}
          // label={label}
          placeholder={label}
        />
      )}
    />
  );
}

export default AutoCompleteInput;
