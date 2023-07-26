import axios from 'axios';
const instance = axios.create({
    baseURL: 'https://m-server.azurewebsites.net',
});
export const getAnswer = async (question) => {
    const result = await instance.get(`/getAnswer/${question}`);
    return result.data;
}
export const getMusicList = async () => {
    const result = await instance.get(`/getMusicList`);
    return result.data;
}
export const random = () => {
    const randomValue = [];
    const getRandomInt = (min, max) => {
        const _min = Math.ceil(min);
        const _max = Math.floor(max);
        const value = Math.floor(Math.random() * (_max - _min + 1)) + _min; // 含最大值和最小值
        if (randomValue.includes(value)) {
            return getRandomInt(min, max);
        } else {
            randomValue.push(value);
            if (randomValue.length > 10) {
                randomValue.shift();
            }
            return value;
        }
    }
    return getRandomInt
}
