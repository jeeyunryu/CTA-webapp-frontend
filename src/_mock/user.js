import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

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

const users = [
  {
    code: 'ks1234',
    name: '프레스',
    installationDate: '20230802',
    location: 'A동',
    state: '안전',
    latestInspectionDate: '20230802',
    isDefective: '불필요',
  },
  {
    code: 'ks1235',
    name: 'albert',
  }
]

export default users;
