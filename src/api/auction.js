import { get } from "@/utils/http";

export default {
  getPresent(network,){
    return get(network,`auctions/present`)
  },

  getPast(network,page,limit){
    return get(network,`auctions/past?page=${page}&limit=${limit}`)
  },

  getBids(network,auctionID){
    return get(network,`auctions/${auctionID}/bids`)
  }

};

