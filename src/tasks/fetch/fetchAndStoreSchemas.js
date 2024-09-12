import { config } from '../../utils/index.js';
import { fetchAndStoreSchema } from './index.js';
const { schemas } = config;
const fetchAndStoreSchemas = async ctx => {
  const allSchemas = await Promise.all(
    schemas.map(({ name, url }) => fetchAndStoreSchema(name, url))
  );
  ctx.allSchemas = allSchemas;
};

export default fetchAndStoreSchemas;
