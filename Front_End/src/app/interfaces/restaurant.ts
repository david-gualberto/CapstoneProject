

export interface Restaurant {
averageRating: number,
awardInfo:any,
currentOpenStatusCategory: string,
currentOpenStatusText: string
detailedReview: any,
distanceTo: string,
establishmentTypeAndCuisineTags: string[],
hasMenu: boolean,
heroImgRawHeight: number,
heroImgRawWidth: number,
heroImgUrl: string
isDifferentGeo:boolean,
isLocalChefItem: boolean,
isPremium: boolean,
isStoryboardPublished:boolean,
locationId: number
menuUrl:string,
name: string,
offers: any[],
parentGeoName: string
priceTag: string,
restaurantsId: string
reviewSnippets: Review[],
squareImgRawLength: number,
squareImgUrl: string
userReviewCount: number
}

export interface Review {
  reviewText: string;
  reviewUrl:string;
}

export interface Favorite {
  idrestaurant: string;
  restaurant:string;
}

export interface FavoriteUser {
  id: number;
  idrestaurant:string;
}
