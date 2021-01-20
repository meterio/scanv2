import { get } from "@/utils/http";

export default {
  getPresent(network,){
    return get(network,`auctions/present`)
  },

  getPast(network,){
    return get(network,`auctions/past`)
  },

  getBids(network,auctionID){
    return get(network,`auctions/${auctionID}/bids`)
  }

};

