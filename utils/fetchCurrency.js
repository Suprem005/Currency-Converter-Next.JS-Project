export const fetchCurrency = async () => {
  try {
    const res = await fetch('https://api.frankfurter.app/currencies');
    const data = await res.json();
    // const countryCode = Object.keys(data); //!this is for storing the country code only
    return data;
  } catch (error) {
    console.log('Failed to fetch the currencies!.');
  }
};
