import { get } from '@/utils/http';

export default {
  getPresent(network) {
    return get(network, `auctions/present`);
  },

  getPast(network, page, limit) {
    return get(network, `auctions/past?page=${page}&limit=${limit}`);
  },

  getBids(auctionID, network, page, limit) {
    return get(network, `auctions/${auctionID}/bids?page=${page}&limit=${limit}`);
  },

  getAutobidSummaries(auctionID, network) {
    return get(network, `auctions/${auctionID}/autobidSummaries`);
  },

  getAutobids(epoch, network, page, limit) {
    return get(network, `auctions/${epoch}/autobidSummaries?page=${page}&limit=${limit}`);
  },

  getUserbids(auctionID, network, page, limit) {
    return get(network, `auctions/${auctionID}/userbids?page=${page}&limit=${limit}`);
  },

  getAuction(network, auctionID) {
    return get(network, `auctions/${auctionID}`);
  },
};
