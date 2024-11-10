import axios from 'axios'
import UserAgent from 'user-agents'


const baseUrl = 'https://www.nseindia.com';
let cookies = '';
let userAgent = '';
let cookieUsedCount = 0;
const cookieMaxAge = 60; // should be in seconds
let cookieExpiry = new Date().getTime() + (cookieMaxAge * 1000);
let noOfConnections = 0;
const baseHeaders = {
    'Authority': 'www.nseindia.com',
    'Referer': 'https://www.nseindia.com/',
    'Accept': '*/*',
    'Origin': baseUrl,
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Ch-Ua': '" Not A;Brand";v="99", "Chromium";v="109", "Google Chrome";v="109"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
};

async function getNseCookies() {
    if (cookies === '' || cookieUsedCount > 10 || cookieExpiry <= new Date().getTime()) {
        userAgent = new UserAgent().toString();
        const response = await axios.get(baseUrl, {
            headers: { ...baseHeaders, 'User-Agent': userAgent }
        });
        const setCookies = response.headers['set-cookie'];
        const cookieArray = [];
        setCookies.forEach((cookie) => {
            const requiredCookies = ['nsit', 'nseappid', 'ak_bmsc', 'AKA_A2', 'bm_mi', 'bm_sv'];
            const cookieKeyValue = cookie.split(';')[0];
            const cookieEntry = cookieKeyValue.split('=');
            /* istanbul ignore else */
            if (requiredCookies.includes(cookieEntry[0])) {
                cookieArray.push(cookieKeyValue);
            }
        });
        cookies = cookieArray.join('; ');
        cookieUsedCount = 0;
        cookieExpiry = new Date().getTime() + (cookieMaxAge * 1000);
    }
    cookieUsedCount++;
    return cookies;
}

// async function getData(url) {
//     let retries = 0;
//     let hasError = false;

//     do {
//         while (noOfConnections >= 5) {
//             await sleep(500);
//         }
//         noOfConnections++;

//         try {
//             const response = await axios.get(url, {
//                 headers: {
//                     baseHeaders,
//                     'Cookie': await getNseCookies(),
//                     'User-Agent': userAgent
//                 }
//             });
//             noOfConnections--;
//             return response.data;
//         } catch (error) {
//             hasError = true;
//             retries++;
//             noOfConnections--;
//             if (retries >= 10) {
//                 throw error;
//             }
//         }
//     } while (hasError); 
// }

async function fetchStock(para) {
    try {
        const data = await axios.get(para,{
            headers: {
                       baseHeaders,
                       'Cookie': await getNseCookies(),
                       'User-Agent': userAgent
                   }
        });
        return data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export {fetchStock}