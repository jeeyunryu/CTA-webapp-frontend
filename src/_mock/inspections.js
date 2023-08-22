import axios from 'axios';

const fetchInspectionData = async () => {
    try {
        const response = await axios.get('http://localhost:3002/inspections')
        return response.data
    } catch (error) {
        console.error('Error fetching data: ', error);
        return undefined
    }
}

export { fetchInspectionData };