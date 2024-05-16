import axios from 'axios';
import moment from 'moment';

export const ConvertCurrency = async (from, into, amount) => {
  const amountValue = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (amountValue === 0 || isNaN(amountValue) || amountValue < 0) {
    return {
      currencyResult: '',
      currencyRate: '',
      error: 'Invalid input',
    };
  }

  const fromValue = from.split(' ')[0].trim();
  const intoValue = into.split(' ')[0].trim().toUpperCase();
  const url = `https://v6.exchangerate-api.com/v6/e6bacdd114ac76a4b6eac80a/latest/${fromValue}`;

  try {
    const response = await axios.get(url);
    const parsedData = response?.data;

    if (intoValue in parsedData.conversion_rates) {
      const currencyRate = parsedData?.conversion_rates[intoValue];
      const currencyResult = amountValue * currencyRate;

      return {
        currency: intoValue,
        currencyRate: currencyRate.toFixed(2),
        currencyResult: currencyResult.toFixed(2),
        amountValue: amountValue.toString(),
        update: moment(parsedData.time_last_update_utc).format(
          'DD/MM/YYYY HH:mm:ss',
        ),
      };
    } else {
      return {
        currencyResult: '',
        currencyRate: '',
        error: 'Invalid data',
      };
    }
  } catch (error) {
    return {
      currencyResult: '',
      currencyRate: '',
      error: 'Error while converting currency',
    };
  }
};
