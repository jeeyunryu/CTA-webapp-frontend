import axios from 'axios';
import { useState } from 'react';

// ----------------------------------------------------------------------

// const users = [...Array(24)].map((_, index) => ({
//   // id: faker.datatype.uuid(),
//   // avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
//   // name: faker.name.fullName(),
//   // company: faker.company.name(),
//   // isVerified: faker.datatype.boolean(),
//   // status: sample(['active', 'banned']),
//   // role: sample([
//   //   'Leader',
//   //   'Hr Manager',
//   //   'UI Designer',
//   //   'UX Designer',
//   //   'UI/UX Designer',
//   //   'Project Manager',
//   //   'Backend Developer',
//   //   'Full Stack Designer',
//   //   'Front End Developer',
//   //   'Full Stack Developer',
//   // ]),
// }));


const fetchEquipmentData = async () => {
  try {
    const response = await axios.get('http://localhost:3002/equipments');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return undefined;
  }
}

// const [equipments, setEquipments] = useState([
//   {
//     id: 1,
//     code: 'ks1234',
//     name: '프레스',
//     installationDate: '20230802',
//     location: 'A동',
//     state: '안전',
//     latestInspectionDate: '20230802',
//     isDefective: '불필요',
//   },
//   {
//     id:2,
//     code: 'ks1235',
//     name: 'albert',
//   }
// ]);


// export default equipments;
export { fetchEquipmentData };
