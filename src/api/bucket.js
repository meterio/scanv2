import { get } from '@/utils/http';

const bucket = {
  getBucket(network, id) {
    return get(network, `buckets/${id}`);
  },
};

export default bucket;
